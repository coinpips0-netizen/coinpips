import React, { useState } from 'react';
import { CandlestickChart, Maximize2, Star } from 'lucide-react';
import { TradingViewAdvancedChart } from '../tradingview/TradingViewAdvancedChart';
import { INITIAL_INSTRUMENTS } from '../../data/marketData';
import { useWatchlist } from '../../context/WatchlistContext';

interface Props {
  initialSymbol?: string;
}

export const ChartsView: React.FC<Props> = ({ initialSymbol = 'BINANCE:BTCUSDT' }) => {
  const [currentSymbol, setCurrentSymbol] = useState(initialSymbol);
  const { isWatched, toggleWatchlist } = useWatchlist();

  const currentInst = INITIAL_INSTRUMENTS.find(i => i.tradingViewSymbol === currentSymbol);

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Top Header & Instrument Pill Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <CandlestickChart className="text-sky-400" size={22} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white font-sans">
                Interactive TradingView Charts
              </h1>
              {currentInst && (
                <button
                  type="button"
                  onClick={() => toggleWatchlist({ symbol: currentInst.symbol, name: currentInst.name, assetClass: currentInst.assetClass })}
                  className="text-slate-500 hover:text-amber-400"
                >
                  <Star size={14} fill={isWatched(currentInst.symbol) ? "currentColor" : "none"} className={isWatched(currentInst.symbol) ? "text-amber-400" : ""} />
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Official institutional charting terminal with multi-timeframe drawing tools & indicators
            </p>
          </div>
        </div>

        {/* Quick Instrument Switcher Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { label: 'BTC/USDT', s: 'BINANCE:BTCUSDT' },
            { label: 'ETH/USDT', s: 'BINANCE:ETHUSDT' },
            { label: 'EUR/USD', s: 'FX:EURUSD' },
            { label: 'GBP/USD', s: 'FX:GBPUSD' },
            { label: 'NVDA', s: 'NASDAQ:NVDA' },
            { label: 'S&P 500', s: 'FOREXCOM:SPXUSD' },
            { label: 'Gold', s: 'TVC:GOLD' }
          ].map(chip => (
            <button
              key={chip.s}
              type="button"
              onClick={() => setCurrentSymbol(chip.s)}
              className={`px-2.5 py-1 rounded text-xs font-mono whitespace-nowrap transition-colors ${
                currentSymbol === chip.s
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Full-Height Chart Frame */}
      <div className="flex-1 w-full rounded-xl overflow-hidden border border-slate-800 bg-[#0c1017] shadow-2xl">
        <TradingViewAdvancedChart
          symbol={currentSymbol}
          height="100%"
          showTimeframeBar={true}
        />
      </div>
    </div>
  );
};
