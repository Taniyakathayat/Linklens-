import React from 'react';
import { Sparkles, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function DemoBanner({ onSelectScenario }) {
  const scenarios = [
    {
      label: 'Safe Demo',
      email: 'safe.demo@example.com',
      badge: '0 Incidents · Low Risk',
      color: 'hover:border-emerald-500/50 hover:bg-emerald-950/30 text-emerald-400',
      icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
    },
    {
      label: 'Exposed Demo',
      email: 'exposed.demo@example.com',
      badge: '2 Incidents · Med/High Risk',
      color: 'hover:border-amber-500/50 hover:bg-amber-950/30 text-amber-400',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
    },
    {
      label: 'High Risk Demo',
      email: 'highrisk.demo@example.com',
      badge: '3 Incidents · Critical Risk',
      color: 'hover:border-red-500/50 hover:bg-red-950/30 text-red-400',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
    }
  ];

  return (
    <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-4 shadow-lg backdrop-blur-md">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                Interactive Demo Scenarios
              </h4>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800/40">
                Safe for Presentation
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">
              Click any scenario below to automatically load synthetic evaluation data:
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {scenarios.map((sc) => (
            <button
              key={sc.label}
              type="button"
              onClick={() => onSelectScenario && onSelectScenario(sc.email, 'email')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 border border-slate-700/80 transition-all ${sc.color} active:scale-95`}
            >
              {sc.icon}
              <span className="font-semibold text-slate-200">{sc.label}</span>
              <span className="hidden sm:inline text-[10px] opacity-75 font-mono">({sc.badge})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
