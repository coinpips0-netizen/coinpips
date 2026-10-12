import React from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  BarChart2, 
  Crown, 
  Lock, 
  ArrowRight, 
  CheckCircle, 
  Coins, 
  ArrowRightLeft, 
  Globe 
} from 'lucide-react';
import { CoinPipsLogo } from '../common/CoinPipsLogo';
import { TradingViewTickerTape } from '../tradingview/TradingViewTickerTape';
import { INITIAL_INSTRUMENTS } from '../../data/marketData';

interface Props {
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onOpenDemo: () => void;
}

export const LandingView: React.FC<Props> = ({ onOpenAuth, onOpenDemo }) => {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      {/* Ticker Tape */}
      <TradingViewTickerTape />

      {/* Top Navigation */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-[#090c12]/80 backdrop-blur-md sticky top-0 z-20">
        <CoinPipsLogo size="md" />

        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#signals" className="hover:text-white transition-colors">Signal Engine</a>
          <a href="#vip" className="hover:text-white transition-colors">VIP Intelligence</a>
          <a href="#markets" className="hover:text-white transition-colors">Global Markets</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onOpenAuth('signin')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => onOpenAuth('signup')}
            className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-sky-400 hover:bg-sky-300 transition-colors shadow-sm"
          >
            Open Terminal
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative px-6 py-16 lg:py-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Next-Gen Financial Intelligence Terminal</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] text-balance">
                Precision Market Signals. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-300">
                  Zero Guesswork.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl">
                COINPIPS delivers institutional technical analysis, live TradingView charts, and multi-asset trade setups across Crypto, Forex, Stocks, Indices, and Commodities.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onOpenAuth('signup')}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-slate-950 bg-sky-400 hover:bg-sky-300 transition-colors shadow-lg shadow-sky-500/20"
                >
                  <span>Start Free Account</span>
                  <ArrowRight size={14} />
                </button>

                <button
                  type="button"
                  onClick={onOpenDemo}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-colors font-mono"
                >
                  <span>Instant Demo Mode</span>
                </button>
              </div>

              <div className="flex items-center gap-6 pt-4 text-xs font-mono text-slate-400 border-t border-slate-800/80">
                <div>
                  <span className="text-white font-bold block text-sm tabular-nums">99.98%</span>
                  <span>System Uptime</span>
                </div>
                <div>
                  <span className="text-white font-bold block text-sm tabular-nums">1:3.2</span>
                  <span>Avg VIP Risk/Reward</span>
                </div>
                <div>
                  <span className="text-white font-bold block text-sm tabular-nums">10,000+</span>
                  <span>Instruments Tracked</span>
                </div>
              </div>
            </div>

            {/* Hero Image Card */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
              <img
                src="/src/assets/images/hero_market_terminal_1791810334632.jpg"
                alt="COINPIPS Financial Trading Terminal"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090c12] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white font-sans">Institutional Terminal Grid</div>
                  <div className="text-[11px] font-mono text-slate-400">Live multi-exchange price feeds & technical engine</div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenAuth('signin')}
                  className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 text-xs font-semibold border border-sky-500/30 transition-colors"
                >
                  Enter Terminal
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Live Market Highlights Grid */}
        <section id="markets" className="px-6 py-12 max-w-7xl mx-auto border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white font-sans">Live Market Highlights</h2>
              <p className="text-xs text-slate-400 font-mono">Real-time asset quotes & 24h technical performance</p>
            </div>
            <button
              type="button"
              onClick={() => onOpenAuth('signin')}
              className="text-xs text-sky-400 hover:text-sky-300 font-mono flex items-center gap-1"
            >
              <span>View All 28+ Instruments</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INITIAL_INSTRUMENTS.slice(0, 8).map(inst => {
              const isBull = inst.change24h >= 0;
              return (
                <div 
                  key={inst.symbol}
                  onClick={() => onOpenAuth('signin')}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all hover:bg-slate-900/90"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-white font-mono">{inst.displaySymbol}</span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {inst.assetClass}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mb-3">{inst.name}</div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-extrabold text-white font-mono tabular-nums">
                      ${inst.price.toLocaleString(undefined, { minimumFractionDigits: inst.price > 100 ? 2 : 4 })}
                    </span>
                    <span className={`text-xs font-mono font-semibold ${isBull ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isBull ? '+' : ''}{inst.change24h}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="px-6 py-16 max-w-7xl mx-auto border-t border-slate-800/80">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Built for Systematic Traders</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Every signal generated by COINPIPS adheres to strict statistical boundaries, risk-reward ratios, and multi-indicator confirmation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                <BarChart2 size={20} />
              </div>
              <h3 className="text-base font-bold text-white">Algorithmic Signal Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                RSI oversold bounces, MACD momentum divergence, moving-average crossovers, and ATR volatility parameters computed dynamically.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-base font-bold text-white">Exact Risk Framework</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clear entry price, defined stop-loss, and multi-tier take-profit levels (TP1, TP2, TP3) calculated per setup with position sizing rules.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Crown size={20} />
              </div>
              <h3 className="text-base font-bold text-white">VIP Intelligence Suite</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Exclusive institutional trade setups, direct Gmail instant dispatches via Google Workspace API, and historical performance auditing.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 bg-[#05070a] border-t border-slate-800/80 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <CoinPipsLogo size="sm" />
          <div className="text-center sm:text-right">
            <div>© 2026 COINPIPS Terminal. All rights reserved.</div>
            <div className="text-[11px] text-slate-600 mt-1">
              Trading financial markets involves high risk. Signals are educational and not investment advice.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
