import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Flame } from 'lucide-react';

export default function RiskGauge({ score = 0, level = 'LOW', size = 180 }) {
  // SVG circular properties
  const radius = 70;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getTheme = () => {
    switch (level?.toUpperCase()) {
      case 'CRITICAL':
        return {
          stroke: '#EF4444',
          bgGlow: 'from-red-500/20 to-red-950/40',
          border: 'border-red-500/40',
          text: 'text-red-400',
          badgeBg: 'bg-red-950/80 text-red-300 border-red-700/60',
          icon: <Flame className="w-5 h-5 text-red-400" />
        };
      case 'HIGH':
        return {
          stroke: '#F97316',
          bgGlow: 'from-orange-500/20 to-orange-950/40',
          border: 'border-orange-500/40',
          text: 'text-orange-400',
          badgeBg: 'bg-orange-950/80 text-orange-300 border-orange-700/60',
          icon: <ShieldAlert className="w-5 h-5 text-orange-400" />
        };
      case 'MEDIUM':
        return {
          stroke: '#F59E0B',
          bgGlow: 'from-amber-500/20 to-amber-950/40',
          border: 'border-amber-500/40',
          text: 'text-amber-400',
          badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-700/60',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />
        };
      default:
        return {
          stroke: '#10B981',
          bgGlow: 'from-emerald-500/20 to-emerald-950/40',
          border: 'border-emerald-500/40',
          text: 'text-emerald-400',
          badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
          icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />
        };
    }
  };

  const theme = getTheme();

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Ambient background glow */}
        <div className={`absolute inset-4 rounded-full bg-gradient-to-b ${theme.bgGlow} filter blur-xl opacity-70`}></div>

        <svg height={size} width={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            stroke="#1E293B"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Active progress stroke */}
          <circle
            stroke={theme.stroke}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
            {score}
          </span>
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">
            / 100 Risk
          </span>
        </div>
      </div>

      {/* Risk Level Badge */}
      <div className={`mt-3 inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-md ${theme.badgeBg}`}>
        {theme.icon}
        <span>{level} RISK</span>
      </div>
    </div>
  );
}
