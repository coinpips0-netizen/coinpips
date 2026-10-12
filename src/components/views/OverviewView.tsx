import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  Star, 
  ArrowRight, 
  Sparkles, 
  Coins, 
  ArrowRightLeft, 
  BarChart3, 
  Gem,
  ExternalLink,
  Globe,
  Sliders,
  Landmark,
  Layers,
  Calculator,
  Briefcase,
  Users
} from 'lucide-react';
import { Instrument, Signal } from '../../types/market';
import { INITIAL_INSTRUMENTS, MARKET_NEWS, ECONOMIC_EVENTS, MARKET_SESSIONS } from '../../data/marketData';
import { TradingViewAdvancedChart } from '../tradingview/TradingViewAdvancedChart';
import { TradingViewTechnicalAnalysis } from '../tradingview/TradingViewTechnicalAnalysis';
import { useWatchlist } from '../../context/WatchlistContext';
import { useAuth } from '../../context/AuthContext';

interface Props {
  signals: Signal[];
  onSelectSignal: (signal: Signal) => void;
  onNavigate: (viewId: string) => void;
  onSelectInstrument: (instrument: Instrument) => void;
}

export const OverviewView: React.FC<Props> = ({
  signals,
  onSelectSignal,
  onNavigate,
  onSelectInstrument
}) => {
  const [selectedChartSymbol, setSelectedChartSymbol] = useState('BINANCE:BTCUSDT');
  const { isWatched, toggleWatchlist } = useWatchlist();
  const { isVip } = useAuth();

  const activeSignals = signals.filter(s => s.status === 'ACTIVE').slice(0, 4);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Market Status & Quick KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {INITIAL_INSTRUMENTS.slice(0, 4).map(inst => {
          const isBull = inst.change24h >= 0;
          return (
            <div
              key={inst.symbol}
              onClick={() => setSelectedChartSymbol(inst.tradingViewSymbol)}
              className={`p-3.5 rounded-xl bg-slate-900/70 border cursor-pointer transition-all hover:bg-slate-900 ${
                selectedChartSymbol === inst.tradingViewSymbol
                  ? 'border-sky-500/50 shadow-md shadow-sky-500/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-white font-mono">{inst.displaySymbol}</span>
                <span className={`text-[11px] font-mono font-semibold flex items-center gap-0.5 ${
                  isBull ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {isBull ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  <span>{isBull ? '+' : ''}{inst.change24h}%</span>
                </span>
              </div>
              <div className="text-base sm:text-lg font-black text-white font-mono tabular-nums">
                ${inst.price.toLocaleString(undefined, { minimumFractionDigits: inst.price > 100 ? 2 : 4 })}
              </div>
              <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between mt-1">
                <span>Vol {inst.volume}</span>
                <span className="text-slate-400">{inst.exchange}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Investing.com Suite Signature Fast Launch Bar */}
      <div className="p-3 bg-[#0c1017] rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="font-bold text-white text-[11px] uppercase tracking-wider">Investing.com Terminal Suite:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => onNavigate('world-indices-bonds')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] transition-colors"
          >
            <Globe size={13} className="text-purple-400" />
            <span>World Indices & Bonds</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('technical-summary-pivots')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] transition-colors"
          >
            <Sliders size={13} className="text-sky-400" />
            <span>Technical & Pivots</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('calendar-hub')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] transition-colors"
          >
            <Landmark size={13} className="text-amber-400" />
            <span>Rates & Earnings</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('market-screeners')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] transition-colors"
          >
            <Layers size={13} className="text-emerald-400" />
            <span>Screeners & Heatmap</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('calculators')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] transition-colors"
          >
            <Calculator size={13} className="text-sky-400" />
            <span>Calculators</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('portfolio-alerts')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] transition-colors"
          >
            <Briefcase size={13} className="text-amber-400" />
            <span>Portfolio & Alerts</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('community-sentiment')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] transition-colors"
          >
            <Users size={13} className="text-pink-400" />
            <span>Trader Sentiment</span>
          </button>
        </div>
      </div>

      {/* Primary Chart & Technical Analysis Gauge Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Advanced Chart */}
        <div className="lg:col-span-2 rounded-xl overflow-hidden border border-slate-800 bg-[#0c1017]">
          <TradingViewAdvancedChart
            symbol={selectedChartSymbol}
            height={520}
            showTimeframeBar={true}
          />
        </div>

        {/* Technical Analysis Meter & Session Clocks */}
        <div className="space-y-4">
          <div className="p-3 bg-[#0c1017] rounded-xl border border-slate-800">
            <div className="text-xs font-bold text-slate-300 font-mono mb-2 flex items-center justify-between">
              <span>LIVE TECHNICAL METER</span>
              <span className="text-[10px] text-slate-500 font-mono">{selectedChartSymbol}</span>
            </div>
            <TradingViewTechnicalAnalysis
              symbol={selectedChartSymbol}
              height={320}
            />
          </div>

          {/* Market Sessions Monitor */}
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 font-mono">
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-sky-400" />
                <span>Global Market Desks</span>
              </span>
              <span className="text-[10px] text-slate-500">UTC Timezone</span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              {MARKET_SESSIONS.map(session => (
                <div key={session.name} className="flex items-center justify-between py-1 border-b border-slate-800/60 last:border-none">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      session.status === 'OPEN' ? 'bg-emerald-400' : session.status === 'CLOSING_SOON' ? 'bg-amber-400' : 'bg-slate-600'
                    }`} />
                    <span className="text-slate-300">{session.name}</span>
                  </div>
                  <span className={`text-[11px] font-semibold ${
                    session.status === 'OPEN' ? 'text-emerald-400' : session.status === 'CLOSING_SOON' ? 'text-amber-400' : 'text-slate-500'
                  }`}>
                    {session.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Latest Technical Signals Desk */}
      <div className="rounded-xl border border-slate-800 bg-[#0c1017] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#0a0d14] border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-sky-400" />
            <h3 className="text-sm font-bold text-white font-sans">Active Trade Signals Desk</h3>
            <span className="text-xs text-slate-500 font-mono">· Automated RSI/MACD/EMA Engine</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('crypto-signals')}
            className="text-xs text-sky-400 hover:text-sky-300 font-mono flex items-center gap-1"
          >
            <span>Explore All Signals</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="divide-y divide-slate-800/80">
          {activeSignals.map(sig => {
            const isBuy = sig.direction.includes('BUY');
            const isSell = sig.direction.includes('SELL');
            return (
              <div
                key={sig.id}
                onClick={() => onSelectSignal(sig)}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-900/60 cursor-pointer transition-colors gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                    isBuy ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : isSell ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {sig.direction}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white font-mono">{sig.symbol}</span>
                      <span className="text-xs text-slate-400">· {sig.name}</span>
                      {sig.isVip && (
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1 rounded border border-amber-500/20">
                          VIP
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      TF: {sig.timeframe} · Entry: {sig.entryZone} · R:R {sig.riskRewardRatio}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 text-xs font-mono">
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400">Stop Loss / TP1</div>
                    <div className="font-semibold text-slate-200">
                      <span className="text-rose-400">{sig.stopLoss}</span> / <span className="text-emerald-400">{sig.takeProfit1}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedChartSymbol(sig.tradingViewSymbol);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] transition-colors"
                    >
                      Load Chart
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSignal(sig);
                      }}
                      className="px-2.5 py-1 rounded bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 font-semibold text-[11px] border border-sky-500/30 transition-colors"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Grid: Market News & Economic Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Market News */}
        <div className="p-4 rounded-xl border border-slate-800 bg-[#0c1017] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <h4 className="text-xs font-bold text-white font-sans uppercase tracking-wider">
              Market Intelligence Wire
            </h4>
            <button
              type="button"
              onClick={() => onNavigate('market-news')}
              className="text-[11px] text-sky-400 font-mono hover:text-sky-300"
            >
              Full Feed →
            </button>
          </div>

          <div className="space-y-3">
            {MARKET_NEWS.slice(0, 3).map(news => (
              <div key={news.id} className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                  <span className="text-sky-400 font-medium">{news.source}</span>
                  <span>·</span>
                  <span>{news.time}</span>
                  <span>·</span>
                  <span className={`uppercase ${
                    news.sentiment === 'bullish' ? 'text-emerald-400' : news.sentiment === 'bearish' ? 'text-rose-400' : 'text-slate-400'
                  }`}>{news.sentiment}</span>
                </div>
                <h5 className="text-xs font-semibold text-slate-200 hover:text-white cursor-pointer leading-snug">
                  {news.title}
                </h5>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {news.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Economic Calendar Digest */}
        <div className="p-4 rounded-xl border border-slate-800 bg-[#0c1017] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <h4 className="text-xs font-bold text-white font-sans uppercase tracking-wider">
              Today's Economic Calendar
            </h4>
            <button
              type="button"
              onClick={() => onNavigate('economic-calendar')}
              className="text-[11px] text-sky-400 font-mono hover:text-sky-300"
            >
              Full Calendar →
            </button>
          </div>

          <div className="space-y-2">
            {ECONOMIC_EVENTS.map(evt => (
              <div key={evt.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    evt.impact === 'HIGH' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : evt.impact === 'MED' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {evt.impact}
                  </span>
                  <div>
                    <div className="font-semibold text-white">{evt.currency} · {evt.event}</div>
                    <div className="text-[10px] text-slate-500">{evt.time}</div>
                  </div>
                </div>

                <div className="text-right text-[11px]">
                  <div className="text-slate-300">Act: <span className="font-bold text-white">{evt.actual}</span></div>
                  <div className="text-slate-500">Exp: {evt.forecast}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
