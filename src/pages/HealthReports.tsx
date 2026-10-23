import React, { useEffect, useState, useCallback } from 'react';
import { FileText, Plus, Send, Loader2, Wifi, WifiOff, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getRiskLevel, RISK_COLORS } from '../utils';

const SYMPTOMS = [
  { key: 'diarrhea', label: 'Diarrhea', icon: '💧' },
  { key: 'vomiting', label: 'Vomiting', icon: '🤢' },
  { key: 'fever', label: 'Fever', icon: '🌡️' },
  { key: 'cholera', label: 'Cholera', icon: '⚠️' },
  { key: 'typhoid', label: 'Typhoid', icon: '🦠' },
  { key: 'jaundice', label: 'Jaundice', icon: '🟡' },
  { key: 'dysentery', label: 'Dysentery', icon: '🔴' },
  { key: 'nausea', label: 'Nausea', icon: '😷' },
  { key: 'abdominal_pain', label: 'Abdominal Pain', icon: '💊' },
];

export function HealthReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    village: '',
    symptoms: [] as string[],
    affectedCount: 1,
    severity: 'moderate',
    duration: 1,
    notes: '',
  });

  useEffect(() => {
    const onOnline = () => {
      setIsOnline(true);
      syncOfflineQueue();
    };
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    
    // Load offline queue from localStorage
    const queue = JSON.parse(localStorage.getItem('jalraksha_offline_queue') || '[]');
    setOfflineQueue(queue);
    
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [reportsData, locData] = await Promise.all([
        api.healthReports({ limit: '50' }),
        api.locations({ type: 'village' }),
      ]);
      setReports(reportsData);
      setLocations(locData);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const toggleSymptom = (key: string) => {
    setForm(f => ({
      ...f,
      symptoms: f.symptoms.includes(key) ? f.symptoms.filter(s => s !== key) : [...f.symptoms, key],
    }));
  };

  const syncOfflineQueue = async () => {
    const queue: any[] = JSON.parse(localStorage.getItem('jalraksha_offline_queue') || '[]');
    for (const item of queue) {
      try {
        await api.createHealthReport(item);
      } catch { /* ignore individual failures */ }
    }
    localStorage.setItem('jalraksha_offline_queue', '[]');
    setOfflineQueue([]);
    loadData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.village) { alert('Please select a village'); return; }
    if (form.symptoms.length === 0) { alert('Please select at least one symptom'); return; }
    setSubmitting(true);
    const payload = { ...form, reportedBy: user?.id };
    
    try {
      if (!isOnline) {
        // Save to offline queue
        const queue = JSON.parse(localStorage.getItem('jalraksha_offline_queue') || '[]');
        queue.push({ ...payload, offlineId: Date.now(), synced: false });
        localStorage.setItem('jalraksha_offline_queue', JSON.stringify(queue));
        setOfflineQueue(queue);
        setSuccess('Report saved offline. Will sync when connection is restored.');
      } else {
        await api.createHealthReport(payload);
        setSuccess('Report submitted successfully! Risk score updated.');
        loadData();
      }
      setForm({ village: '', symptoms: [], affectedCount: 1, severity: 'moderate', duration: 1, notes: '' });
      setShowForm(false);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      alert('Failed to submit: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-5 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-stone-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-700" /> Health Reports
          </h1>
          <p className="text-stone-500 text-sm">Community symptom reporting</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Online/Offline indicator */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs ${isOnline ? 'bg-emerald-200/20 border border-emerald-200/30 text-emerald-700' : 'bg-pink-200/20 border border-pink-200/30 text-pink-700'}`}>
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            {isOnline ? 'Online' : 'Offline'}
          </div>
          {offlineQueue.length > 0 && (
            <button onClick={syncOfflineQueue} className="btn text-xs bg-amber-200/20 border border-amber-200/30 text-amber-800 hover:bg-amber-200/30">
              Sync {offlineQueue.length} pending
            </button>
          )}
          <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> New Report
          </button>
        </div>
      </div>

      {success && (
        <div className="bg-emerald-200/20 border border-emerald-200/30 rounded-xl px-4 py-3 flex items-center gap-2 animate-slide-in">
          <CheckCircle className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <p className="text-emerald-600 text-sm">{success}</p>
        </div>
      )}

      {/* Report Form */}
      {showForm && (
        <div className="card border-sky-200/30 animate-slide-in">
          <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-sky-700" /> Submit Health Report
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Village / Location *</label>
                <select value={form.village} onChange={e => setForm(f => ({ ...f, village: e.target.value }))} className="input" required>
                  <option value="">Select village</option>
                  {locations.map(l => (
                    <option key={l._id} value={l._id}>{l.name} ({l.state})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">People Affected *</label>
                <input type="number" min={1} value={form.affectedCount} onChange={e => setForm(f => ({ ...f, affectedCount: Number(e.target.value) }))} className="input" />
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <label className="label">Symptoms Observed * (select all that apply)</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {SYMPTOMS.map(s => (
                  <button type="button" key={s.key} onClick={() => toggleSymptom(s.key)} className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-medium transition-all ${form.symptoms.includes(s.key) ? 'bg-sky-200/20 border-sky-200 text-sky-600' : 'bg-orange-100/50 border-orange-100 text-stone-700 hover:border-orange-200'}`}>
                    <span className="text-xl">{s.icon}</span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Severity</label>
                <select value={form.severity} onChange={e => setForm(f => ({ ...f, severity: e.target.value }))} className="input">
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="label">Duration (days)</label>
                <input type="number" min={1} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: Number(e.target.value) }))} className="input" />
              </div>
            </div>

            <div>
              <label className="label">Notes / Observations</label>
              <textarea rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="input resize-none" placeholder="Describe the situation, suspected water source, other relevant observations..." />
            </div>

            {!isOnline && (
              <div className="bg-amber-200/20 border border-amber-200/30 rounded-lg px-3 py-2">
                <p className="text-amber-800 text-xs">⚠️ You are offline. Report will be saved locally and synced when connection is restored.</p>
              </div>
            )}

            <div className="flex gap-2">
              <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2 flex-1">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {submitting ? 'Submitting...' : isOnline ? 'Submit Report' : 'Save Offline'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Reports List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-sky-200 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map(report => (
            <div key={report._id} className="card hover:border-orange-100 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-stone-800 text-sm">{report.village?.name || 'Unknown village'}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${report.severity === 'critical' ? 'bg-pink-200/20 text-pink-700' : report.severity === 'severe' ? 'bg-orange-200/20 text-orange-800' : report.severity === 'moderate' ? 'bg-amber-200/20 text-amber-800' : 'bg-emerald-200/20 text-emerald-700'}`}>
                      {report.severity}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {report.symptoms?.map((s: string) => {
                      const sym = SYMPTOMS.find(sym => sym.key === s);
                      return sym ? (
                        <span key={s} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-orange-100 rounded-full text-stone-700">
                          {sym.icon} {sym.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                  {report.notes && <p className="text-xs text-stone-500 line-clamp-2">{report.notes}</p>}
                </div>
                <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1">
                  <div className="text-center sm:text-right">
                    <div className="text-2xl font-bold text-orange-800">{report.affectedCount}</div>
                    <div className="text-xs text-stone-500">people</div>
                  </div>
                  <div className="text-xs text-stone-500">
                    {new Date(report.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {reports.length === 0 && (
            <div className="text-center py-12 card">
              <FileText className="w-10 h-10 text-stone-500 mx-auto mb-2" />
              <p className="text-stone-700">No health reports yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HealthReportsPage;
