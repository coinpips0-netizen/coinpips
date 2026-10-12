import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Lock, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  Globe, 
  Clock, 
  BarChart3, 
  Layers, 
  Sliders,
  ExternalLink,
  Crown,
  KeyRound
} from 'lucide-react';
import { CoinPipsLogo } from '../common/CoinPipsLogo';
import { TradingViewTickerTape } from '../tradingview/TradingViewTickerTape';
import { TradingViewTechnicalAnalysis } from '../tradingview/TradingViewTechnicalAnalysis';
import { useAuth } from '../../context/AuthContext';
import { connectGoogleWithGmail } from '../../services/gmailService';
import { Instrument } from '../../types/market';
import { MARKET_SESSIONS } from '../../data/marketData';

interface Props {
  liveInstruments: Instrument[];
}

export const LoginDashboard: React.FC<Props> = ({ liveInstruments }) => {
  const { loginWithEmailOnly } = useAuth();
  const [email, setEmail] = useState('');
  const [authenticating, setAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPreviewSymbol, setSelectedPreviewSymbol] = useState('BINANCE:BTCUSDT');
  const [flashedSymbols, setFlashedSymbols] = useState<Record<string, 'up' | 'down'>>({});
  const prevPricesRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const newFlashes: Record<string, 'up' | 'down'> = {};
    let hasChanges = false;

    liveInstruments.forEach(inst => {
      const prev = prevPricesRef.current[inst.symbol];
      if (prev !== undefined && prev !== inst.price) {
        newFlashes[inst.symbol] = inst.price > prev ? 'up' : 'down';
        hasChanges = true;
      }
      prevPricesRef.current[inst.symbol] = inst.price;
    });

    if (hasChanges) {
      setFlashedSymbols(prev => ({ ...prev, ...newFlashes }));
      const timer = setTimeout(() => {
        setFlashedSymbols({});
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [liveInstruments]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setError(null);
    setAuthenticating(true);
    try {
      await loginWithEmailOnly(email);
    } catch (err: any) {
      setError(err?.message || 'Authentication error. Please verify your email.');
      setAuthenticating(false);
    }
  };

  const handleQuickAccount = async (targetEmail: string, displayName: string, tier: 'free' | 'vip') => {
    setEmail(targetEmail);
    setError(null);
    setAuthenticating(true);
    try {
      await loginWithEmailOnly(targetEmail, displayName, tier);
    } catch (err: any) {
      setError(err?.message || 'Login failed.');
      setAuthenticating(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setAuthenticating(true);
    try {
      await connectGoogleWithGmail();
    } catch (err: any) {
      setError(err?.message || 'Google Authentication failed.');
      setAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col font-sans select-none">
      {/* Top Real-Time Scrolling Ticker Tape */}
      <TradingViewTickerTape />

      {/* Institutional Top Status Bar */}
      <div className="bg-[#080b11] border-b border-slate-800/80 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-bold">TERMINAL FEED ONLINE</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-2 text-slate-400 text-[11px]">
            <span>LATENCY: 14ms</span>
            <span>·</span>
            <span>DATA SOURCE: TRADINGVIEW & BINANCE LIVE</span>
          </div>
        </div>

        {/* Market Desks Clocks */}
        <div className="hidden md:flex items-center gap-3 text-[11px]">
          {MARKET_SESSIONS.slice(0, 3).map(s => (
            <div key={s.name} className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${s.status === 'OPEN' ? 'bg-emerald-400' : 'bg-slate-600'}`} />
              <span className="text-slate-400">{s.name.split(' ')[0]}:</span>
              <span className={s.status === 'OPEN' ? 'text-emerald-400 font-bold' : 'text-slate-500'}>{s.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Advanced Login Gateway Body */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 py-8 lg:py-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Live Terminal Intelligence & Ticker Monitor (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-sky-400 mb-3">
                <Zap size={13} className="text-sky-400" />
                <span>Next-Generation Financial Trading Terminal</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1]">
                COIN<span className="text-sky-400">PIPS</span> Institutional Desk
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl leading-relaxed">
                Stream real-time price discovery, technical analysis speedometers, and automated trade setups with zero manual sign-up friction.
              </p>
            </div>

            {/* Live Prices Grid - Moves Dynamically */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {liveInstruments.slice(0, 6).map(inst => {
                const isBull = inst.change24h >= 0;
                const isSelected = selectedPreviewSymbol === inst.tradingViewSymbol;
                const flash = flashedSymbols[inst.symbol];

                return (
                  <div
                    key={inst.symbol}
                    onClick={() => setSelectedPreviewSymbol(inst.tradingViewSymbol)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-slate-900 border-sky-500/50 shadow-md shadow-sky-500/10'
                        : flash === 'up'
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : flash === 'down'
                        ? 'bg-rose-950/20 border-rose-500/40'
                        : 'bg-[#0a0d14]/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-bold text-white">{inst.displaySymbol}</span>
                      </div>
                      <span className={`text-[10px] font-semibold ${isBull ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isBull ? '+' : ''}{inst.change24h}%
                      </span>
                    </div>
                    <div className={`text-base font-extrabold font-mono tabular-nums tracking-tight transition-colors duration-200 ${
                      flash === 'up'
                        ? 'text-emerald-400 scale-102 transform inline-block'
                        : flash === 'down'
                        ? 'text-rose-400 scale-102 transform inline-block'
                        : 'text-white'
                    }`}>
                      ${inst.price.toLocaleString(undefined, { minimumFractionDigits: inst.price > 100 ? 2 : 4 })}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1 flex items-center justify-between">
                      <span className="uppercase">{inst.assetClass}</span>
                      <span className="text-sky-400 hover:underline">Inspect →</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live TradingView Technical Analysis Meter Widget Preview */}
            <div className="p-4 rounded-2xl border border-slate-800 bg-[#0a0d14] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-200 font-bold">
                  <BarChart3 size={15} className="text-sky-400" />
                  <span>Real-Time Technical Sentiment Gauge</span>
                </div>
                <span className="text-sky-400">{selectedPreviewSymbol}</span>
              </div>
              <TradingViewTechnicalAnalysis
                symbol={selectedPreviewSymbol}
                interval="1h"
                height={280}
              />
            </div>
          </div>

          {/* Right Column: Advanced Email-Only Authentication Portal (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-slate-800 bg-[#0a0d14] p-6 sm:p-8 shadow-2xl space-y-6">
              {/* Header */}
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                  <CoinPipsLogo size="md" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white font-sans">
                  Institutional Terminal Access
                </h2>
                <p className="text-xs text-slate-400">
                  Enter your email address for instant, passwordless session initialization.
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <span className="shrink-0">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Email-Only Authentication Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                    Corporate or Personal Email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-3 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. coinpips0@gmail.com"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors shadow-inner"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authenticating}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 text-xs font-black font-mono transition-all shadow-lg shadow-sky-500/20 disabled:opacity-50"
                >
                  <span>{authenticating ? 'INITIALIZING TERMINAL...' : 'ACCESS TRADING TERMINAL'}</span>
                  <ArrowRight size={15} />
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-mono">
                  <span className="px-2 bg-[#0a0d14] text-slate-500">Quick Institutional Profiles</span>
                </div>
              </div>

              {/* Quick Select Profile Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleQuickAccount('coinpips0@gmail.com', 'Administrator Desk', 'vip')}
                  disabled={authenticating}
                  className="flex items-center justify-between w-full p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-xs font-mono transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <Crown size={14} className="text-amber-400 shrink-0" />
                    <div>
                      <div className="font-bold text-white text-[11px]">coinpips0@gmail.com</div>
                      <div className="text-[10px] text-slate-400">Master VIP Institutional Account</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    VIP 1-CLICK
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickAccount('quant.desk@coinpips.com', 'Quantitative Algo Desk', 'vip')}
                  disabled={authenticating}
                  className="flex items-center justify-between w-full p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/40 text-xs font-mono transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <Zap size={14} className="text-sky-400 shrink-0" />
                    <div>
                      <div className="font-bold text-white text-[11px]">quant.desk@coinpips.com</div>
                      <div className="text-[10px] text-slate-400">Algorithmic Signals Pro Trader</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-sky-400 font-bold bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">
                    PRO 1-CLICK
                  </span>
                </button>
              </div>

              {/* Google Workspace OAuth Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={authenticating}
                  className="flex items-center justify-center gap-2.5 w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.98 0 12s.45 3.84 1.24 5.42l4.04-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>Sign in with Google (Workspace & Gmail)</span>
                </button>
              </div>

              {/* Security Guard Badges */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={12} className="text-emerald-400" />
                  <span>256-Bit TLS · Zero Password Risk</span>
                </span>
                <span>Firebase Auth</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <footer className="border-t border-slate-800/80 bg-[#040609] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono">
        <div className="flex items-center gap-3">
          <span className="text-slate-300 font-bold">COINPIPS 2026</span>
          <span>·</span>
          <span>Official Financial Markets Terminal</span>
        </div>
        <div className="text-[11px] text-slate-600">
          Real-time tick engine synchronized with TradingView & Binance feeds.
        </div>
      </footer>
    </div>
  );
};
