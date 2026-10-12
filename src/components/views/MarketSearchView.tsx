import React, { useState } from 'react';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  BarChart2, 
  ArrowRight, 
  ExternalLink,
  Activity
} from 'lucide-react';
import { INITIAL_INSTRUMENTS, INITIAL_SIGNALS } from '../../data/marketData';
import { Instrument, Signal, AssetClass } from '../../types/market';
import { useWatchlist } from '../../context/WatchlistContext';
import { TradingViewAdvancedChart } from '../tradingview/TradingViewAdvancedChart';
import { TradingViewTechnicalAnalysis } from '../tradingview/TradingViewTechnicalAnalysis';

interface Props {
  onSelectSignal: (signal: Signal) => void;
}

export const MarketSearchView: React.FC<Props> = ({ onSelectSignal }) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [inspectedInstrument, setInspectedInstrument] = useState<Instrument>(INITIAL_INSTRUMENTS[0]);
  const { isWatched, toggleWatchlist } = useWatchlist();

  const filtered = INITIAL_INSTRUMENTS.filter(inst => {
    const matchesQuery = 
      inst.symbol.toLowerCase().includes(query.toLowerCase()) ||
      inst.displaySymbol.toLowerCase().includes(query.toLowerCase()) ||
      inst.name.toLowerCase().includes(query.toLowerCase()) ||
      inst.exchange.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = activeCategory === 'all' || inst.assetClass === activeCategory;
    return matchesQuery && matchesCategory;
  });

  const availableSignals = INITIAL_SIGNALS.filter(s => s.symbol === inspectedInstrument.symbol);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <Search className="text-sky-400" size={22} />
          <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
            Global Market Instrument Search & Explorer
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          Explore real-time quotes, technical analysis gauges, and active signals across Crypto, Forex, Equities & Commodities
        </p>
      </div>

      {/* Search Input & Asset Filter */}
      <div className="p-4 rounded-xl bg-[#0c1017] border border-slate-800 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type any symbol or company name (e.g. BTC, EURUSD, AAPL, Gold, Tesla, S&P 500)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono shadow-inner"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {['all', 'crypto', 'forex', 'stock', 'indices', 'commodities'].map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-md text-xs font-mono capitalize transition-colors ${
                activeCategory === cat
                  ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              {cat === 'all' ? 'All Asset Classes' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Explorer Split: Results List on Left, Deep Dive Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Results List */}
        <div className="lg:col-span-1 rounded-xl border border-slate-800 bg-[#0c1017] overflow-hidden max-h-[680px] flex flex-col">
          <div className="px-4 py-3 bg-[#090c12] border-b border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Indexed Instruments</span>
            <span>{filtered.length} Results</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/70 p-1">
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-xs font-mono">
                No matching instruments found.
              </div>
            ) : (
              filtered.map(inst => {
                const isSelected = inspectedInstrument.symbol === inst.symbol;
                const isBull = inst.change24h >= 0;

                return (
                  <div
                    key={inst.symbol}
                    onClick={() => setInspectedInstrument(inst)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-slate-800/90 border border-slate-700/80'
                        : 'hover:bg-slate-900 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWatchlist({ symbol: inst.symbol, name: inst.name, assetClass: inst.assetClass });
                        }}
                        className="text-slate-500 hover:text-amber-400"
                      >
                        <Star size={13} fill={isWatched(inst.symbol) ? "currentColor" : "none"} className={isWatched(inst.symbol) ? "text-amber-400" : ""} />
                      </button>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-white font-mono">{inst.displaySymbol}</span>
                          <span className="text-[9px] uppercase px-1 rounded bg-slate-900 text-slate-400 font-mono">
                            {inst.assetClass}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans truncate max-w-[120px]">{inst.name}</div>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-xs font-bold text-white tabular-nums">
                        ${inst.price.toLocaleString(undefined, { minimumFractionDigits: inst.price > 100 ? 2 : 4 })}
                      </div>
                      <div className={`text-[10px] ${isBull ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isBull ? '+' : ''}{inst.change24h}%
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Instrument Details Workspace */}
        <div className="lg:col-span-2 space-y-4">
          {/* Detailed Instrument Header */}
          <div className="p-4 rounded-xl border border-slate-800 bg-[#0c1017] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white font-mono">{inspectedInstrument.displaySymbol}</h2>
                <span className="text-xs text-slate-400">· {inspectedInstrument.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-sky-400 uppercase">
                  {inspectedInstrument.exchange}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-slate-400 mt-2">
                <div>24h High: <strong className="text-white">${inspectedInstrument.high24h.toLocaleString()}</strong></div>
                <div>24h Low: <strong className="text-white">${inspectedInstrument.low24h.toLocaleString()}</strong></div>
                <div>Volume: <strong className="text-white">{inspectedInstrument.volume}</strong></div>
              </div>
            </div>

            <div className="text-left sm:text-right font-mono">
              <div className="text-2xl font-black text-white tabular-nums">
                ${inspectedInstrument.price.toLocaleString(undefined, { minimumFractionDigits: inspectedInstrument.price > 100 ? 2 : 4 })}
              </div>
              <div className={`text-xs font-bold ${
                inspectedInstrument.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {inspectedInstrument.change24h >= 0 ? '+' : ''}{inspectedInstrument.change24h}% (24H)
              </div>
            </div>
          </div>

          {/* Active Signals Available for this Instrument */}
          {availableSignals.length > 0 && (
            <div className="p-4 rounded-xl border border-sky-500/30 bg-sky-950/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-400 font-mono">
                <Activity size={14} />
                <span>Active Signal Detected for {inspectedInstrument.displaySymbol}</span>
              </div>
              {availableSignals.map(sig => (
                <div
                  key={sig.id}
                  onClick={() => onSelectSignal(sig)}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-sky-500/40 cursor-pointer text-xs font-mono transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      {sig.direction}
                    </span>
                    <span className="text-white">Entry: {sig.entryZone}</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400">TF: {sig.timeframe}</span>
                  </div>
                  <span className="text-sky-400 font-bold hover:underline">Inspect Signal Setup →</span>
                </div>
              ))}
            </div>
          )}

          {/* Live Chart for Inspected Instrument */}
          <div className="h-[440px] rounded-xl overflow-hidden border border-slate-800 bg-[#0c1017]">
            <TradingViewAdvancedChart
              symbol={inspectedInstrument.tradingViewSymbol}
              height="440px"
              showTimeframeBar={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
