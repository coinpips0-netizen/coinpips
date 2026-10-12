import React from 'react';
import { Gem, TrendingUp, TrendingDown, Star, Sparkles } from 'lucide-react';
import { Signal, Instrument } from '../../types/market';
import { INITIAL_INSTRUMENTS } from '../../data/marketData';
import { useWatchlist } from '../../context/WatchlistContext';

interface Props {
  signals: Signal[];
  onSelectSignal: (signal: Signal) => void;
  onSelectInstrument: (instrument: Instrument) => void;
  onOpenVipModal: () => void;
}

export const CommoditiesView: React.FC<Props> = ({
  signals,
  onSelectSignal,
  onSelectInstrument,
  onOpenVipModal
}) => {
  const { isWatched, toggleWatchlist } = useWatchlist();
  const commSignals = signals.filter(s => s.assetClass === 'commodities');
  const getInstrument = (symbol: string) => INITIAL_INSTRUMENTS.find(i => i.symbol === symbol);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <Gem className="text-amber-400" size={22} />
          <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
            Commodities & Precious Metals
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          Gold, Silver, WTI Oil, and Natural Gas trend setups backed by real macro liquidity data
        </p>
      </div>

      {/* Highlights Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {INITIAL_INSTRUMENTS.filter(i => i.assetClass === 'commodities').map(comm => {
          const isBull = comm.change24h >= 0;
          return (
            <div
              key={comm.symbol}
              onClick={() => onSelectInstrument(comm)}
              className="p-4 rounded-xl bg-[#0c1017] border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-white font-mono">{comm.displaySymbol}</span>
                <span className={`text-[11px] font-mono font-semibold ${isBull ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isBull ? '+' : ''}{comm.change24h}%
                </span>
              </div>
              <div className="text-lg font-black text-white font-mono tabular-nums">
                ${comm.price.toLocaleString(undefined, { minimumFractionDigits: comm.price > 100 ? 2 : 3 })}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-2 flex items-center justify-between">
                <span>{comm.name}</span>
                <span className="text-slate-400">{comm.exchange}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Signals Table */}
      <div className="rounded-xl border border-slate-800 bg-[#0c1017] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-[#090c12] border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Commodity / Symbol</th>
                <th className="py-3 px-3 text-right">Price</th>
                <th className="py-3 px-3 text-center">Bias</th>
                <th className="py-3 px-3 text-right">Entry Zone</th>
                <th className="py-3 px-3 text-right">Stop Loss</th>
                <th className="py-3 px-3 text-right">Target 1 / 2</th>
                <th className="py-3 px-3 text-center">R : R</th>
                <th className="py-3 px-3 text-center">Timeframe</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {commSignals.map(sig => {
                const inst = getInstrument(sig.symbol);
                const isBuy = sig.direction.includes('BUY');
                const isSell = sig.direction.includes('SELL');

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
                            toggleWatchlist({ symbol: sig.symbol, name: sig.name, assetClass: 'commodities' });
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

                    <td className="py-3.5 px-3 text-right font-bold text-white tabular-nums">
                      ${inst ? inst.price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : sig.entryPrice.toLocaleString()}
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
                      ${sig.stopLoss.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3 text-right text-emerald-400 tabular-nums">
                      ${sig.takeProfit1.toLocaleString()} / ${sig.takeProfit2.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3 text-center text-sky-400 font-semibold">
                      {sig.riskRewardRatio}
                    </td>

                    <td className="py-3.5 px-3 text-center text-slate-400">
                      {sig.timeframe}
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
