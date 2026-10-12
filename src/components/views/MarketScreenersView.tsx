import React, { useState } from 'react';
import { Layers, Flame, Table, ArrowRightLeft, TrendingUp, ShieldAlert, Sliders } from 'lucide-react';
import { TradingViewStockScreener } from '../tradingview/TradingViewStockScreener';
import { TradingViewCryptoHeatmap } from '../tradingview/TradingViewCryptoHeatmap';
import { TradingViewForexCrossRates } from '../tradingview/TradingViewForexCrossRates';

export const MarketScreenersView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'screener' | 'crypto-heatmap' | 'forex-cross'>('screener');
  const [stockScreenFilter, setStockScreenFilter] = useState<'general' | 'top_gainers' | 'most_capitalized' | 'volume_leaders'>('general');

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title & Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="text-sky-400" size={22} />
            <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
              Market Screeners & Interactive Heatmaps
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Investing.com institutional scanning suite: US Equity Screener, Global Crypto Heatmap, and Forex Matrix
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0c1017] rounded-xl border border-slate-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('screener')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'screener'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Table size={14} />
            <span>Stock Screener</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('crypto-heatmap')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'crypto-heatmap'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame size={14} />
            <span>Crypto Heatmap</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('forex-cross')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'forex-cross'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowRightLeft size={14} />
            <span>Forex Cross Rates</span>
          </button>
        </div>
      </div>

      {/* Tab Content: Stock Screener */}
      {activeTab === 'screener' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0c1017] border border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Preset Filter:</span>
              <div className="flex items-center gap-1">
                {[
                  { id: 'general', label: 'All Americas' },
                  { id: 'most_capitalized', label: 'Mega Caps' },
                  { id: 'top_gainers', label: 'Top Gainers' },
                  { id: 'volume_leaders', label: 'Volume Leaders' }
                ].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setStockScreenFilter(f.id as any)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                      stockScreenFilter === f.id
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-slate-500 text-[11px]">
              <span>Real-Time Scanning</span>
              <span>·</span>
              <span>P/E, EPS, Volume, Market Cap</span>
            </div>
          </div>

          <TradingViewStockScreener
            height={620}
            defaultScreen={stockScreenFilter}
          />
        </div>
      )}

      {/* Tab Content: Crypto Heatmap */}
      {activeTab === 'crypto-heatmap' && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-[#0c1017] border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-bold">Visual Crypto Market Map</span>
              <span className="text-slate-500">| Sized by Market Capitalization, colored by 24h Performance</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="inline-block w-3 h-3 rounded bg-emerald-500/60" /> Bullish
              <span className="inline-block w-3 h-3 rounded bg-rose-500/60 ml-2" /> Bearish
            </div>
          </div>

          <TradingViewCryptoHeatmap
            height={620}
          />
        </div>
      )}

      {/* Tab Content: Forex Cross Rates */}
      {activeTab === 'forex-cross' && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-[#0c1017] border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-bold">G10 Major Currency Cross-Rates</span>
              <span className="text-slate-500">| Real-time pricing across EUR, USD, JPY, GBP, CHF, AUD, CAD, NZD</span>
            </div>
            <span className="text-slate-400 text-[11px]">Direct Interbank Quotes</span>
          </div>

          <TradingViewForexCrossRates
            height={560}
          />
        </div>
      )}
    </div>
  );
};
