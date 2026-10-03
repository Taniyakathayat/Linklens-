import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  History, 
  Trash2, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  Calendar, 
  ExternalLink,
  RotateCcw,
  Lock,
  Filter
} from 'lucide-react';
import { api } from '../services/api';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL'); // 'ALL' | 'EXPOSED' | 'CLEAN'
  const [clearStatus, setClearStatus] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getHistory();
      setHistory(data);
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear your local scan history? This action cannot be undone.')) {
      return;
    }

    try {
      await api.clearHistory();
      setHistory([]);
      setClearStatus('History successfully cleared.');
      setTimeout(() => setClearStatus(''), 3000);
    } catch (err) {
      alert('Failed to clear history');
    }
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.masked_identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.risk_level.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'EXPOSED') {
      return matchesSearch && item.status === 'potential_exposure';
    }
    if (selectedFilter === 'CLEAN') {
      return matchesSearch && item.status !== 'potential_exposure';
    }
    return matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
              AUDIT LOGS
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">
            Privacy-Preserved Scan History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Raw email and username values are never stored. Only SHA-256 hashes and masked identifiers are retained.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-950/40 border border-red-800 text-red-300 hover:bg-red-900/60 hover:text-white text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear History
          </button>
        )}
      </div>

      {clearStatus && (
        <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs">
          {clearStatus}
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by masked identifier or risk level..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Filter:</span>
          {['ALL', 'EXPOSED', 'CLEAN'].map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedFilter === f
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="cyber-card border-slate-800 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs font-mono">
            Loading assessment logs...
          </div>
        ) : filteredHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">DATE</th>
                  <th className="py-3.5 px-4 font-semibold">MASKED IDENTIFIER</th>
                  <th className="py-3.5 px-4 font-semibold">TYPE</th>
                  <th className="py-3.5 px-4 font-semibold">STATUS</th>
                  <th className="py-3.5 px-4 font-semibold">RISK SCORE</th>
                  <th className="py-3.5 px-4 font-semibold">RISK LEVEL</th>
                  <th className="py-3.5 px-4 font-semibold text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredHistory.map((item) => {
                  const dateStr = new Date(item.created_at).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  });

                  return (
                    <tr key={item.scan_id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 text-slate-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {dateStr}
                      </td>
                      <td className="py-3.5 px-4 text-white font-semibold">
                        {item.masked_identifier}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 uppercase">
                        {item.identifier_type}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === 'potential_exposure'
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}>
                          {item.status === 'potential_exposure' ? 'EXPOSED' : 'CLEAN'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {item.risk_score} / 100
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.risk_level === 'CRITICAL' ? 'text-red-400 bg-red-950/60' :
                          item.risk_level === 'HIGH' ? 'text-orange-400 bg-orange-950/60' :
                          item.risk_level === 'MEDIUM' ? 'text-amber-400 bg-amber-950/60' :
                          'text-emerald-400 bg-emerald-950/60'
                        }`}>
                          {item.risk_level}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/results/${item.scan_id}`}
                          className="text-cyan-400 hover:text-cyan-300 font-sans font-semibold underline inline-flex items-center gap-1"
                        >
                          Report <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center space-y-4">
            <History className="w-12 h-12 text-slate-600 mx-auto" />
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">No Scan Records Located</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No past scans match your current filter criteria. Run an exposure assessment to generate logs.
              </p>
            </div>
            <Link
              to="/scan"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
            >
              Start First Scan
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
