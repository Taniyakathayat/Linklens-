import React from 'react';
import { 
  Shield, 
  GraduationCap, 
  Code2, 
  Cpu, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  Lightbulb,
  Compass
} from 'lucide-react';

export default function AboutPage() {
  const techStack = [
    { category: 'Frontend Architecture', tech: 'React.js 18, Vite, Tailwind CSS, Lucide React, Recharts' },
    { category: 'Backend Engine', tech: 'Python 3.12, FastAPI, Pydantic v2, Uvicorn' },
    { category: 'Database & ORM', tech: 'SQLAlchemy 2.0 ORM, SQLite / PostgreSQL, Alembic migrations' },
    { category: 'Privacy & Security', tech: 'SHA-256 Hashing, Input Sanitization, Regex Validators, Rate Limiting' },
    { category: 'Testing & DevOps', tech: 'Pytest, Pytest-Asyncio, Docker, Docker-Compose' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-cyan-950/70 border border-cyan-800/60 text-cyan-300">
          <GraduationCap className="w-3.5 h-3.5" />
          ACADEMIC MINOR PROJECT
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          About LeakLens
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Personal Data Exposure & Cyber Risk Assessment Tool created for Bachelor of Computer Applications (BCA) 5th Semester.
        </p>
      </div>

      {/* Problem vs Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="cyber-card p-6 border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">The Problem</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Billions of personal records are compromised annually in data breaches. However, raw breach notices 
            are cryptic, stressful, and fail to explain what actions users should take. Users often panic or ignore 
            risks due to lack of transparent, prioritized guidance.
          </p>
        </div>

        <div className="cyber-card p-6 border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">The LeakLens Solution</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            LeakLens translates breach data into an understandable 0–100 cyber risk score with clear factor breakdowns. 
            It identifies which data categories were exposed and delivers prioritized, actionable recommendations without 
            ever collecting or handling user passwords.
          </p>
        </div>
      </div>

      {/* Technology Stack Breakdown */}
      <div className="cyber-card p-6 sm:p-8 border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Technology Stack</h3>
            <p className="text-xs text-slate-400">Modern full-stack cybersecurity architecture</p>
          </div>
        </div>

        <div className="space-y-3">
          {techStack.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                {item.category}
              </span>
              <span className="text-xs text-slate-300 font-mono">
                {item.tech}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Limitations & Future Scope */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="cyber-card p-6 border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <Compass className="w-5 h-5" />
            <h3 className="text-base font-bold text-white">Current Limitations</h3>
          </div>
          <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside leading-relaxed">
            <li>Risk scoring is an educational evaluation model, not an official ISO/NIST certification.</li>
            <li>Absence of a record does not guarantee that an account has never been targeted in unpublished leaks.</li>
            <li>Default mode runs synthetic demonstration data for safe offline examination.</li>
          </ul>
        </div>

        <div className="cyber-card p-6 border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <Lightbulb className="w-5 h-5" />
            <h3 className="text-base font-bold text-white">Future Scope & Roadmap</h3>
          </div>
          <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside leading-relaxed">
            <li>Integration with live k-Anonymity password hash verification (Pwned Passwords API).</li>
            <li>Domain-wide organization exposure scans for institutional email addresses.</li>
            <li>Automated webhook and email alert notifications on new dark-web breach disclosures.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
