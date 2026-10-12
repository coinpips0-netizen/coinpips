import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Star, 
  Building2, 
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { Signal, Instrument } from '../../types/market';
import { INITIAL_INSTRUMENTS } from '../../data/marketData';
import { useWatchlist } from '../../context/WatchlistContext';
import { TradingViewStockScreener } from '../tradingview/TradingViewStockScreener';

interface Props {
  signals: Signal[];
  onSelectSignal: (signal: Signal) => void;
  onSelectInstrument: (instrument: Instrument) => void;
  onOpenVipModal: () => void;
}

export const StockSignalsView: React.FC<Props> = ({
  signals,
  onSelectSignal,
  onSelectInstrument,
  onOpenVipModal
}) => {
  const { isWatched, toggleWatchlist } = useWatchlist();
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [showScreener, setShowScreener] = useState<boolean>(false);

  const stockSignals = signals.filter(s => s.assetClass === 'stock');
  const getInstrument = (symbol: string) => INITIAL_INSTRUMENTS.find(i => i.symbol === symbol);

  const filtered = stockSignals.filter(sig => {
    const inst = getInstrument(sig.symbol);
    if (selectedSector !== 'all' && inst?.sector && !inst.sector.toLowerCase().includes(selectedSector.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="text-emerald-400" size={22} />
            <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
              Equity & Stock Market Signals
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            NASDAQ & NYSE equities with institutional momentum ratings, entry setups, and risk definitions
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowScreener(!showScreener)}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
            showScreener
              ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          {showScreener ? 'Hide Market Screener' : 'Show TradingView Stock Screener'}
        </button>
      </div>

      {/* Stock Screener Widget Accordion */}
      {showScreener && (
        <div className="rounded-xl border border-slate-800 bg-[#0c1017] p-2 overflow-hidden shadow-xl">
          <TradingViewStockScreener height={480} />
        </div>
      )}

      {/* Sector Filters */}
      <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#0c1017] border border-slate-800 overflow-x-auto text-xs">
        {['all', 'Technology', 'Semiconductors', 'Automotive', 'E-Commerce'].map(sec => (
          <button
            key={sec}
            type="button"
            onClick={() => setSelectedSector(sec)}
            className={`px-3 py-1 rounded-md text-xs font-mono whitespace-nowrap transition-colors ${
              selectedSector === sec
                ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            {sec === 'all' ? 'All Sectors' : sec}
          </button>
        ))}
      </div>

      {/* Stock Signals Table */}
      <div className="rounded-xl border border-slate-800 bg-[#0c1017] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-[#090c12] border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Company / Symbol</th>
                <th className="py-3 px-3">Sector</th>
                <th className="py-3 px-3 text-right">Price</th>
                <th className="py-3 px-3 text-right">24h Chg</th>
                <th className="py-3 px-3 text-center">Bias</th>
                <th className="py-3 px-3 text-right">Entry Zone</th>
                <th className="py-3 px-3 text-right">Stop Loss</th>
                <th className="py-3 px-3 text-right">Target 1</th>
                <th className="py-3 px-3 text-center">R : R</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filtered.map(sig => {
                const inst = getInstrument(sig.symbol);
                const isBuy = sig.direction.includes('BUY');
                const isSell = sig.direction.includes('SELL');
                const isBullish = (inst?.change24h || 0) >= 0;

                return (
                  <tr
                    key={sig.id}
                    onClick={() => onSelectSignal(sig)}
                    className="hover:bg-slate-900/60 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWatchlist({ symbol: sig.symbol, name: sig.name, assetClass: 'stock' });
                          }}
                          className="text-slate-500 hover:text-amber-400"
                        >
                          <Star size={13} fill={isWatched(sig.symbol) ? "currentColor" : "none"} className={isWatched(sig.symbol) ? "text-amber-400" : ""} />
                        </button>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-xs">{sig.symbol}</span>
                            {sig.isVip && (
                              <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                                VIP
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-sans">{sig.name}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-slate-400 text-[11px] font-sans">
                      {inst?.sector || 'Equities'}
                    </td>

                    <td className="py-3.5 px-3 text-right font-bold text-white tabular-nums">
                      ${inst ? inst.price.toFixed(2) : sig.entryPrice.toFixed(2)}
                    </td>

                    <td className={`py-3.5 px-3 text-right font-semibold tabular-nums ${
                      isBullish ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {inst ? `${isBullish ? '+' : ''}${inst.change24h}%` : '—'}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        isBuy ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : isSell ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {sig.direction.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right text-slate-200 tabular-nums">
                      {sig.entryZone}
                    </td>

                    <td className="py-3.5 px-3 text-right text-rose-400 font-semibold tabular-nums">
                      ${sig.stopLoss.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-3 text-right text-emerald-400 tabular-nums">
                      ${sig.takeProfit1.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-3 text-center text-sky-400 font-semibold">
                      {sig.riskRewardRatio}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSignal(sig);
                        }}
                        className="px-2.5 py-1 rounded bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 text-[11px] font-semibold border border-sky-500/30 transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
