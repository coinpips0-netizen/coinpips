import React, { useState } from 'react';
import { 
  Coins, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Filter, 
  ArrowUpDown, 
  CheckCircle2, 
  Clock, 
  XCircle,
  ExternalLink,
  Star
} from 'lucide-react';
import { Signal, Instrument } from '../../types/market';
import { INITIAL_INSTRUMENTS } from '../../data/marketData';
import { useWatchlist } from '../../context/WatchlistContext';
import { useAuth } from '../../context/AuthContext';
import { TradingViewCryptoHeatmap } from '../tradingview/TradingViewCryptoHeatmap';

interface Props {
  signals: Signal[];
  onSelectSignal: (signal: Signal) => void;
  onSelectInstrument: (instrument: Instrument) => void;
  onOpenVipModal: () => void;
}

export const CryptoSignalsView: React.FC<Props> = ({
  signals,
  onSelectSignal,
  onSelectInstrument,
  onOpenVipModal
}) => {
  const { isWatched, toggleWatchlist } = useWatchlist();
  const { isVip } = useAuth();
  
  const [filterDirection, setFilterDirection] = useState<string>('all');
  const [filterTimeframe, setFilterTimeframe] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);

  const cryptoSignals = signals.filter(s => s.assetClass === 'crypto');

  const filtered = cryptoSignals.filter(sig => {
    const matchesDirection = filterDirection === 'all' || sig.direction === filterDirection;
    const matchesTimeframe = filterTimeframe === 'all' || sig.timeframe === filterTimeframe;
    const matchesStatus = filterStatus === 'all' || sig.status === filterStatus;
    const matchesSearch = 
      sig.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sig.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDirection && matchesTimeframe && matchesStatus && matchesSearch;
  });

  const getInstrument = (symbol: string) => {
    return INITIAL_INSTRUMENTS.find(i => i.symbol === symbol);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Coins className="text-amber-400" size={22} />
            <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
              Cryptocurrency Signals Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Systematic spot & futures trade setups calculated with RSI, MACD, Moving Averages and ATR
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
              showHeatmap
                ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            {showHeatmap ? 'Hide Market Heatmap' : 'Show Crypto Heatmap'}
          </button>
        </div>
      </div>

      {/* Optional Heatmap Accordion */}
      {showHeatmap && (
        <div className="rounded-xl border border-slate-800 bg-[#0c1017] p-2 overflow-hidden shadow-xl">
          <TradingViewCryptoHeatmap height={420} />
        </div>
      )}

      {/* Filter Bar */}
      <div className="p-3 rounded-xl bg-[#0c1017] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter pair (e.g. BTC, SOL)..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
          />
        </div>

        {/* Direction Filter */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {['all', 'STRONG_BUY', 'BUY', 'NEUTRAL', 'SELL', 'STRONG_SELL'].map(dir => (
            <button
              key={dir}
              type="button"
              onClick={() => setFilterDirection(dir)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                filterDirection === dir
                  ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              {dir === 'all' ? 'All Directions' : dir.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Timeframe & Status Dropdowns */}
        <div className="flex items-center gap-2">
          <select
            value={filterTimeframe}
            onChange={(e) => setFilterTimeframe(e.target.value)}
            className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono focus:outline-none"
          >
            <option value="all">All Timeframes</option>
            <option value="15m">15m</option>
            <option value="1h">1h</option>
            <option value="4h">4h</option>
            <option value="1D">1D</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="HIT_TARGET">HIT TARGET</option>
            <option value="STOPPED_OUT">STOPPED OUT</option>
          </select>
        </div>
      </div>

      {/* Signals Table */}
      <div className="rounded-xl border border-slate-800 bg-[#0c1017] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#090c12] border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Asset / Symbol</th>
                <th className="py-3 px-3 text-right">Live Price</th>
                <th className="py-3 px-3 text-right">24h Chg</th>
                <th className="py-3 px-3 text-center">Trend</th>
                <th className="py-3 px-3 text-center">Signal</th>
                <th className="py-3 px-3 text-right">Entry Zone</th>
                <th className="py-3 px-3 text-right">Stop Loss</th>
                <th className="py-3 px-3 text-right">Target 1 / 2</th>
                <th className="py-3 px-3 text-center">R : R</th>
                <th className="py-3 px-3 text-center">TF</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 font-mono">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-500 text-xs">
                    No cryptocurrency signals matched the specified filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((sig) => {
                  const inst = getInstrument(sig.symbol);
                  const isBuy = sig.direction.includes('BUY');
                  const isSell = sig.direction.includes('SELL');
                  const isBullishChange = (inst?.change24h || 0) >= 0;

                  return (
                    <tr
                      key={sig.id}
                      onClick={() => onSelectSignal(sig)}
                      className="hover:bg-slate-900/60 cursor-pointer transition-colors"
                    >
                      {/* Asset / Symbol */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWatchlist({ symbol: sig.symbol, name: sig.name, assetClass: 'crypto' });
                            }}
                            className="text-slate-500 hover:text-amber-400"
                          >
                            <Star size={13} fill={isWatched(sig.symbol) ? "currentColor" : "none"} className={isWatched(sig.symbol) ? "text-amber-400" : ""} />
                          </button>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white text-xs">{sig.symbol}</span>
                              {sig.isVip && (
                                <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                                  VIP
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-sans">{sig.name}</div>
                          </div>
                        </div>
                      </td>

                      {/* Current Price */}
                      <td className="py-3.5 px-3 text-right font-bold text-white tabular-nums">
                        ${inst ? inst.price.toLocaleString(undefined, { minimumFractionDigits: inst.price > 100 ? 2 : 4 }) : sig.entryPrice.toLocaleString()}
                      </td>

                      {/* 24h Change */}
                      <td className={`py-3.5 px-3 text-right font-semibold tabular-nums ${
                        isBullishChange ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {inst ? `${isBullishChange ? '+' : ''}${inst.change24h}%` : '—'}
                      </td>

                      {/* Trend */}
                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          inst?.trend === 'bullish' ? 'text-emerald-400 bg-emerald-500/10' : inst?.trend === 'bearish' ? 'text-rose-400 bg-rose-500/10' : 'text-slate-400 bg-slate-800'
                        }`}>
                          {inst?.trend || 'neutral'}
                        </span>
                      </td>

                      {/* Signal */}
                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          isBuy ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : isSell ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {sig.direction.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Entry Zone */}
                      <td className="py-3.5 px-3 text-right text-slate-200 tabular-nums">
                        {sig.entryZone}
                      </td>

                      {/* Stop Loss */}
                      <td className="py-3.5 px-3 text-right text-rose-400 font-semibold tabular-nums">
                        ${sig.stopLoss.toLocaleString()}
                      </td>

                      {/* Targets */}
                      <td className="py-3.5 px-3 text-right text-emerald-400 tabular-nums">
                        ${sig.takeProfit1.toLocaleString()} / ${sig.takeProfit2.toLocaleString()}
                      </td>

                      {/* R:R */}
                      <td className="py-3.5 px-3 text-center text-sky-400 font-semibold">
                        {sig.riskRewardRatio}
                      </td>

                      {/* Timeframe */}
                      <td className="py-3.5 px-3 text-center text-slate-400 font-semibold">
                        {sig.timeframe}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          sig.status === 'ACTIVE'
                            ? 'text-sky-400 bg-sky-500/10'
                            : sig.status === 'HIT_TARGET'
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : 'text-slate-500 bg-slate-800'
                        }`}>
                          {sig.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectSignal(sig);
                          }}
                          className="px-2.5 py-1 rounded bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 text-[11px] font-semibold border border-sky-500/30 transition-colors"
                        >
                          View Setup
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
