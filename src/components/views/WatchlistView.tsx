import React from 'react';
import { Star, Plus, Trash2, TrendingUp, TrendingDown, ExternalLink, BarChart2 } from 'lucide-react';
import { useWatchlist } from '../../context/WatchlistContext';
import { INITIAL_INSTRUMENTS } from '../../data/marketData';
import { Instrument } from '../../types/market';

interface Props {
  onSelectInstrument: (instrument: Instrument) => void;
  onOpenSearch: () => void;
}

export const WatchlistView: React.FC<Props> = ({ onSelectInstrument, onOpenSearch }) => {
  const { watchlist, toggleWatchlist, loading } = useWatchlist();

  const getInstrumentData = (symbol: string) => {
    return INITIAL_INSTRUMENTS.find(i => i.symbol === symbol);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Star className="text-amber-400" size={22} fill="currentColor" />
            <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
              Personal Market Watchlist
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Synchronized with Cloud Firestore across your active desktop and mobile sessions
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-400 hover:bg-sky-300 text-slate-950 text-xs font-bold transition-colors shadow-sm"
        >
          <Plus size={15} />
          <span>Add Instruments</span>
        </button>
      </div>

      {/* Watchlist Content */}
      <div className="rounded-xl border border-slate-800 bg-[#0c1017] overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 text-center text-slate-500 font-mono text-xs">
            Loading your tracked instruments from Firestore...
          </div>
        ) : watchlist.length === 0 ? (
          <div className="py-16 px-4 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
              <Star size={20} />
            </div>
            <h3 className="text-sm font-bold text-white font-sans">Your watchlist is currently empty</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Star your favorite cryptocurrencies, forex pairs, and stocks from any signal or search result to track them here.
            </p>
            <button
              type="button"
              onClick={onOpenSearch}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
            >
              Browse Instruments
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-[#090c12] border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Instrument</th>
                  <th className="py-3 px-3">Asset Class</th>
                  <th className="py-3 px-3 text-right">Price</th>
                  <th className="py-3 px-3 text-right">24h Chg</th>
                  <th className="py-3 px-3 text-right">24h High</th>
                  <th className="py-3 px-3 text-right">24h Low</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {watchlist.map(item => {
                  const inst = getInstrumentData(item.symbol);
                  const isBullish = (inst?.change24h || 0) >= 0;

                  return (
                    <tr
                      key={item.symbol}
                      onClick={() => inst && onSelectInstrument(inst)}
                      className="hover:bg-slate-900/60 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-white text-xs">
                        <div className="flex items-center gap-2">
                          <Star size={13} fill="currentColor" className="text-amber-400 shrink-0" />
                          <div>
                            <div>{inst?.displaySymbol || item.symbol}</div>
                            <div className="text-[10px] text-slate-400 font-sans font-normal">{item.name}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="px-1.5 py-0.5 rounded text-[10px] uppercase bg-slate-900 text-slate-400 border border-slate-800">
                          {item.assetClass}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-right font-bold text-white tabular-nums">
                        ${inst ? inst.price.toLocaleString(undefined, { minimumFractionDigits: inst.price > 100 ? 2 : 4 }) : '—'}
                      </td>

                      <td className={`py-3.5 px-3 text-right font-semibold tabular-nums ${
                        isBullish ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {inst ? `${isBullish ? '+' : ''}${inst.change24h}%` : '—'}
                      </td>

                      <td className="py-3.5 px-3 text-right text-slate-400 tabular-nums">
                        ${inst ? inst.high24h.toLocaleString() : '—'}
                      </td>

                      <td className="py-3.5 px-3 text-right text-slate-400 tabular-nums">
                        ${inst ? inst.low24h.toLocaleString() : '—'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (inst) onSelectInstrument(inst);
                            }}
                            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                            title="Load in terminal chart"
                          >
                            <BarChart2 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWatchlist(item);
                            }}
                            className="p-1.5 rounded hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Remove from Watchlist"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
