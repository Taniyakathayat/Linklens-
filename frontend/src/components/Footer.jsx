import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, AlertCircle, Heart, FileText, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950/80 border-t border-slate-800/80 mt-20 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Project */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <Shield className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-lg font-bold text-white tracking-wider">
                LEAK<span className="text-cyan-400">LENS</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              A personal data exposure and cybersecurity risk assessment platform designed to help users 
              quantify digital footprints, understand compromised data categories, and take proactive defensive measures.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/40 border border-amber-800/40 px-3 py-2 rounded-lg">
              <Lock className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                <strong>Privacy Policy:</strong> LeakLens never asks for, stores, or reveals user passwords, tokens, or private secrets.
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase font-mono">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/scan" className="hover:text-cyan-400 transition-colors">Exposure Scanner</Link></li>
              <li><Link to="/dashboard" className="hover:text-cyan-400 transition-colors">Security Dashboard</Link></li>
              <li><Link to="/history" className="hover:text-cyan-400 transition-colors">Scan History</Link></li>
              <li><Link to="/tips" className="hover:text-cyan-400 transition-colors">Cybersecurity Tips</Link></li>
            </ul>
          </div>

          {/* Col 3: Academic Information */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase font-mono">Documentation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/how-it-works" className="hover:text-cyan-400 transition-colors">Architecture & Pipeline</Link></li>
              <li><Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy & Safety Framework</Link></li>
              <li><Link to="/about" className="hover:text-cyan-400 transition-colors">About Minor Project</Link></li>
              <li>
                <a 
                  href="http://127.0.0.1:8000/docs" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-1 hover:text-cyan-400 transition-colors text-cyan-400"
                >
                  FastAPI Swagger Docs <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimers */}
        <div className="pt-8 mt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} LeakLens. BCA 5th-Semester Minor Project. Built for Educational Cyber Defense.
          </p>
          <p className="flex items-center gap-1">
            Absence of breach results does not constitute guaranteed digital immunity.
          </p>
        </div>
      </div>
    </footer>
  );
}
