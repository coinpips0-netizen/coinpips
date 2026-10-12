import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Mail, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Calculator,
  Lock,
  ExternalLink
} from 'lucide-react';
import { Signal } from '../../types/market';
import { TradingViewAdvancedChart } from '../tradingview/TradingViewAdvancedChart';
import { useWatchlist } from '../../context/WatchlistContext';
import { useAuth } from '../../context/AuthContext';
import { SendGmailModal } from './SendGmailModal';

interface Props {
  signal: Signal | null;
  onClose: () => void;
  onOpenVipModal: () => void;
}

export const SignalDetailModal: React.FC<Props> = ({ signal, onClose, onOpenVipModal }) => {
  const { isWatched, toggleWatchlist } = useWatchlist();
  const { isVip } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showGmailModal, setShowGmailModal] = useState(false);

  // Position Sizing Calculator State
  const [accountBalance, setAccountBalance] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<number>(1.0);

  if (!signal) return null;

  const isBuy = signal.direction.includes('BUY');
  const isSell = signal.direction.includes('SELL');
  const isLockedVip = signal.isVip && !isVip;

  const riskAmount = (accountBalance * (riskPercent / 100));
  const stopDistance = Math.abs(signal.entryPrice - signal.stopLoss);
  const calculatedPositionSize = stopDistance > 0 ? (riskAmount / stopDistance) : 0;

  const handleCopy = () => {
    const text = `COINPIPS SIGNAL: ${signal.direction} ${signal.symbol}\nTimeframe: ${signal.timeframe}\nEntry Zone: ${signal.entryZone}\nStop Loss: ${signal.stopLoss}\nTP1: ${signal.takeProfit1}\nTP2: ${signal.takeProfit2}\nTP3: ${signal.takeProfit3}\nRisk/Reward: ${signal.riskRewardRatio}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto">
        <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0b0e14] border border-slate-800 rounded-xl shadow-2xl overflow-hidden text-slate-200">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#090c12] border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono tracking-wide ${
                isBuy
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : isSell
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-slate-700 text-slate-300'
              }`}>
                {signal.direction}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white font-sans">{signal.symbol}</h2>
                  <span className="text-xs text-slate-400">· {signal.name}</span>
                  {signal.isVip && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      VIP EXCLUSIVE
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-mono text-slate-500">
                  Signal ID: {signal.id} · Generated {signal.createdAt}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleWatchlist({ symbol: signal.symbol, name: signal.name, assetClass: signal.assetClass })}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isWatched(signal.symbol)
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
                title={isWatched(signal.symbol) ? "In Watchlist" : "Add to Watchlist"}
              >
                <Star size={16} fill={isWatched(signal.symbol) ? "currentColor" : "none"} />
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Copy signal parameters"
              >
                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>

              <button
                type="button"
                onClick={() => setShowGmailModal(true)}
                className="p-1.5 rounded-lg bg-sky-500/15 border border-sky-500/30 hover:bg-sky-500/25 text-sky-400 transition-colors"
                title="Send Alert to Gmail"
              >
                <Mail size={16} />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {isLockedVip ? (
              <div className="p-8 text-center bg-slate-900/60 rounded-xl border border-amber-500/30 space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Lock size={24} />
                </div>
                <h3 className="text-lg font-bold text-white">VIP Proprietary Signal Locked</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  This signal includes institutional entry points, multi-tiered target liquidity levels, and exact risk management guidance reserved for VIP tier subscribers.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenVipModal();
                  }}
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all shadow-md"
                >
                  Unlock VIP Access Now
                </button>
              </div>
            ) : (
              <>
                {/* Trade Execution Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Entry Zone</span>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">{signal.entryZone}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] font-mono text-rose-400 uppercase">Stop Loss</span>
                    <div className="text-sm font-bold text-rose-400 font-mono mt-0.5">{signal.stopLoss}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase">Take Profit 1</span>
                    <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">{signal.takeProfit1}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase">Take Profit 2</span>
                    <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">{signal.takeProfit2}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase">Take Profit 3</span>
                    <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">{signal.takeProfit3}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] font-mono text-sky-400 uppercase">Risk : Reward</span>
                    <div className="text-sm font-bold text-sky-400 font-mono mt-0.5">{signal.riskRewardRatio}</div>
                  </div>
                </div>

                {/* Technical Indicators Breakdown & Explanation */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Indicators Panel */}
                  <div className="lg:col-span-1 p-4 rounded-lg bg-[#0e131d] border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                      Technical Indicator Metrics
                    </h4>

                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between py-1 border-b border-slate-800/80">
                        <span className="text-slate-400">RSI (14)</span>
                        <span className={signal.indicators.rsi > 60 ? 'text-emerald-400 font-bold' : signal.indicators.rsi < 40 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                          {signal.indicators.rsi}
                        </span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-800/80">
                        <span className="text-slate-400">MACD</span>
                        <span className="text-slate-200 truncate max-w-[150px]">{signal.indicators.macd}</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-800/80">
                        <span className="text-slate-400">EMA Cross</span>
                        <span className="text-slate-200 truncate max-w-[150px]">{signal.indicators.emaCross}</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-800/80">
                        <span className="text-slate-400">SMA 200</span>
                        <span className="text-slate-200 truncate max-w-[150px]">{signal.indicators.sma200}</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-800/80">
                        <span className="text-slate-400">Bollinger</span>
                        <span className="text-slate-200 truncate max-w-[150px]">{signal.indicators.bollinger}</span>
                      </div>

                      <div className="flex justify-between py-1">
                        <span className="text-slate-400">ATR Volatility</span>
                        <span className="text-slate-200 font-bold">{signal.indicators.atr}</span>
                      </div>
                    </div>
                  </div>

                  {/* Signal Rationale & Position Sizing Calculator */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* Rationale */}
                    <div className="p-4 rounded-lg bg-[#0e131d] border border-slate-800">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono mb-2">
                        Institutional Setup Thesis
                      </h4>
                      <p className="text-xs leading-relaxed text-slate-300">
                        {signal.explanation}
                      </p>
                    </div>

                    {/* Risk & Position Sizing Calculator */}
                    <div className="p-4 rounded-lg bg-[#0e131d] border border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-sky-400 font-mono">
                        <Calculator size={14} />
                        <span>Position Size & Risk Calculator</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Account ($)</label>
                          <input
                            type="number"
                            value={accountBalance}
                            onChange={(e) => setAccountBalance(Number(e.target.value) || 0)}
                            className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:border-sky-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Risk %</label>
                          <input
                            type="number"
                            step="0.5"
                            value={riskPercent}
                            onChange={(e) => setRiskPercent(Number(e.target.value) || 0)}
                            className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:border-sky-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Max Risk ($)</label>
                          <div className="px-2.5 py-1.5 rounded bg-slate-900/60 border border-slate-800 text-rose-400 font-mono text-xs font-bold">
                            ${riskAmount.toFixed(2)}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Recommended Units</label>
                          <div className="px-2.5 py-1.5 rounded bg-slate-900/60 border border-slate-800 text-sky-400 font-mono text-xs font-bold">
                            {calculatedPositionSize.toFixed(signal.symbol.includes('USDT') && signal.entryPrice > 500 ? 3 : 2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TradingView Chart */}
                <div className="h-[380px] w-full rounded-lg overflow-hidden border border-slate-800">
                  <TradingViewAdvancedChart
                    symbol={signal.tradingViewSymbol}
                    height="380px"
                    showTimeframeBar={true}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Gmail Dispatch Confirmation Modal */}
      {showGmailModal && (
        <SendGmailModal
          isOpen={showGmailModal}
          onClose={() => setShowGmailModal(false)}
          signal={signal}
        />
      )}
    </>
  );
};
