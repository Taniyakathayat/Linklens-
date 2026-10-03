import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Search, 
  Activity, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck, 
  Flame, 
  Layers, 
  Terminal, 
  Cpu, 
  KeyRound, 
  Database,
  BarChart3
} from 'lucide-react';

export default function HomePage() {
  const pipelineSteps = [
    { num: '01', title: 'INPUT', desc: 'Email or username submission', icon: <Terminal className="w-4 h-4 text-cyan-400" /> },
    { num: '02', title: 'VALIDATION', desc: 'Format check & password rejection', icon: <Lock className="w-4 h-4 text-cyan-400" /> },
    { num: '03', title: 'EXPOSURE CHECK', desc: 'Breach records query layer', icon: <Database className="w-4 h-4 text-cyan-400" /> },
    { num: '04', title: 'RISK ANALYSIS', desc: 'Algorithmic 0-100 scoring', icon: <Cpu className="w-4 h-4 text-cyan-400" /> },
    { num: '05', title: 'RECOMMENDATIONS', desc: 'Prioritized cyber hardening', icon: <Shield className="w-4 h-4 text-cyan-400" /> },
  ];

  return (
    <div className="space-y-24 py-6">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-cyan-950/70 border border-cyan-800/60 text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                DEFENSIVE CYBERSECURITY PLATFORM
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                Is Your Digital Identity <span className="cyber-gradient-text">Exposed?</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Check your digital exposure, understand your cyber risk, and get actionable security recommendations. 
                LeakLens transforms scattered breach records into a transparent cyber posture assessment.
              </p>

              {/* Privacy Banner */}
              <div className="flex items-center gap-2.5 text-xs text-cyan-300 bg-cyan-950/40 border border-cyan-800/50 px-4 py-2.5 rounded-xl w-fit">
                <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span><strong>Privacy-First Design:</strong> LeakLens never asks for or stores passwords or credentials.</span>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/scan"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 transition-all hover:scale-105 active:scale-95"
                >
                  <Search className="w-5 h-5" />
                  Check My Exposure
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to="/how-it-works"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 font-semibold hover:bg-slate-800 hover:text-white transition-all"
                >
                  How It Works
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Privacy-Preserving Hashing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Rule-Based Risk Engine</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>BCA College Minor Project</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative">
                {/* Decorative glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-blue-600/30 rounded-2xl filter blur-xl opacity-75"></div>

                <div className="relative cyber-card p-6 border-slate-700/80 bg-slate-900/90 shadow-2xl">
                  {/* Mock Exposure Analysis Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs font-mono">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <Activity className="w-4 h-4 animate-pulse" />
                      <span>EXPOSURE ANALYSIS</span>
                    </div>
                    <span className="text-slate-400">ENGINE v1.0</span>
                  </div>

                  {/* Mock Scanner Visualization */}
                  <div className="py-6 space-y-4">
                    <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 flex items-center justify-between">
                      <span className="text-slate-400">Target Identifier:</span>
                      <span className="text-cyan-400 font-semibold">ta***@example.com</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-mono">RISK SCORE</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-2xl font-bold font-mono text-amber-400">78</span>
                          <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800">HIGH</span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-mono">EXPOSURES</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-2xl font-bold font-mono text-white">3</span>
                          <span className="text-[10px] text-slate-400">Recorded</span>
                        </div>
                      </div>
                    </div>

                    {/* Exposed Categories Badges */}
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-2 font-mono">AFFECTED DATA CATEGORIES</span>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">✓ Email</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">✓ Username</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">✓ IP Address</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-800/40">⚠ Password Indicator</span>
                      </div>
                    </div>

                    {/* Mock Advice */}
                    <div className="p-3 rounded-lg bg-red-950/30 border border-red-800/40 flex items-start gap-2 text-xs text-red-200">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>Critical Recommendation: Rotate passwords on associated platforms immediately.</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Status: Potential Exposure Detected</span>
                    <span className="text-emerald-400 font-mono">Protected by LeakLens</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PIPELINE / WORKFLOW SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
            End-to-End Processing Flow
          </h2>
          <h3 className="text-3xl font-extrabold text-white">
            How LeakLens Analyzes Exposure Risk
          </h3>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            A 5-stage defensive cybersecurity pipeline designed for privacy, accuracy, and clear actionability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {pipelineSteps.map((step, idx) => (
            <div
              key={step.num}
              className="cyber-card p-5 border-slate-800 cyber-card-hover flex flex-col justify-between relative group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-500 group-hover:text-cyan-400 transition-colors">
                    STAGE {step.num}
                  </span>
                  <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
                    {step.icon}
                  </div>
                </div>
                <h4 className="text-base font-bold text-white tracking-wide">{step.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>

              {idx < pipelineSteps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-700">
                  <ArrowRight className="w-5 h-5 text-slate-700 group-hover:text-cyan-500 transition-colors" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 3. WHY EXPOSURE MATTERS / WHAT WE CHECK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="cyber-card p-6 border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white">Why Data Exposure Matters</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              When online databases leak, threat actors aggregate credentials for credential stuffing, spear-phishing, 
              identity fraud, and account takeovers. Knowing what was leaked is the first step in digital self-defense.
            </p>
          </div>

          <div className="cyber-card p-6 border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white">What LeakLens Checks</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              We cross-examine configured threat records for email addresses and usernames, correlating incident frequency, 
              leaked data categories (IPs, metadata, password indicators), and recency.
            </p>
          </div>

          <div className="cyber-card p-6 border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white">Privacy-First Architecture</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              We never collect passwords. Identifiers are masked in reports and hashed with SHA-256 for local audit logs. 
              The application is entirely defensive and safe for academic demonstration.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <h3 className="text-2xl sm:text-3xl font-bold text-white">
            Ready to Evaluate Your Digital Footprint?
          </h3>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Test our synthetic demonstration records or analyze your identifier right now.
          </p>
          <div className="flex justify-center">
            <Link
              to="/scan"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
            >
              <Terminal className="w-5 h-5" />
              Launch Scanner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
