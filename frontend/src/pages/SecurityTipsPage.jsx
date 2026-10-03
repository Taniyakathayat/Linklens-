import React, { useEffect, useState } from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  AlertTriangle, 
  Wifi, 
  RefreshCw, 
  EyeOff, 
  Users, 
  LifeBuoy, 
  Search,
  BookOpen,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { api } from '../services/api';

const ICON_MAP = {
  KeyRound: <KeyRound className="w-5 h-5" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
  AlertTriangle: <AlertTriangle className="w-5 h-5" />,
  Wifi: <Wifi className="w-5 h-5" />,
  RefreshCw: <RefreshCw className="w-5 h-5" />,
  EyeOff: <EyeOff className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  LifeBuoy: <LifeBuoy className="w-5 h-5" />
};

export default function SecurityTipsPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    setLoading(true);
    try {
      const data = await api.getSecurityTips();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load security tips', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((cat) => {
    if (activeCategory !== 'all' && cat.id !== activeCategory) return false;
    
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    const matchesTitle = cat.title.toLowerCase().includes(term);
    const matchesTips = cat.tips.some(t => 
      t.title.toLowerCase().includes(term) || t.content.toLowerCase().includes(term)
    );

    return matchesTitle || matchesTips;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-cyan-950/70 border border-cyan-800/60 text-cyan-300">
          <BookOpen className="w-3.5 h-3.5" />
          CYBERSECURITY KNOWLEDGE BASE
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Defensive Security Best Practices
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Actionable blueprints and counter-measures to minimize personal data exposure and harden digital identities.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search security guidelines, MFA, phishing..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Quick Category Chips */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeCategory === 'all'
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Domains
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeCategory === c.id
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800/80'
              }`}
            >
              {c.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Tip Cards */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs font-mono">
          Loading cybersecurity knowledge base...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="cyber-card p-6 border-slate-800 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
                    {ICON_MAP[cat.icon] || <ShieldCheck className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{cat.title}</h3>
                    <p className="text-xs text-slate-400">{cat.summary}</p>
                  </div>
                </div>

                {/* Sub-tips */}
                <div className="space-y-3 pt-2">
                  {cat.tips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-200">{tip.title}</h4>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                          tip.importance === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-800' :
                          tip.importance === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {tip.importance}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{tip.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/60 text-[11px] text-cyan-400 font-mono flex items-center gap-1">
                <span>Domain: {cat.title}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
