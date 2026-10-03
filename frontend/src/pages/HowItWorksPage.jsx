import React from 'react';
import { 
  Terminal, 
  Layers, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Lock, 
  ArrowDown, 
  CheckCircle2, 
  BarChart3,
  Server
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      title: '1. User Input & Client Interface',
      desc: 'The user enters an email address or username in the React single-page frontend. Client-side input validation rejects invalid formats, empty queries, and any credential strings immediately.',
      icon: <Terminal className="w-5 h-5 text-cyan-400" />,
      component: 'React + Vite UI'
    },
    {
      title: '2. FastAPI Gateway & Input Validation',
      desc: 'The payload is transmitted via HTTP POST to the backend. Pydantic models sanitize input, verify length restrictions (<= 255 chars), and confirm that no password patterns exist in the stream.',
      icon: <Server className="w-5 h-5 text-cyan-400" />,
      component: 'FastAPI Router & Pydantic Validation'
    },
    {
      title: '3. Privacy Masking & SHA-256 Hashing',
      desc: 'Identifiers are immediately hashed with SHA-256 for persistent database storage and masked (e.g., ta***@example.com) for on-screen report rendering. Raw credentials are never logged.',
      icon: <Lock className="w-5 h-5 text-cyan-400" />,
      component: 'Masking Service'
    },
    {
      title: '4. Exposure Provider Abstraction Layer',
      desc: 'The ExposureProvider interface queries threat records. In Demo Mode, it matches synthetic educational breach scenarios safely without external API dependencies. In External Mode, it connects to CTI breach feeds.',
      icon: <Database className="w-5 h-5 text-cyan-400" />,
      component: 'Demo & External Exposure Providers'
    },
    {
      title: '5. Rule-Based Cyber Risk Engine',
      desc: 'The risk engine computes an educational risk index (0 to 100) based on incident count, exposed category sensitivity (passwords, PII, IPs), and recency (<2 years old), mapping to LOW, MEDIUM, HIGH, or CRITICAL tiers.',
      icon: <Cpu className="w-5 h-5 text-cyan-400" />,
      component: 'risk_engine.py'
    },
    {
      title: '6. Contextual Recommendation Engine',
      desc: 'Generates prioritized counter-measures (CRITICAL to GENERAL) addressing the exact vectors exposed (e.g. credential stuffing defense, password rotations, MFA enforcement).',
      icon: <ShieldCheck className="w-5 h-5 text-cyan-400" />,
      component: 'recommendation_engine.py'
    },
    {
      title: '7. PostgreSQL / SQLite Persistence & Dashboard Analytics',
      desc: 'Telemetry and assessments are stored in the database. The frontend renders dynamic SVG gauges, Recharts visual analytics, and an interactive security improvement checklist.',
      icon: <BarChart3 className="w-5 h-5 text-cyan-400" />,
      component: 'SQLAlchemy ORM + Recharts Dashboard'
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-cyan-950/70 border border-cyan-800/60 text-cyan-300">
          <Layers className="w-3.5 h-3.5" />
          SYSTEM ARCHITECTURE & PIPELINE
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          How LeakLens Works
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          An in-depth look at our 7-stage defensive cybersecurity processing pipeline.
        </p>
      </div>

      {/* Architecture Flow Diagram */}
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className="cyber-card p-6 border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative group cyber-card-hover">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 shrink-0 mt-1">
                  {step.icon}
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-white">{step.title}</h3>
                    <span className="text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/50 px-2 py-0.5 rounded">
                      {step.component}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">{step.desc}</p>
                </div>
              </div>
            </div>

            {idx < steps.length - 1 && (
              <div className="flex justify-center py-1">
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
                  <ArrowDown className="w-4 h-4" />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Defensive Core Principles */}
      <div className="cyber-card p-8 border-slate-800 space-y-6">
        <h3 className="text-lg font-bold text-white">Core Defensive Principles</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <h4 className="font-bold text-cyan-400">1. Zero Leaked Credential Exposure</h4>
            <p className="text-slate-400">We never display passwords, plaintext secrets, or active session keys, even in mock reports.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <h4 className="font-bold text-cyan-400">2. Deterministic & Isolated Testing</h4>
            <p className="text-slate-400">College presentations can execute entirely offline without dependency on external third-party rate limits.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <h4 className="font-bold text-cyan-400">3. Non-Invasive Threat Analysis</h4>
            <p className="text-slate-400">LeakLens performs passive correlation only; it never attacks, exploits, or brute-forces target systems.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <h4 className="font-bold text-cyan-400">4. Transparent Risk Methodology</h4>
            <p className="text-slate-400">Every risk point (+10, +15, +30) is explicitly disclosed and justified to the end user.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
