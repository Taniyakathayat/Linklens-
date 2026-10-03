import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  Flame, 
  Layers, 
  RotateCcw, 
  ArrowRight,
  TrendingUp,
  PieChart as PieIcon,
  Search
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import Checklist from '../components/Checklist';
import { api } from '../services/api';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const data = await api.getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    } finally {
      setLoading(false);
    }
  };

  const RISK_COLORS = {
    LOW: '#10B981',
    MEDIUM: '#F59E0B',
    HIGH: '#F97316',
    CRITICAL: '#EF4444'
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-400 font-mono text-sm">Aggregating cybersecurity telemetry data...</p>
      </div>
    );
  }

  const pieData = metrics ? [
    { name: 'Low Risk', value: metrics.risk_level_distribution?.LOW || 0, color: RISK_COLORS.LOW },
    { name: 'Medium Risk', value: metrics.risk_level_distribution?.MEDIUM || 0, color: RISK_COLORS.MEDIUM },
    { name: 'High Risk', value: metrics.risk_level_distribution?.HIGH || 0, color: RISK_COLORS.HIGH },
    { name: 'Critical Risk', value: metrics.risk_level_distribution?.CRITICAL || 0, color: RISK_COLORS.CRITICAL },
  ].filter(d => d.value > 0) : [];

  const barData = metrics?.top_exposed_categories?.map(c => ({
    category: c.category,
    count: c.count
  })) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
              CYBER RISK INTELLIGENCE
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">
            Security Telemetry Dashboard
          </h1>
        </div>

        <Link
          to="/scan"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 hover:scale-105 transition-all"
        >
          <Search className="w-4 h-4" />
          Perform New Scan
        </Link>
      </div>

      {/* 4 KPI Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="cyber-card p-5 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">TOTAL SCANS</span>
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black font-mono text-white">
              {metrics?.total_scans || 0}
            </span>
            <span className="text-xs text-slate-400 block mt-1">Evaluated accounts</span>
          </div>
        </div>

        <div className="cyber-card p-5 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">AVERAGE RISK SCORE</span>
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black font-mono text-amber-400">
              {metrics?.average_risk_score || 0}
            </span>
            <span className="text-xs text-slate-400 block mt-1">Out of 100 max index</span>
          </div>
        </div>

        <div className="cyber-card p-5 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">EXPOSURES DETECTED</span>
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black font-mono text-red-400">
              {metrics?.scans_with_exposure || 0}
            </span>
            <span className="text-xs text-slate-400 block mt-1">Breach correlations</span>
          </div>
        </div>

        <div className="cyber-card p-5 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">CLEAN RECORDS</span>
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black font-mono text-emerald-400">
              {metrics?.clean_scans || 0}
            </span>
            <span className="text-xs text-slate-400 block mt-1">Zero recorded breaches</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Top Exposed Categories Bar Chart */}
        <div className="lg:col-span-7 cyber-card p-6 border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Top Compromised Data Categories</h3>
              <p className="text-xs text-slate-400">Frequency of leaked attributes across scans</p>
            </div>
            <BarChart3 className="w-5 h-5 text-cyan-400" />
          </div>

          <div className="h-64 w-full pt-4">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis 
                    dataKey="category" 
                    stroke="#64748B" 
                    fontSize={11} 
                    tickLine={false} 
                    angle={-20} 
                    textAnchor="end" 
                  />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#38BDF8' }}
                  />
                  <Bar dataKey="count" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500 italic">
                No category data available yet. Run scans to populate analytics.
              </div>
            )}
          </div>
        </div>

        {/* Risk Distribution Pie Chart */}
        <div className="lg:col-span-5 cyber-card p-6 border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Risk Tier Breakdown</h3>
              <p className="text-xs text-slate-400">Distribution across severity levels</p>
            </div>
            <PieIcon className="w-5 h-5 text-cyan-400" />
          </div>

          <div className="h-64 w-full pt-2 flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500 italic">
                No risk distribution records available yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="cyber-card p-6 border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recent Evaluated Activity</h3>
            <p className="text-xs text-slate-400">Privacy-preserved recent assessment logs</p>
          </div>
          <Link to="/history" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
            View All History <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {metrics?.recent_activity && metrics.recent_activity.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold">IDENTIFIER</th>
                  <th className="pb-3 font-semibold">STATUS</th>
                  <th className="pb-3 font-semibold">RISK SCORE</th>
                  <th className="pb-3 font-semibold">INCIDENTS</th>
                  <th className="pb-3 font-semibold text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {metrics.recent_activity.map((item) => (
                  <tr key={item.scan_id} className="hover:bg-slate-800/30">
                    <td className="py-3 text-slate-200">{item.masked_identifier}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'potential_exposure'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {item.status === 'potential_exposure' ? 'EXPOSED' : 'CLEAN'}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-white">
                      {item.risk_score} / 100 ({item.risk_level})
                    </td>
                    <td className="py-3 text-slate-300">{item.incident_count} events</td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/results/${item.scan_id}`}
                        className="text-cyan-400 hover:text-cyan-300 font-sans font-semibold underline"
                      >
                        View Report
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic py-4">No recent scans recorded.</p>
        )}
      </div>

      {/* Security Checklist Integration */}
      <Checklist />
    </div>
  );
}
