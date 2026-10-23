import React from 'react';
import { RISK_BG, RISK_ICONS, RISK_LABELS, RISK_COLORS, getRiskLevel } from '../utils';

interface Props {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

export function RiskScoreBadge({ score, showLabel = true, size = 'md', animate = false }: Props) {
  const level = getRiskLevel(score);
  const colorClass = RISK_BG[level];
  const icon = RISK_ICONS[level];
  const label = RISK_LABELS[level];
  const color = RISK_COLORS[level];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-bold border ${colorClass} ${sizeClasses[size]} ${animate && level === 'critical' ? 'animate-pulse' : ''}`}>
      <span>{icon}</span>
      <span>{score}/100</span>
      {showLabel && <span className="opacity-80">{label}</span>}
    </span>
  );
}

interface RiskGaugeProps {
  score: number;
  size?: number;
}

export function RiskGauge({ score, size = 80 }: RiskGaugeProps) {
  const level = getRiskLevel(score);
  const color = RISK_COLORS[level];
  const circumference = 2 * Math.PI * 30;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 80 80" className="-rotate-90">
        <circle cx="40" cy="40" r="30" fill="none" stroke="#fff7ed" strokeWidth="8" />
        <circle
          cx="40" cy="40" r="30" fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-bold text-lg leading-none" style={{ color }}>{score}</span>
        <span className="text-stone-500 text-xs">/100</span>
      </div>
    </div>
  );
}

export default RiskScoreBadge;
