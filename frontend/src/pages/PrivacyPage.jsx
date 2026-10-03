import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  AlertOctagon, 
  FileCheck, 
  CheckCircle2, 
  EyeOff,
  Server,
  Database
} from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-cyan-950/70 border border-cyan-800/60 text-cyan-300">
          <Lock className="w-3.5 h-3.5" />
          ETHICAL & DEFENSIVE FRAMEWORK
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Privacy & Safety Policy
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Our core commitments to data minimization, non-invasive threat assessment, and user security.
        </p>
      </div>

      {/* Critical Safety Warning Callout */}
      <div className="p-6 rounded-2xl bg-red-950/40 border border-red-800/80 space-y-3">
        <div className="flex items-center gap-3">
          <AlertOctagon className="w-6 h-6 text-red-400 shrink-0" />
          <h2 className="text-lg font-bold text-red-200">Strict Safety Rule: Never Enter Secrets</h2>
        </div>
        <p className="text-xs text-red-300/90 leading-relaxed">
          Never enter passwords, OTPs, recovery keys, API tokens, PIN codes, or private credentials into LeakLens. 
          LeakLens only evaluates public identifiers (email addresses and usernames) to assess whether third-party 
          platforms have leaked metadata.
        </p>
      </div>

      {/* Key Privacy Commitments */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white">Our 5 Privacy Commitments</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="cyber-card p-6 border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <EyeOff className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">1. Zero Password Collection</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              We never request, store, verify, or display actual plaintext passwords or leaked hashes. 
              Only indicator flags (e.g. "Password metadata was present in incident") are surfaced.
            </p>
          </div>

          <div className="cyber-card p-6 border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">2. Masking & SHA-256 Hashing</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Assessed email addresses and usernames are masked in reports (e.g. <code>ta***@example.com</code>) 
              and stored solely as cryptographic SHA-256 digests in audit databases.
            </p>
          </div>

          <div className="cyber-card p-6 border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">3. Synthetic Demo Safety</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              By default, LeakLens executes in Demo Mode using synthetic, fictitious accounts 
              (<code>safe.demo@example.com</code>, <code>exposed.demo@example.com</code>). 
              No real personal records are queried during offline college presentations.
            </p>
          </div>

          <div className="cyber-card p-6 border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">4. User-Controlled Audit Erasure</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Users maintain full control over their scan logs and may wipe all local database history 
              at any moment with one click from the Scan History console.
            </p>
          </div>
        </div>
      </div>

      {/* Honest Limitations Notice */}
      <div className="cyber-card p-6 sm:p-8 border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">Absence of Record Disclaimer</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          If LeakLens returns <em>"No known exposure found in configured sources"</em>, this does NOT mean your account 
          is 100% immune from compromise. Undiscovered breaches, unpublished private dumps, or malware infections 
          may exist. We strongly advise continuous cyber hygiene, unique passwords, and universal MFA.
        </p>
      </div>
    </div>
  );
}
