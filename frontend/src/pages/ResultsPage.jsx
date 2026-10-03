import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Calendar, 
  Database, 
  CheckCircle2, 
  Download, 
  Printer, 
  RotateCcw, 
  Layers, 
  Info,
  KeyRound,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import RiskGauge from '../components/RiskGauge';
import Checklist from '../components/Checklist';
import { api } from '../services/api';

export default function ResultsPage() {
  const { scanId } = useParams();
  const location = useLocation();
  const [report, setReport] = useState(location.state?.scanData || null);
  const [loading, setLoading] = useState(!location.state?.scanData);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!report && scanId) {
      fetchReport(scanId);
    }
  }, [scanId]);

  const fetchReport = async (id) => {
    setLoading(true);
    try {
      const data = await api.getScanById(id);
      setReport(data);
    } catch (err) {
      setError('Unable to load scan report. The record may have expired or been cleared.');
    } finally {
      setLoading(false);
    }
  };

  const exportJSON = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LeakLens_Exposure_Report_${report.scan_id.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-400 font-mono text-sm">Retrieving exposure report from database...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-sm">
          {error || 'Scan report not found.'}
        </div>
        <Link
          to="/scan"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm hover:bg-cyan-400 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Perform New Scan
        </Link>
      </div>
    );
  }

  const isExposed = report.status === 'potential_exposure' && report.incidents.length > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
              EXPOSURE REPORT
            </span>
            {report.mode === 'demo' && (
              <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800/40 px-2 py-0.5 rounded font-mono">
                DEMO DATA
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Exposure & Cyber Risk Analysis
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={exportJSON}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
          <Link
            to="/scan"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/10"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New Scan
          </Link>
        </div>
      </div>

      {/* Demo Notice Banner */}
      {report.mode === 'demo' && (
        <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/50 flex items-center justify-between gap-3 text-xs text-cyan-300 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span><strong>DEMO DATA:</strong> Evaluated using synthetic demonstration records. No actual private credentials or real user feeds are queried.</span>
          </div>
          <span className="text-[10px] bg-cyan-900/60 px-2 py-0.5 rounded text-cyan-200 uppercase tracking-wider">
            Academic Simulation
          </span>
        </div>
      )}

      {/* Target Identifier & Primary Status Banner */}
      <div className={`p-6 rounded-2xl border ${
        isExposed 
          ? 'bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border-red-500/40' 
          : 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/40'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-slate-400">Assessed Identifier:</span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white flex items-center gap-3">
              <span>{report.masked_identifier}</span>
              <span className="text-xs font-mono font-normal bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
                {report.identifier_type.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              HMAC-SHA256 Digest: <span className="text-slate-500">{report.identifier_hash.slice(0, 16)}...</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isExposed ? (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-700 text-red-300 flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-red-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-red-200">Potential Exposure Detected</h4>
                  <p className="text-xs text-red-300/80">{report.incidents.length} recorded incident(s) correlated</p>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-200">No Exposure Records Found</h4>
                  <p className="text-xs text-emerald-300/80">No known incidents in configured sources</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2-Column Risk & Factor Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Risk Score Gauge & Summary */}
        <div className="lg:col-span-5 cyber-card p-6 border-slate-800 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Calculated Cyber Risk</h3>
            <p className="text-xs text-slate-400">Rule-based scoring based on threat severity, frequency & recency</p>
          </div>

          <RiskGauge score={report.risk_score} level={report.risk_level} size={200} />

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
            <span className="font-semibold text-slate-200 font-mono">ASSESSMENT SUMMARY:</span>
            <p className="text-slate-400 leading-relaxed">{report.risk_summary}</p>
          </div>
        </div>

        {/* Right: Why this score? (Scoring Factors Breakdown) */}
        <div className="lg:col-span-7 cyber-card p-6 border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Why This Score?</h3>
              <p className="text-xs text-slate-400">Transparent factor breakdown computed by Risk Engine</p>
            </div>
            <span className="text-xs font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800 px-2.5 py-1 rounded">
              {report.is_capped ? `Total: ${report.risk_score} / 100 (Raw: ${report.raw_score} capped)` : `Total: ${report.risk_score} / 100`}
            </span>
          </div>

          <div className="space-y-2.5">
            {report.risk_factors && report.risk_factors.length > 0 ? (
              report.risk_factors.map((factor, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-4"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-200">{factor.factor}</span>
                    <p className="text-[11px] text-slate-400">{factor.description}</p>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded shrink-0 ${
                    factor.points > 0 
                      ? 'bg-red-950/80 text-red-300 border border-red-800/40' 
                      : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
                  }`}>
                    {factor.points > 0 ? `+${factor.points}` : '0'} pts
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No adverse risk factors detected.</p>
            )}
          </div>

          {/* Exposed Categories Badges */}
          {report.categories_summary && report.categories_summary.length > 0 && (
            <div className="pt-3 border-t border-slate-800/80">
              <span className="text-xs font-mono text-slate-400 block mb-2">
                AFFECTED DATA CATEGORIES ({report.categories_summary.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {report.categories_summary.map((cat, idx) => {
                  const isCritical = cat.toLowerCase().includes('password');
                  return (
                    <span
                      key={idx}
                      className={`text-xs font-medium px-2.5 py-1 rounded-md border ${
                        isCritical
                          ? 'bg-red-950/80 text-red-300 border-red-800/60 font-semibold'
                          : 'bg-slate-800 text-slate-200 border-slate-700'
                      }`}
                    >
                      {isCritical ? '⚠ ' : '✓ '} {cat}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Exposure Incidents Timeline / List */}
      <div className="cyber-card p-6 sm:p-8 border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Correlated Exposure Incidents</h3>
            <p className="text-xs text-slate-400">Recorded breaches associated with this digital identifier</p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-md border border-cyan-800/40">
            {report.incidents.length} Incident(s)
          </span>
        </div>

        {report.incidents.length > 0 ? (
          <div className="space-y-4">
            {report.incidents.map((inc, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <Database className="w-5 h-5 text-cyan-400 shrink-0" />
                    <h4 className="text-base font-bold text-white">{inc.incident_name}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs text-slate-400 font-mono bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {inc.incident_year || inc.incident_date || 'Date N/A'}
                    </span>
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      inc.severity === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-800' :
                      inc.severity === 'HIGH' ? 'bg-orange-950 text-orange-300 border border-orange-800' :
                      'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {inc.severity} Severity
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{inc.description}</p>

                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-mono">Exposed:</span>
                  {inc.categories.map((c, i) => (
                    <span key={i} className="text-[11px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">No Public Breach Events Located</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              This identifier did not match recorded breach records in configured data sources.
            </p>
          </div>
        )}
      </div>

      {/* Security Recommendations (Priority Order) */}
      <div className="cyber-card p-6 sm:p-8 border-slate-800 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white">Actionable Security Recommendations</h3>
          <p className="text-xs text-slate-400">Contextual defensive guidelines ranked by priority</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.recommendations.map((rec, idx) => {
            const isCrit = rec.priority === 'CRITICAL';
            const isHigh = rec.priority === 'HIGH';
            return (
              <div
                key={idx}
                className={`p-5 rounded-xl border flex flex-col justify-between space-y-3 ${
                  isCrit
                    ? 'bg-red-950/20 border-red-800/40 hover:border-red-600/50'
                    : isHigh
                    ? 'bg-amber-950/20 border-amber-800/40 hover:border-amber-600/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                } transition-all`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                      isCrit ? 'bg-red-950 text-red-300 border border-red-800' :
                      isHigh ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {rec.priority} Priority
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">{rec.action_category}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{rec.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{rec.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Hardening Checklist */}
      <Checklist />
    </div>
  );
}
