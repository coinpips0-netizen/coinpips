import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  HelpCircle,
  Calculator,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Signal, Instrument } from '../../types/market';
import { INITIAL_INSTRUMENTS, MARKET_SESSIONS } from '../../data/marketData';
import { useWatchlist } from '../../context/WatchlistContext';
import { TradingViewForexCrossRates } from '../tradingview/TradingViewForexCrossRates';

interface Props {
  signals: Signal[];
  onSelectSignal: (signal: Signal) => void;
  onSelectInstrument: (instrument: Instrument) => void;
  onOpenVipModal: () => void;
}

export const ForexSignalsView: React.FC<Props> = ({
  signals,
  onSelectSignal,
  onSelectInstrument,
  onOpenVipModal
}) => {
  const { isWatched, toggleWatchlist } = useWatchlist();
  const [filterPairType, setFilterPairType] = useState<'all' | 'majors' | 'crosses'>('all');
  const [showCrossRates, setShowCrossRates] = useState(false);

  const forexSignals = signals.filter(s => s.assetClass === 'forex');

  const filtered = forexSignals.filter(sig => {
    if (filterPairType === 'majors') {
      return ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF'].includes(sig.symbol);
    }
    return true;
  });

  const getInstrument = (symbol: string) => INITIAL_INSTRUMENTS.find(i => i.symbol === symbol);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title & Desk Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="text-sky-400" size={22} />
            <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
              Forex Signals & Currency Desks
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Major & cross currency setups with precise pip targets, stop-loss ratios, and session momentum
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCrossRates(!showCrossRates)}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
            showCrossRates
              ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          {showCrossRates ? 'Hide FX Cross Rates' : 'Show Live Cross Rates Matrix'}
        </button>
      </div>

      {/* Forex Cross Rates Matrix */}
      {showCrossRates && (
        <div className="rounded-xl border border-slate-800 bg-[#0c1017] p-2 overflow-hidden shadow-xl">
          <TradingViewForexCrossRates height={440} />
        </div>
      )}

      {/* Market Sessions Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {MARKET_SESSIONS.map(session => (
          <div key={session.name} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 font-bold">{session.name.split(' ')[0]}</span>
              <span className={`w-2 h-2 rounded-full ${
                session.status === 'OPEN' ? 'bg-emerald-400' : session.status === 'CLOSING_SOON' ? 'bg-amber-400' : 'bg-slate-600'
              }`} />
            </div>
            <div className="text-white font-semibold text-[11px] truncate">{session.city}</div>
            <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
              <span>{session.timezone}</span>
              <span className={session.status === 'OPEN' ? 'text-emerald-400' : 'text-slate-500 font-medium'}>
                {session.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Forex Signals Table */}
      <div className="rounded-xl border border-slate-800 bg-[#0c1017] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-[#090c12] border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Currency Pair</th>
                <th className="py-3 px-3 text-right">Bid / Ask</th>
                <th className="py-3 px-3 text-center">Bias</th>
                <th className="py-3 px-3 text-right">Entry Zone</th>
                <th className="py-3 px-3 text-right">Stop Loss</th>
                <th className="py-3 px-3 text-right">Target 1 / 2</th>
                <th className="py-3 px-3 text-center">R : R</th>
                <th className="py-3 px-3 text-center">Timeframe</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filtered.map(sig => {
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
                            toggleWatchlist({ symbol: sig.symbol, name: sig.name, assetClass: 'forex' });
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
                      {inst?.price.toFixed(sig.symbol.includes('JPY') ? 2 : 4) || sig.entryPrice}
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
                      {sig.stopLoss}
                    </td>

                    <td className="py-3.5 px-3 text-right text-emerald-400 tabular-nums">
                      {sig.takeProfit1} / {sig.takeProfit2}
                    </td>

                    <td className="py-3.5 px-3 text-center text-sky-400 font-semibold">
                      {sig.riskRewardRatio}
                    </td>

                    <td className="py-3.5 px-3 text-center text-slate-400">
                      {sig.timeframe}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-sky-400 bg-sky-500/10">
                        {sig.status}
                      </span>
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
