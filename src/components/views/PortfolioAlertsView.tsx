import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Bell, 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  Mail,
  Zap,
  Percent
} from 'lucide-react';
import { INITIAL_INSTRUMENTS } from '../../data/marketData';
import { PriceAlert, PortfolioPosition } from '../../data/investingData';
import { Instrument } from '../../types/market';
import { useAuth } from '../../context/AuthContext';
import { sendGmailSignalAlert, getCachedGmailToken } from '../../services/gmailService';

interface Props {
  liveInstruments?: Instrument[];
}

const INITIAL_POSITIONS: PortfolioPosition[] = [
  { id: 'pos-1', symbol: 'BTCUSDT', name: 'Bitcoin', type: 'BUY', entryPrice: 91200, quantity: 0.5, assetClass: 'crypto', timestamp: '2026-10-10' },
  { id: 'pos-2', symbol: 'EURUSD', name: 'Euro / US Dollar', type: 'SELL', entryPrice: 1.0910, quantity: 50000, assetClass: 'forex', timestamp: '2026-10-11' },
  { id: 'pos-3', symbol: 'XAUUSD', name: 'Gold Spot', type: 'BUY', entryPrice: 2715.0, quantity: 10, assetClass: 'commodities', timestamp: '2026-10-09' },
  { id: 'pos-4', symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'BUY', entryPrice: 138.50, quantity: 40, assetClass: 'stock', timestamp: '2026-10-08' }
];

const INITIAL_ALERTS: PriceAlert[] = [
  { id: 'alt-1', symbol: 'BTCUSDT', name: 'Bitcoin', targetPrice: 95000, condition: 'ABOVE', createdAt: '2026-10-11', triggered: false, sendEmail: true },
  { id: 'alt-2', symbol: 'EURUSD', name: 'Euro / US Dollar', targetPrice: 1.0800, condition: 'BELOW', createdAt: '2026-10-11', triggered: false, sendEmail: true },
  { id: 'alt-3', symbol: 'XAUUSD', name: 'Gold Spot', targetPrice: 2780, condition: 'ABOVE', createdAt: '2026-10-10', triggered: true, sendEmail: false }
];

export const PortfolioAlertsView: React.FC<Props> = ({ liveInstruments = INITIAL_INSTRUMENTS }) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'alerts'>('portfolio');

  // Portfolio State
  const [cashBalance, setCashBalance] = useState<number>(45000);
  const [positions, setPositions] = useState<PortfolioPosition[]>(INITIAL_POSITIONS);
  const [showNewPositionModal, setShowNewPositionModal] = useState(false);
  const [newPosSymbol, setNewPosSymbol] = useState('BTCUSDT');
  const [newPosType, setNewPosType] = useState<'BUY' | 'SELL'>('BUY');
  const [newPosQty, setNewPosQty] = useState<number>(0.1);

  // Alerts State
  const [alerts, setAlerts] = useState<PriceAlert[]>(INITIAL_ALERTS);
  const [showNewAlertModal, setShowNewAlertModal] = useState(false);
  const [newAlertSymbol, setNewAlertSymbol] = useState('BTCUSDT');
  const [newAlertPrice, setNewAlertPrice] = useState<number>(96000);
  const [newAlertCondition, setNewAlertCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  const [newAlertSendEmail, setNewAlertSendEmail] = useState(true);

  // Helper to find live price
  const getLivePrice = (sym: string): number => {
    const inst = liveInstruments.find(i => i.symbol === sym);
    return inst ? inst.price : 100;
  };

  // Evaluate alerts against live prices
  useEffect(() => {
    alerts.forEach(alert => {
      if (alert.triggered) return;
      const current = getLivePrice(alert.symbol);
      const isTriggered = alert.condition === 'ABOVE' ? current >= alert.targetPrice : current <= alert.targetPrice;

      if (isTriggered) {
        setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, triggered: true } : a));
      }
    });
  }, [liveInstruments]);

  // Calculate portfolio totals
  let totalPositionValue = 0;
  let totalUnrealizedPnl = 0;

  positions.forEach(pos => {
    const curPrice = getLivePrice(pos.symbol);
    const value = pos.quantity * curPrice;
    totalPositionValue += value;

    const diff = pos.type === 'BUY'
      ? (curPrice - pos.entryPrice) * pos.quantity
      : (pos.entryPrice - curPrice) * pos.quantity;
    totalUnrealizedPnl += diff;
  });

  const totalPortfolioValue = cashBalance + totalPositionValue;
  const portfolioReturnPct = ((totalUnrealizedPnl / 100000) * 100);

  // Add position handler
  const handleAddPosition = (e: React.FormEvent) => {
    e.preventDefault();
    const inst = liveInstruments.find(i => i.symbol === newPosSymbol) || liveInstruments[0];
    const newPos: PortfolioPosition = {
      id: `pos-${Date.now()}`,
      symbol: inst.symbol,
      name: inst.name,
      type: newPosType,
      entryPrice: inst.price,
      quantity: newPosQty,
      assetClass: inst.assetClass,
      timestamp: new Date().toISOString().split('T')[0]
    };
    setPositions([newPos, ...positions]);
    setShowNewPositionModal(false);
  };

  // Close position handler
  const handleClosePosition = (posId: string) => {
    const pos = positions.find(p => p.id === posId);
    if (!pos) return;
    const curPrice = getLivePrice(pos.symbol);
    const proceeds = pos.quantity * curPrice;
    setCashBalance(prev => prev + proceeds);
    setPositions(positions.filter(p => p.id !== posId));
  };

  // Add alert handler
  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const inst = liveInstruments.find(i => i.symbol === newAlertSymbol) || liveInstruments[0];
    const newAlert: PriceAlert = {
      id: `alt-${Date.now()}`,
      symbol: inst.symbol,
      name: inst.name,
      targetPrice: newAlertPrice,
      condition: newAlertCondition,
      createdAt: new Date().toISOString().split('T')[0],
      triggered: false,
      sendEmail: newAlertSendEmail
    };
    setAlerts([newAlert, ...alerts]);
    setShowNewAlertModal(false);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="text-sky-400" size={22} />
            <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
              Virtual Portfolio & Real-Time Price Alerts
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Investing.com institutional paper-trading portfolio tracker and automated price boundary alerts
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0c1017] rounded-xl border border-slate-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'portfolio'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase size={14} />
            <span>Virtual Portfolio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'alerts'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bell size={14} />
            <span>Price Alerts ({alerts.filter(a => !a.triggered).length} Active)</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Virtual Portfolio */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          {/* Portfolio Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#0c1017] border border-slate-800 space-y-1 font-mono">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">Total Portfolio Equity</span>
              <div className="text-2xl font-extrabold text-white">
                ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] text-slate-500">Includes cash & open holdings</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0c1017] border border-slate-800 space-y-1 font-mono">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">Unrealized P&L ($)</span>
              <div className={`text-2xl font-extrabold flex items-center gap-1 ${
                totalUnrealizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {totalUnrealizedPnl >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                <span>{totalUnrealizedPnl >= 0 ? '+' : ''}${totalUnrealizedPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <span className={`text-[10px] ${totalUnrealizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {portfolioReturnPct >= 0 ? '+' : ''}{portfolioReturnPct.toFixed(2)}% on account
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#0c1017] border border-slate-800 space-y-1 font-mono">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">Available Cash</span>
              <div className="text-2xl font-extrabold text-slate-200">
                ${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] text-slate-500">Uncommitted margin</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0c1017] border border-slate-800 space-y-1 font-mono">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">Active Holdings</span>
              <div className="text-2xl font-extrabold text-sky-400">
                {positions.length} Positions
              </div>
              <button
                type="button"
                onClick={() => setShowNewPositionModal(true)}
                className="text-[11px] text-sky-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <Plus size={12} /> Add New Position
              </button>
            </div>
          </div>

          {/* Holdings Table */}
          <div className="rounded-2xl border border-slate-800 bg-[#0c1017] overflow-hidden">
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white font-sans">Open Market Positions</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                  Real-Time Synced
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowNewPositionModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-400 hover:bg-sky-300 text-slate-950 text-xs font-mono font-bold transition-colors"
              >
                <Plus size={13} />
                <span>Simulate Trade</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left">
                <thead className="bg-[#090d14] text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Asset</th>
                    <th className="px-4 py-3">Side</th>
                    <th className="px-4 py-3 text-right">Units</th>
                    <th className="px-4 py-3 text-right">Entry Price</th>
                    <th className="px-4 py-3 text-right">Current Price</th>
                    <th className="px-4 py-3 text-right">Market Value</th>
                    <th className="px-4 py-3 text-right">Unrealized P&L</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {positions.map(pos => {
                    const curPrice = getLivePrice(pos.symbol);
                    const marketVal = pos.quantity * curPrice;
                    const pnl = pos.type === 'BUY'
                      ? (curPrice - pos.entryPrice) * pos.quantity
                      : (pos.entryPrice - curPrice) * pos.quantity;
                    const pnlPct = ((pnl / (pos.quantity * pos.entryPrice)) * 100);
                    const isProfit = pnl >= 0;

                    return (
                      <tr key={pos.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-bold text-white">{pos.symbol}</div>
                          <div className="text-[11px] text-slate-500">{pos.name}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            pos.type === 'BUY'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {pos.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-200">
                          {pos.quantity}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-400">
                          ${pos.entryPrice.toLocaleString(undefined, { minimumFractionDigits: pos.entryPrice > 100 ? 2 : 4 })}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-white">
                          ${curPrice.toLocaleString(undefined, { minimumFractionDigits: curPrice > 100 ? 2 : 4 })}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-300">
                          ${marketVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className={`px-4 py-3 text-right font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                          <div>{isProfit ? '+' : ''}${pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                          <div className="text-[10px]">({isProfit ? '+' : ''}{pnlPct.toFixed(2)}%)</div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleClosePosition(pos.id)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 text-slate-300 text-[11px] transition-colors"
                          >
                            Close
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
      )}

      {/* Tab 2: Price Alerts */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-[#0c1017] p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-amber-400" />
                <h2 className="text-sm font-bold text-white font-sans">Active Price Level Watchdogs</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowNewAlertModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-mono font-bold transition-colors"
              >
                <Plus size={13} />
                <span>Create New Alert</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {alerts.map(alert => {
                const curPrice = getLivePrice(alert.symbol);
                const isTriggered = alert.triggered;

                return (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-xl border font-mono space-y-3 transition-colors ${
                      isTriggered
                        ? 'bg-rose-500/5 border-rose-500/30'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white text-sm">{alert.symbol}</span>
                        <div className="text-[11px] text-slate-500">{alert.name}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isTriggered
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {isTriggered ? 'TRIGGERED' : 'ACTIVE'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Target Trigger:</span>
                        <span className="text-amber-400 font-bold">
                          {alert.condition === 'ABOVE' ? '≥' : '≤'} ${alert.targetPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Current Price:</span>
                        <span className="text-white font-bold">${curPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1">
                        {alert.sendEmail && <Mail size={12} className="text-sky-400" />}
                        <span>{alert.sendEmail ? 'Gmail Alerts Enabled' : 'Terminal Alert'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAlerts(alerts.filter(a => a.id !== alert.id))}
                        className="text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Position */}
      {showNewPositionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0c1017] border border-slate-800 text-xs font-mono space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white font-sans">Simulate New Market Position</h3>
            <form onSubmit={handleAddPosition} className="space-y-4">
              <div>
                <label className="text-slate-400 block mb-1">Select Instrument</label>
                <select
                  value={newPosSymbol}
                  onChange={(e) => setNewPosSymbol(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-bold focus:outline-none focus:border-sky-500"
                >
                  {liveInstruments.map(i => (
                    <option key={i.symbol} value={i.symbol}>
                      {i.displaySymbol} - ${i.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Direction</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewPosType('BUY')}
                    className={`py-2 rounded-lg font-bold ${
                      newPosType === 'BUY'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-900 text-emerald-400 border border-slate-800'
                    }`}
                  >
                    LONG / BUY
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPosType('SELL')}
                    className={`py-2 rounded-lg font-bold ${
                      newPosType === 'SELL'
                        ? 'bg-rose-500 text-slate-950'
                        : 'bg-slate-900 text-rose-400 border border-slate-800'
                    }`}
                  >
                    SHORT / SELL
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Position Units / Lot</label>
                <input
                  type="number"
                  step="any"
                  value={newPosQty}
                  onChange={(e) => setNewPosQty(Number(e.target.value) || 0.1)}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-bold focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPositionModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-400 text-slate-950 font-bold hover:bg-sky-300 transition-colors"
                >
                  Execute Simulated Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Alert */}
      {showNewAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0c1017] border border-slate-800 text-xs font-mono space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white font-sans">Set Price Threshold Alert</h3>
            <form onSubmit={handleAddAlert} className="space-y-4">
              <div>
                <label className="text-slate-400 block mb-1">Instrument</label>
                <select
                  value={newAlertSymbol}
                  onChange={(e) => setNewAlertSymbol(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-bold focus:outline-none focus:border-sky-500"
                >
                  {liveInstruments.map(i => (
                    <option key={i.symbol} value={i.symbol}>
                      {i.displaySymbol} - ${i.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Trigger Condition</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewAlertCondition('ABOVE')}
                    className={`py-2 rounded-lg font-bold ${
                      newAlertCondition === 'ABOVE'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-900 text-amber-400 border border-slate-800'
                    }`}
                  >
                    Price Rises Above (≥)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewAlertCondition('BELOW')}
                    className={`py-2 rounded-lg font-bold ${
                      newAlertCondition === 'BELOW'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-900 text-amber-400 border border-slate-800'
                    }`}
                  >
                    Price Falls Below (≤)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Target Price ($)</label>
                <input
                  type="number"
                  step="any"
                  value={newAlertPrice}
                  onChange={(e) => setNewAlertPrice(Number(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-bold focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="emailAlertCheck"
                  checked={newAlertSendEmail}
                  onChange={(e) => setNewAlertSendEmail(e.target.checked)}
                  className="rounded border-slate-700 text-sky-500 focus:ring-0"
                />
                <label htmlFor="emailAlertCheck" className="text-slate-300 cursor-pointer">
                  Send Instant Dispatch via Gmail
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewAlertModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 transition-colors"
                >
                  Activate Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
