import React, { useEffect, useState, useCallback } from 'react';
import { Stethoscope, Clock, User, MapPin, CheckCircle, AlertTriangle, ChevronDown } from 'lucide-react';
import api from '../services/api';
import { RISK_COLORS, RISK_ICONS, getRiskLevel } from '../utils';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-200/20 border-amber-200/40 text-amber-800',
  assigned: 'bg-sky-200/20 border-sky-200/40 text-sky-700',
  in_progress: 'bg-purple-200/20 border-purple-200/40 text-purple-700',
  completed: 'bg-emerald-200/20 border-emerald-200/40 text-emerald-700',
  referred: 'bg-orange-200/20 border-orange-200/40 text-orange-800',
};

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'text-pink-700',
  high: 'text-orange-800',
  medium: 'text-amber-800',
  low: 'text-emerald-700',
};

function ConsultationCard({ consult, onUpdate }: { consult: any; onUpdate: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(consult.doctorNotes || '');
  const [followUp, setFollowUp] = useState(consult.followUpDate?.slice(0, 10) || '');
  const [referral, setReferral] = useState(consult.referralHospital || '');
  const [updating, setUpdating] = useState(false);

  const statusStyle = STATUS_STYLES[consult.status] || STATUS_STYLES.pending;
  const riskColor = RISK_COLORS[consult.villageRiskLevel as keyof typeof RISK_COLORS] || RISK_COLORS.low;
  const priorityColor = PRIORITY_COLORS[consult.priority] || PRIORITY_COLORS.medium;

  const updateConsult = async (status: string) => {
    setUpdating(true);
    try {
      await api.updateConsultation(consult._id, {
        status,
        doctorNotes: notes,
        followUpDate: followUp || undefined,
        referralHospital: referral || undefined,
      });
      onUpdate();
    } catch { /* ignore */ }
    setUpdating(false);
  };

  return (
    <div className={`card border ${statusStyle} transition-all`}>
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold uppercase ${priorityColor}`}>{consult.priority} priority</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${statusStyle} capitalize`}>{consult.status.replace('_', ' ')}</span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-3.5 h-3.5 text-stone-500 flex-shrink-0" />
            <span className="font-medium text-stone-800 text-sm">{consult.village?.name}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: riskColor, background: riskColor + '20' }}>
              {RISK_ICONS[consult.villageRiskLevel as keyof typeof RISK_ICONS] || '🟡'} Risk: {consult.villageRiskScore}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-2">
            {consult.symptoms?.map((s: string) => (
              <span key={s} className="text-xs px-2 py-0.5 bg-orange-100 rounded-full text-stone-700 capitalize">{s.replace('_', ' ')}</span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-stone-500">
            <div className="flex items-center gap-1"><User className="w-3 h-3" /> {consult.requestedBy?.name}</div>
            <div className="flex items-center gap-1">👥 {consult.affectedCount} people</div>
            <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(consult.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
          </div>

          {consult.notes && (
            <p className="mt-2 text-xs text-stone-700 bg-orange-100/50 rounded-lg p-2 leading-relaxed">{consult.notes}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 items-start sm:items-end">
          {consult.assignedDoctor && (
            <div className="text-xs text-sky-700 flex items-center gap-1">
              <Stethoscope className="w-3 h-3" /> {consult.assignedDoctor.name}
            </div>
          )}
          <button onClick={() => setExpanded(!expanded)} className="btn-ghost text-xs flex items-center gap-1">
            Doctor Actions <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Doctor Actions Panel */}
      {expanded && (
        <div className="mt-4 border-t border-orange-100 pt-4 space-y-3 animate-slide-in">
          <div>
            <label className="label">Doctor Notes</label>
            <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} className="input resize-none text-sm" placeholder="Assessment, diagnosis approach, treatment plan... (AI will not diagnose or prescribe)" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Follow-up Date</label>
              <input type="date" value={followUp} onChange={e => setFollowUp(e.target.value)} className="input text-sm" />
            </div>
            <div>
              <label className="label">Referral Hospital</label>
              <input type="text" value={referral} onChange={e => setReferral(e.target.value)} className="input text-sm" placeholder="Hospital name if needed" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => updateConsult('in_progress')} disabled={updating} className="btn bg-purple-200/20 border border-purple-200/30 text-purple-600 hover:bg-purple-200/30 text-xs">
              Start Review
            </button>
            <button onClick={() => updateConsult('completed')} disabled={updating} className="btn bg-emerald-200/20 border border-emerald-200/30 text-emerald-600 hover:bg-emerald-200/30 text-xs flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Mark Complete
            </button>
            <button onClick={() => updateConsult('referred')} disabled={updating} className="btn bg-orange-200/20 border border-orange-200/30 text-orange-700 hover:bg-orange-200/30 text-xs flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Refer Patient
            </button>
          </div>
          <p className="text-xs text-stone-500 italic">⚠️ Disclaimer: AI system does not provide medical diagnosis or prescriptions. All medical decisions are made by the assigned doctor.</p>
        </div>
      )}
    </div>
  );
}

export function ConsultationsPage() {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filterStatus) params.status = filterStatus;
      const data = await api.consultations(params);
      setConsultations(data);
    } catch { /* ignore */ }
    setLoading(false);
  }, [filterStatus]);

  useEffect(() => { loadData(); }, [loadData]);

  const pending = consultations.filter(c => c.status === 'pending').length;
  const urgent = consultations.filter(c => c.priority === 'urgent').length;

  return (
    <div className="p-5 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-stone-800 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-sky-700" /> Doctor Consultations
          </h1>
          <p className="text-stone-500 text-sm">Health Worker → Doctor workflow</p>
        </div>
      </div>

      {/* Workflow Banner */}
      <div className="card bg-gradient-to-r from-sky-200/20 to-sky-200/20 border-sky-200/30">
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          {['Health Worker Reports', '→', 'Doctor Request', '→', 'Doctor Review', '→', 'Consultation', '→', 'Notes', '→', 'Follow-up/Referral'].map((step, i) => (
            <span key={i} className={step === '→' ? 'text-stone-500' : 'px-2 py-1 rounded-lg bg-orange-100/60 text-stone-700 font-medium'}>{step}</span>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Pending Review', count: pending, color: 'bg-amber-200/20 border-amber-200/40 text-amber-800' },
          { label: 'Urgent', count: urgent, color: 'bg-pink-200/20 border-pink-200/40 text-pink-700' },
          { label: 'In Progress', count: consultations.filter(c => c.status === 'in_progress').length, color: 'bg-purple-200/20 border-purple-200/40 text-purple-700' },
          { label: 'Completed', count: consultations.filter(c => c.status === 'completed').length, color: 'bg-emerald-200/20 border-emerald-200/40 text-emerald-700' },
        ].map(s => (
          <div key={s.label} className={`border rounded-xl p-3 ${s.color}`}>
            <div className="text-2xl font-bold">{s.count}</div>
            <div className="text-xs opacity-70">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-1 flex-wrap">
        {[{ val: '', label: 'All' }, { val: 'pending', label: 'Pending' }, { val: 'assigned', label: 'Assigned' }, { val: 'in_progress', label: 'In Progress' }, { val: 'completed', label: 'Completed' }, { val: 'referred', label: 'Referred' }].map(f => (
          <button key={f.val} onClick={() => setFilterStatus(f.val)} className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${filterStatus === f.val ? 'bg-sky-200/20 border-sky-200/40 text-sky-600' : 'border-orange-100 hover:bg-orange-100 text-stone-700'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Consultations */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-sky-200 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {consultations.map(c => <ConsultationCard key={c._id} consult={c} onUpdate={loadData} />)}
          {consultations.length === 0 && (
            <div className="text-center py-12 card">
              <Stethoscope className="w-10 h-10 text-stone-500 mx-auto mb-2" />
              <p className="text-stone-700">No consultations found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ConsultationsPage;
