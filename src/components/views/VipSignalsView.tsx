import React, { useState } from 'react';
import { 
  Crown, 
  Lock, 
  CheckCircle, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Star, 
  Mail, 
  ArrowRight,
  BarChart3,
  Award
} from 'lucide-react';
import { Signal, Instrument } from '../../types/market';
import { useAuth } from '../../context/AuthContext';
import { useWatchlist } from '../../context/WatchlistContext';

interface Props {
  signals: Signal[];
  onSelectSignal: (signal: Signal) => void;
  onOpenVipModal: () => void;
}

export const VipSignalsView: React.FC<Props> = ({
  signals,
  onSelectSignal,
  onOpenVipModal
}) => {
  const { isVip, upgradeToVip } = useAuth();
  const { isWatched, toggleWatchlist } = useWatchlist();
  const [activeTab, setActiveTab] = useState<'active' | 'history' | 'audit'>('active');

  const vipSignals = signals.filter(s => s.isVip);
  const activeVipSignals = vipSignals.filter(s => s.status === 'ACTIVE');
  const historicalSignals = signals.filter(s => s.status === 'HIT_TARGET' || s.status === 'STOPPED_OUT');

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* VIP Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#131109] via-[#1a170d] to-[#0d1017] border border-amber-500/30 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-amber-500/40 shrink-0 shadow-lg shadow-amber-500/10">
              <img
                src="/src/assets/images/vip_trading_intelligence_1791810344682.jpg"
                alt="VIP Intelligence Crest"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  INSTITUTIONAL TIER
                </span>
                {isVip && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-400 font-bold">
                    ACTIVE VIP MEMBER
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-sans mt-1">
                VIP Alpha Trading Intelligence
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                High-probability asymmetric trade signals across Crypto, Forex, and Equities with multi-target liquidity management.
              </p>
            </div>
          </div>

          {!isVip && (
            <button
              type="button"
              onClick={onOpenVipModal}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 text-xs font-black transition-all shadow-lg shadow-amber-500/20 shrink-0"
            >
              <Crown size={16} />
              <span>Unlock All VIP Setups</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>

        {/* Performance Statistics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-amber-500/20 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[11px]">VIP Win Rate (30D)</span>
            <span className="text-emerald-400 font-black text-lg sm:text-xl tabular-nums">82.4%</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Avg Risk : Reward</span>
            <span className="text-white font-black text-lg sm:text-xl tabular-nums">1 : 3.2</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Pips / Pts Realized</span>
            <span className="text-sky-400 font-black text-lg sm:text-xl tabular-nums">+7,550</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Signals This Week</span>
            <span className="text-amber-400 font-black text-lg sm:text-xl tabular-nums">14 Setups</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-colors ${
            activeTab === 'active'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Active VIP Setups ({activeVipSignals.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-colors ${
            activeTab === 'history'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Performance Track Record
        </button>
      </div>

      {/* Content */}
      {activeTab === 'active' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeVipSignals.map(sig => {
            const isBuy = sig.direction.includes('BUY');
            const isLocked = !isVip;

            return (
              <div
                key={sig.id}
                onClick={() => isLocked ? onOpenVipModal() : onSelectSignal(sig)}
                className={`p-5 rounded-xl border relative cursor-pointer transition-all ${
                  isLocked
                    ? 'bg-slate-900/40 border-amber-500/20 hover:border-amber-500/40'
                    : 'bg-[#0c1017] border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-base text-white font-mono">{sig.symbol}</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {sig.assetClass}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    isBuy ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {sig.direction.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-xs text-slate-400 mb-4">{sig.name} · {sig.timeframe} Chart</div>

                {/* Parameters or Blur */}
                {isLocked ? (
                  <div className="relative py-6 text-center space-y-2">
                    <div className="blur-xs filter select-none opacity-40 font-mono text-xs space-y-1">
                      <div>Entry: $182.50 - $184.00</div>
                      <div>Stop Loss: $172.00</div>
                      <div>Target 1: $198.00 | Target 2: $215.00</div>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-lg">
                      <Lock size={20} className="text-amber-400 mb-1" />
                      <span className="text-xs font-bold text-amber-300">VIP Exclusive Setup</span>
                      <span className="text-[10px] text-slate-400">Click to unlock instant access</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5 text-xs font-mono bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Entry Zone</span>
                      <span className="text-white font-bold">{sig.entryZone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Stop Loss</span>
                      <span className="text-rose-400 font-bold">{sig.stopLoss}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Targets (TP1 / TP2)</span>
                      <span className="text-emerald-400 font-bold">{sig.takeProfit1} / {sig.takeProfit2}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Risk : Reward</span>
                      <span className="text-sky-400 font-bold">{sig.riskRewardRatio}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-500">
                  <span>{sig.createdAt}</span>
                  <span className="text-sky-400 font-medium">Inspect Signal →</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Track Record / History */
        <div className="rounded-xl border border-slate-800 bg-[#0c1017] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-[#090c12] border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Instrument</th>
                  <th className="py-3 px-3">Direction</th>
                  <th className="py-3 px-3 text-right">Entry</th>
                  <th className="py-3 px-3 text-right">Exit / Target Hit</th>
                  <th className="py-3 px-3 text-right">Result (Pips/Pts)</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Date Closed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {historicalSignals.map(h => (
                  <tr key={h.id} className="hover:bg-slate-900/60">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {h.symbol} · <span className="text-slate-400 font-normal">{h.name}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-emerald-400 font-bold">{h.direction}</span>
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-200">
                      ${h.entryPrice.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-right text-emerald-400 font-bold">
                      ${h.takeProfit3.toLocaleString()} (Target {h.hitTargetLevel || 3})
                    </td>
                    <td className="py-3.5 px-3 text-right text-emerald-400 font-extrabold">
                      +{h.pipsGain || 450} pts
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {h.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400">
                      {h.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
