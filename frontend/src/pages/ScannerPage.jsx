import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  User, 
  Search, 
  Lock, 
  ShieldAlert, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  Info,
  Terminal
} from 'lucide-react';
import DemoBanner from '../components/DemoBanner';
import { api } from '../services/api';

export default function ScannerPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('email'); // 'email' | 'username'
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentScanStep, setCurrentScanStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const scanSteps = [
    'Validating identifier format...',
    'Checking exposure records in configured sources...',
    'Analyzing risk factors and breach severity...',
    'Generating defensive security recommendations...'
  ];

  const handleSelectDemoScenario = (demoId, type = 'email') => {
    setActiveTab(type);
    setIdentifier(demoId);
    setErrorMessage('');
  };

  const validateInput = () => {
    const val = identifier.trim();
    if (!val) {
      setErrorMessage('Please enter an email address or username.');
      return false;
    }

    if (val.length > 255) {
      setErrorMessage('Identifier exceeds maximum length limit.');
      return false;
    }

    // Defensive check: password rejection
    if (val.toLowerCase().includes('password') || val.toLowerCase().includes('secret=')) {
      setErrorMessage('Security Warning: Passwords and secrets must never be entered into LeakLens.');
      return false;
    }

    if (activeTab === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        setErrorMessage('Please enter a valid email address (e.g., student@example.com).');
        return false;
      }
    } else {
      if (val.length < 3) {
        setErrorMessage('Username must be at least 3 characters.');
        return false;
      }
      const userRegex = /^[a-zA-Z0-9_.-]+$/;
      if (!userRegex.test(val)) {
        setErrorMessage('Username may only contain letters, numbers, underscores, dots, and hyphens.');
        return false;
      }
    }

    return true;
  };

  const handleScan = async (e) => {
    e?.preventDefault();
    setErrorMessage('');

    if (!validateInput()) {
      return;
    }

    setIsLoading(true);
    setCurrentScanStep(0);

    // Multi-step animated progress simulation for realistic feedback
    const stepInterval = setInterval(() => {
      setCurrentScanStep((prev) => {
        if (prev < scanSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    try {
      const data = await api.performScan(identifier.trim(), activeTab);
      clearInterval(stepInterval);
      
      // Short delay for final step rendering
      setTimeout(() => {
        setIsLoading(false);
        navigate(`/results/${data.scan_id}`, { state: { scanData: data } });
      }, 500);
    } catch (err) {
      clearInterval(stepInterval);
      setIsLoading(false);
      let errorText = 'Unable to complete the exposure check. Please try again later.';
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          errorText = err.response.data.detail[0]?.msg?.replace(/^Value error,\s*/i, '') || errorText;
        } else if (typeof err.response.data.detail === 'string') {
          errorText = err.response.data.detail;
        }
      }
      setErrorMessage(errorText);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-cyan-950/70 border border-cyan-800/60 text-cyan-300">
          <Terminal className="w-3.5 h-3.5" />
          EXPOSURE ASSESSMENT CONSOLE
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Personal Data Exposure Scanner
        </h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Evaluate whether your digital identifiers have surfaced in recorded breach events.
        </p>
      </div>

      {/* Demo Quick Scenarios */}
      <DemoBanner onSelectScenario={handleSelectDemoScenario} />

      {/* Main Scanner Box */}
      <div className="cyber-card p-6 sm:p-8 border-slate-800 space-y-6">
        {/* Tab Toggle */}
        <div className="flex items-center justify-center">
          <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setActiveTab('email');
                setErrorMessage('');
              }}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'email'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4" />
              Email Address
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('username');
                setErrorMessage('');
              }}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'username'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              Username
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleScan} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
              {activeTab === 'email' ? <Mail className="w-5 h-5 text-cyan-400" /> : <User className="w-5 h-5 text-cyan-400" />}
            </div>

            <input
              type={activeTab === 'email' ? 'email' : 'text'}
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              disabled={isLoading}
              placeholder={activeTab === 'email' ? 'Enter email address (e.g. user@example.com)' : 'Enter username (e.g. cyber_user)'}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 font-mono text-base focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all disabled:opacity-50"
            />
          </div>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Privacy Protection:</strong> Only enter an email address or username. Never enter passwords, pins, or keys.
            </span>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isLoading || !identifier.trim()}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-base shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>Analyzing Exposure Footprint...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Analyze Exposure & Risk</span>
              </>
            )}
          </button>
        </form>

        {/* Multi-step loading progress display */}
        {isLoading && (
          <div className="p-5 rounded-xl bg-slate-950/90 border border-cyan-500/30 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-cyan-400 font-semibold">
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                SCAN IN PROGRESS
              </span>
              <span>Step {currentScanStep + 1} of 4</span>
            </div>
            
            <div className="space-y-2">
              {scanSteps.map((stepText, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 ${
                    idx <= currentScanStep ? 'text-slate-200' : 'text-slate-600'
                  }`}
                >
                  {idx < currentScanStep ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : idx === currentScanStep ? (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0"></span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-700 shrink-0"></span>
                  )}
                  <span>{stepText}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Safety & Academic Disclaimer */}
      <div className="cyber-card p-4 border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-slate-300">Important Disclaimer for Academic Evaluation:</p>
          <p className="mt-0.5">
            LeakLens operates strictly as an educational cyber posture assessment tool. 
            The absence of exposure in configured repositories does NOT guarantee that an account has never been targeted.
          </p>
        </div>
      </div>
    </div>
  );
}
