import React from 'react';
import { RISK_COLORS, getRiskLevel } from '../utils';
import { AlertTriangle, MapPin, Clock, CheckCircle } from 'lucide-react';

interface AlertCardProps {
  alert: any;
  onAcknowledge?: (id: string) => void;
  onResolve?: (id: string) => void;
  compact?: boolean;
}

const SEVERITY_STYLES = {
  low: { bg: 'bg-emerald-200/20 border-emerald-200/40', icon: 'text-emerald-700', title: 'text-emerald-600' },
  moderate: { bg: 'bg-amber-200/20 border-amber-200/40', icon: 'text-amber-800', title: 'text-amber-700' },
  high: { bg: 'bg-orange-200/20 border-orange-200/40', icon: 'text-orange-800', title: 'text-orange-700' },
  critical: { bg: 'bg-pink-200/30 border-pink-200/50', icon: 'text-pink-700', title: 'text-pink-600' },
};

export function AlertCard({ alert, onAcknowledge, onResolve, compact = false }: AlertCardProps) {
  const severity = alert.severity as keyof typeof SEVERITY_STYLES;
  const style = SEVERITY_STYLES[severity] || SEVERITY_STYLES.moderate;
  const color = RISK_COLORS[getRiskLevel(alert.riskScore || 0)];

  return (
    <div className={`border rounded-xl p-4 ${style.bg} ${severity === 'critical' ? 'animate-pulse-slow' : ''} transition-all hover:scale-[1.01]`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${style.icon}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className={`font-semibold text-sm ${style.title} leading-snug`}>{alert.title}</h3>
            <span className="text-2xl font-black flex-shrink-0" style={{ color }}>{alert.riskScore}</span>
          </div>
          
          {alert.location && (
            <div className="flex items-center gap-1 text-stone-700 text-xs mb-2">
              <MapPin className="w-3 h-3" />
              <span>{alert.location.name}, {alert.location.state}</span>
            </div>
          )}
          
          <p className="text-stone-700 text-xs mb-3 leading-relaxed">{alert.message}</p>

          {!compact && alert.factors?.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-stone-700 mb-1.5">Contributing Factors:</p>
              <ul className="space-y-1">
                {alert.factors.slice(0, 4).map((f: string, i: number) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-stone-700">
                    <span className="text-orange-800 mt-0.5 flex-shrink-0">▸</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!compact && alert.recommendations?.length > 0 && (
            <div className="mb-3 bg-orange-100/50 rounded-lg p-2.5">
              <p className="text-xs font-medium text-stone-700 mb-1.5">Recommended Actions:</p>
              <ul className="space-y-1">
                {alert.recommendations.slice(0, 3).map((r: string, i: number) => (
                  <li key={i} className="text-xs text-stone-700 leading-relaxed">{r}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-stone-500 text-xs">
              <Clock className="w-3 h-3" />
              <span>{new Date(alert.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex gap-2">
              {alert.status === 'active' && onAcknowledge && (
                <button
                  onClick={() => onAcknowledge(alert._id)}
                  className="text-xs px-3 py-1 rounded-lg bg-orange-100 hover:bg-orange-50 text-stone-700 transition-colors"
                >
                  Acknowledge
                </button>
              )}
              {alert.status !== 'resolved' && onResolve && (
                <button
                  onClick={() => onResolve(alert._id)}
                  className="text-xs px-3 py-1 rounded-lg bg-emerald-200/40 hover:bg-emerald-200/60 text-emerald-600 transition-colors flex items-center gap-1"
                >
                  <CheckCircle className="w-3 h-3" />
                  Resolve
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlertCard;
