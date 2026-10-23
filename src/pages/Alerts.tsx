import React, { useEffect, useState, useCallback } from 'react';
import { AlertTriangle, Filter, RefreshCw, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { AlertCard } from '../components/AlertCard';

export function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('active');
  const [severityFilter, setSeverityFilter] = useState('');

  const loadAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { limit: '100' };
      if (filter !== 'all') params.status = filter;
      if (severityFilter) params.severity = severityFilter;
      const data = await api.alerts(params);
      setAlerts(data);
    } catch {
      console.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  }, [filter, severityFilter]);

  useEffect(() => { loadAlerts(); }, [loadAlerts]);

  const handleAcknowledge = async (id: string) => {
    await api.acknowledgeAlert(id);
    loadAlerts();
  };

  const handleResolve = async (id: string) => {
    await api.resolveAlert(id);
    loadAlerts();
  };

  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const highCount = alerts.filter(a => a.severity === 'high').length;

  return (
    <div className="p-5 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-stone-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-800" /> Early Warning Alerts
          </h1>
          <p className="text-stone-500 text-sm">Real-time disease risk and water quality alerts</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadAlerts} className="btn-outline text-xs flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Critical', count: criticalCount, color: 'bg-pink-200/20 border-pink-200/40 text-pink-700', icon: '🔴' },
          { label: 'High', count: highCount, color: 'bg-orange-200/20 border-orange-200/40 text-orange-800', icon: '🟠' },
          { label: 'Moderate', count: alerts.filter(a => a.severity === 'moderate').length, color: 'bg-amber-200/20 border-amber-200/40 text-amber-800', icon: '🟡' },
          { label: 'Total Active', count: alerts.filter(a => a.status === 'active').length, color: 'bg-sky-200/20 border-sky-200/40 text-sky-700', icon: '⚡' },
        ].map(s => (
          <div key={s.label} className={`border rounded-xl p-3 ${s.color}`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold">{s.count}</div>
            <div className="text-xs opacity-70">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-3 flex flex-wrap gap-3 items-center">
        <Filter className="w-4 h-4 text-stone-500" />
        <div className="flex gap-1">
          {(['active', 'acknowledged', 'resolved', 'all'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs rounded-lg border transition-all capitalize ${filter === f ? 'bg-sky-200/20 border-sky-200/40 text-sky-600' : 'border-orange-100 hover:bg-orange-100 text-stone-700'}`}>
              {f}
            </button>
          ))}
        </div>
        <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className="input py-1.5 text-xs w-32">
          <option value="">All Severity</option>
          <option value="critical">🔴 Critical</option>
          <option value="high">🟠 High</option>
          <option value="moderate">🟡 Moderate</option>
          <option value="low">🟢 Low</option>
        </select>
      </div>

      {/* Alerts List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-orange-200 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-stone-700 text-sm">Loading alerts...</p>
          </div>
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-16 card">
          <CheckCircle className="w-12 h-12 text-emerald-700 mx-auto mb-3" />
          <h3 className="font-semibold text-stone-800 mb-1">No alerts found</h3>
          <p className="text-stone-500 text-sm">All monitored locations are within safe parameters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {alerts.map(alert => (
            <AlertCard key={alert._id} alert={alert} onAcknowledge={handleAcknowledge} onResolve={handleResolve} />
          ))}
        </div>
      )}
    </div>
  );
}

export default AlertsPage;
