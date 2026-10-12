import React, { useState } from 'react';
import { Mail, Lock, User, AlertCircle, X, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { connectGoogleWithGmail } from '../../services/gmailService';
import { CoinPipsLogo } from './CoinPipsLogo';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'reset';
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const { signIn, signUp, sendPasswordReset, signInAsDemo } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
        onClose();
      } else if (mode === 'signup') {
        if (!name.trim()) throw new Error('Please enter your full name');
        if (password.length < 6) throw new Error('Password must be at least 6 characters');
        await signUp(name, email, password);
        onClose();
      } else if (mode === 'reset') {
        await sendPasswordReset(email);
        setResetSent(true);
      }
    } catch (err: any) {
      let msg = err?.message || 'Authentication failed. Please verify your credentials.';
      if (err?.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
      if (err?.code === 'auth/email-already-in-use') msg = 'This email is already registered. Try signing in.';
      if (err?.code === 'auth/weak-password') msg = 'Password should be at least 6 characters.';
      if (err?.code === 'auth/user-not-found') msg = 'No account found with this email.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInAsDemo();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await connectGoogleWithGmail();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Google Sign-In failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-[#0c1017] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-md"
        >
          <X size={20} />
        </button>

        {/* Logo and title */}
        <div className="flex flex-col items-center text-center mb-6">
          <CoinPipsLogo size="lg" className="mb-2" />
          <p className="text-xs text-slate-400">
            {mode === 'signin' && 'Sign in to access your financial market terminal & signals'}
            {mode === 'signup' && 'Create your free account to unlock real-time trading signals'}
            {mode === 'reset' && 'Reset your password with Firebase secure link'}
          </p>
        </div>

        {/* Tabs: Sign In vs Sign Up */}
        {mode !== 'reset' && (
          <div className="flex p-1 bg-slate-900 rounded-lg border border-slate-800 mb-6 text-xs">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(null); }}
              className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
                mode === 'signin'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); }}
              className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
                mode === 'signup'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {resetSent ? (
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400">
              <Check size={24} />
            </div>
            <p className="text-xs text-slate-300">
              A password reset link has been dispatched to <strong className="text-white">{email}</strong>. Please check your inbox.
            </p>
            <button
              type="button"
              onClick={() => { setMode('signin'); setResetSent(false); }}
              className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white font-medium"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alexander Hamilton"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:border-sky-500 focus:outline-none text-xs text-white placeholder-slate-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trader@coinpips.com"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:border-sky-500 focus:outline-none text-xs text-white placeholder-slate-500"
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-300">Password</label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => { setMode('reset'); setError(null); }}
                      className="text-[11px] text-sky-400 hover:text-sky-300"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:border-sky-500 focus:outline-none text-xs text-white placeholder-slate-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-sky-400 hover:bg-sky-300 text-slate-950 text-xs font-bold transition-colors disabled:opacity-50 mt-2 shadow-sm"
            >
              <span>{loading ? 'Authenticating...' : mode === 'signin' ? 'Sign In to Terminal' : mode === 'signup' ? 'Create Free Account' : 'Send Password Reset'}</span>
              <ArrowRight size={14} />
            </button>

            {mode === 'reset' && (
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(null); }}
                className="w-full text-center text-xs text-slate-400 hover:text-white pt-2"
              >
                Back to Sign In
              </button>
            )}

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono">
                <span className="px-2 bg-[#0c1017] text-slate-500">Or continue with</span>
              </div>
            </div>

            {/* Official Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex items-center justify-center gap-3 w-full py-2 px-4 rounded-lg bg-white hover:bg-slate-100 text-slate-900 text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.98 0 12s.45 3.84 1.24 5.42l4.04-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Sign in with Google (Workspace Enabled)</span>
            </button>

            {/* Instant Demo Login Button */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono transition-colors border border-slate-700/60"
            >
              <span>Demo Institutional Mode (One-Click Test)</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
