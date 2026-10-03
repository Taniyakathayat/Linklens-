import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ShieldCheck, ListChecks, RotateCcw } from 'lucide-react';

const DEFAULT_CHECKLIST_ITEMS = [
  { id: 'mfa', text: 'Enable Multi-Factor Authentication (MFA/2FA) on email & bank accounts', priority: 'CRITICAL' },
  { id: 'passwords', text: 'Generate unique 16+ character passphrases via a Password Manager', priority: 'CRITICAL' },
  { id: 'audit_sessions', text: 'Review active login sessions and terminate unauthorized devices', priority: 'HIGH' },
  { id: 'rotate_exposed', text: 'Update passwords for services identified in data breaches', priority: 'HIGH' },
  { id: 'delete_dormant', text: 'Request deletion of old, unused web accounts (data footprint reduction)', priority: 'MEDIUM' },
  { id: 'phishing_alert', text: 'Stay alert for targeted phishing emails, fake OTP requests & SMS scams', priority: 'MEDIUM' },
];

export default function Checklist() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('leaklens_security_checklist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_CHECKLIST_ITEMS.map(i => ({ ...i, completed: false }));
      }
    }
    return DEFAULT_CHECKLIST_ITEMS.map(i => ({ ...i, completed: false }));
  });

  useEffect(() => {
    localStorage.setItem('leaklens_security_checklist', JSON.stringify(items));
  }, [items]);

  const toggleItem = (id) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const resetChecklist = () => {
    setItems(DEFAULT_CHECKLIST_ITEMS.map(i => ({ ...i, completed: false })));
  };

  const completedCount = items.filter(i => i.completed).length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  return (
    <div className="cyber-card p-6 border-slate-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
            <ListChecks className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Security Improvement Checklist</h3>
            <p className="text-xs text-slate-400">Track your cyber hardening progress locally</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-800/40">
            {completedCount} / {items.length} Completed ({progressPercent}%)
          </span>
          <button
            onClick={resetChecklist}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 p-1 hover:bg-slate-800 rounded transition-colors"
            title="Reset Checklist"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-5">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500 rounded-full"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Checklist items */}
      <div className="space-y-2.5">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all select-none ${
              item.completed
                ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-300'
                : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600 hover:bg-slate-800/70 text-slate-200'
            }`}
          >
            <button className="mt-0.5 text-cyan-400 shrink-0">
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <Circle className="w-5 h-5 text-slate-500" />
              )}
            </button>
            <div className="flex-1">
              <span className={`text-sm leading-snug ${item.completed ? 'line-through text-slate-400' : ''}`}>
                {item.text}
              </span>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold shrink-0 ${
                item.priority === 'CRITICAL'
                  ? 'bg-red-950/80 text-red-400 border border-red-800/40'
                  : item.priority === 'HIGH'
                  ? 'bg-amber-950/80 text-amber-400 border border-amber-800/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {item.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
