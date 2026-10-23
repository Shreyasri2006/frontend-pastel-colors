export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export const RISK_COLORS: Record<RiskLevel, string> = {
  low: '#a7d7b5',
  moderate: '#f6d9a8',
  high: '#f6c28b',
  critical: '#f3b7c5',
};

export const RISK_BG: Record<RiskLevel, string> = {
  low: 'bg-emerald-200/20 text-emerald-700 border-emerald-200/30',
  moderate: 'bg-amber-200/20 text-amber-800 border-amber-200/30',
  high: 'bg-orange-200/20 text-orange-800 border-orange-200/30',
  critical: 'bg-pink-200/20 text-pink-700 border-pink-200/30',
};

export const RISK_ICONS: Record<RiskLevel, string> = {
  low: '🟢',
  moderate: '🟡',
  high: '🟠',
  critical: '🔴',
};

export const RISK_LABELS: Record<RiskLevel, string> = {
  low: 'LOW',
  moderate: 'MODERATE',
  high: 'HIGH',
  critical: 'CRITICAL',
};

export function getRiskLevel(score: number): RiskLevel {
  if (score < 25) return 'low';
  if (score < 50) return 'moderate';
  if (score < 75) return 'high';
  return 'critical';
}

export function getRiskColor(score: number): string {
  return RISK_COLORS[getRiskLevel(score)];
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    admin: 'Administrator',
    health_worker: 'Health Worker',
    doctor: 'Doctor',
    village_authority: 'Village Authority',
    community_user: 'Community User',
  };
  return labels[role] || role;
}
