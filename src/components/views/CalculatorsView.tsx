import React, { useState } from 'react';
import { Calculator, ArrowRightLeft, Percent, Shield, DollarSign, Layers } from 'lucide-react';

export const CalculatorsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'converter' | 'pip' | 'margin' | 'fibonacci' | 'pnl' | 'risk'>('converter');

  // Currency Converter State
  const [convAmount, setConvAmount] = useState<number>(1000);
  const [convFrom, setConvFrom] = useState<string>('USD');
  const [convTo, setConvTo] = useState<string>('EUR');

  // Forex Pip Calculator State
  const [pipPair, setPipPair] = useState<string>('EURUSD');
  const [pipLotSize, setPipLotSize] = useState<number>(1.0); // 1 Standard Lot (100,000 units)
  const [pipAmount, setPipAmount] = useState<number>(10);

  // Margin Calculator State
  const [marginPair, setMarginPair] = useState<string>('EURUSD');
  const [marginUnits, setMarginUnits] = useState<number>(100000); // 1 standard lot
  const [marginLeverage, setMarginLeverage] = useState<number>(100); // 1:100

  // Fibonacci Calculator State
  const [fibHigh, setFibHigh] = useState<number>(95000);
  const [fibLow, setFibLow] = useState<number>(88000);
  const [fibTrend, setFibTrend] = useState<'uptrend' | 'downtrend'>('uptrend');

  // P&L Calculator State
  const [pnlType, setPnlType] = useState<'BUY' | 'SELL'>('BUY');
  const [pnlEntry, setPnlEntry] = useState<number>(93000);
  const [pnlExit, setPnlExit] = useState<number>(95500);
  const [pnlQuantity, setPnlQuantity] = useState<number>(0.5);

  // Position Size & Risk Calculator State
  const [accountBalance, setAccountBalance] = useState<number>(50000);
  const [riskPercent, setRiskPercent] = useState<number>(1.5); // 1.5%
  const [stopLossPips, setStopLossPips] = useState<number>(25); // 25 pips
  const [riskPair, setRiskPair] = useState<string>('EURUSD');

  // FX Rates Matrix approximation
  const fxRates: Record<string, number> = {
    USD: 1.0,
    EUR: 0.922,
    GBP: 0.771,
    JPY: 153.25,
    CHF: 0.887,
    AUD: 1.519,
    CAD: 1.389,
    BTC: 0.0000106,
    ETH: 0.000292
  };

  const convertedValue = (convAmount / (fxRates[convFrom] || 1)) * (fxRates[convTo] || 1);

  // Pip calculation math:
  // For standard lots: 1 pip in EURUSD is $10 per lot
  const pipValuePerPip = pipLotSize * 10;
  const totalPipGain = pipValuePerPip * pipAmount;

  // Margin math: (units * price) / leverage
  const requiredMargin = (marginUnits * 1.0845) / marginLeverage;

  // Fibonacci math:
  const fibDiff = Math.abs(fibHigh - fibLow);
  const fibLevels = fibTrend === 'uptrend' ? {
    r236: fibHigh - 0.236 * fibDiff,
    r382: fibHigh - 0.382 * fibDiff,
    r500: fibHigh - 0.500 * fibDiff,
    r618: fibHigh - 0.618 * fibDiff,
    r786: fibHigh - 0.786 * fibDiff,
    ext1618: fibHigh + 0.618 * fibDiff,
    ext2618: fibHigh + 1.618 * fibDiff,
  } : {
    r236: fibLow + 0.236 * fibDiff,
    r382: fibLow + 0.382 * fibDiff,
    r500: fibLow + 0.500 * fibDiff,
    r618: fibLow + 0.618 * fibDiff,
    r786: fibLow + 0.786 * fibDiff,
    ext1618: fibLow - 0.618 * fibDiff,
    ext2618: fibLow - 1.618 * fibDiff,
  };

  // P&L calculation:
  const pnlResult = pnlType === 'BUY'
    ? (pnlExit - pnlEntry) * pnlQuantity
    : (pnlEntry - pnlExit) * pnlQuantity;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <Calculator className="text-sky-400" size={22} />
          <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
            Investing.com Financial Calculators Suite
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          Live currency converters, exact pip valuations, margin requirements, Fibonacci retracements, and P&L estimates
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#0c1017] rounded-xl border border-slate-800 overflow-x-auto text-xs font-mono">
        {[
          { id: 'converter', label: 'Currency Converter' },
          { id: 'pip', label: 'Pip Calculator' },
          { id: 'margin', label: 'Margin & Leverage' },
          { id: 'fibonacci', label: 'Fibonacci Calculator' },
          { id: 'pnl', label: 'Trade P&L Calculator' },
          { id: 'risk', label: 'Position Size & Risk' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Currency Converter */}
      {activeTab === 'converter' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#0c1017] space-y-6">
          <h2 className="text-sm font-bold text-white font-sans">Live Cross-Currency Converter</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">Amount</label>
              <input
                type="number"
                value={convAmount}
                onChange={(e) => setConvAmount(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm font-bold focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">From Currency</label>
              <select
                value={convFrom}
                onChange={(e) => setConvFrom(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
              >
                {Object.keys(fxRates).map(curr => <option key={curr} value={curr}>{curr}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">To Currency</label>
              <select
                value={convTo}
                onChange={(e) => setConvTo(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
              >
                {Object.keys(fxRates).map(curr => <option key={curr} value={curr}>{curr}</option>)}
              </select>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
            <div>
              <div className="text-xs text-slate-400">{convAmount} {convFrom} =</div>
              <div className="text-3xl font-black text-white tabular-nums tracking-tight">
                {convertedValue.toLocaleString(undefined, { minimumFractionDigits: convTo === 'BTC' ? 6 : 2, maximumFractionDigits: 6 })} {convTo}
              </div>
            </div>
            <div className="text-xs text-slate-500 text-left sm:text-right">
              Rate: 1 {convFrom} = {((1 / (fxRates[convFrom] || 1)) * (fxRates[convTo] || 1)).toFixed(4)} {convTo}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Pip Calculator */}
      {activeTab === 'pip' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#0c1017] space-y-6">
          <h2 className="text-sm font-bold text-white font-sans">Forex Pip Monetary Valuation</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">Currency Pair</label>
              <select
                value={pipPair}
                onChange={(e) => setPipPair(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="EURUSD">EUR/USD</option>
                <option value="GBPUSD">GBP/USD</option>
                <option value="USDJPY">USD/JPY</option>
                <option value="AUDUSD">AUD/USD</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Trade Size (Lots)</label>
              <input
                type="number"
                step="0.1"
                value={pipLotSize}
                onChange={(e) => setPipLotSize(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm font-bold focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Pips Expected</label>
              <input
                type="number"
                value={pipAmount}
                onChange={(e) => setPipAmount(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm font-bold focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Pip Value per Single Pip</span>
              <div className="text-2xl font-black text-sky-400 tabular-nums">
                ${pipValuePerPip.toFixed(2)} USD
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Total P&L at {pipAmount} Pips</span>
              <div className="text-2xl font-black text-emerald-400 tabular-nums">
                ${totalPipGain.toFixed(2)} USD
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Margin & Leverage Calculator */}
      {activeTab === 'margin' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#0c1017] space-y-6">
          <h2 className="text-sm font-bold text-white font-sans">Margin & Leverage Requirement Calculator</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">Instrument Pair</label>
              <select
                value={marginPair}
                onChange={(e) => setMarginPair(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="EURUSD">EUR/USD ($1.0845)</option>
                <option value="GBPUSD">GBP/USD ($1.2980)</option>
                <option value="USDJPY">USD/JPY (153.25)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Contract Units (Units)</label>
              <input
                type="number"
                value={marginUnits}
                onChange={(e) => setMarginUnits(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm font-bold focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Leverage Ratio</label>
              <select
                value={marginLeverage}
                onChange={(e) => setMarginLeverage(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="30">1:30 (Retail Standard)</option>
                <option value="50">1:50</option>
                <option value="100">1:100 (Pro Account)</option>
                <option value="200">1:200</option>
                <option value="500">1:500 (Institutional)</option>
              </select>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 font-mono">
            <span className="text-xs text-slate-400 block mb-1">Required Margin Deposit to Open Position</span>
            <div className="text-3xl font-black text-amber-400 tabular-nums">
              ${requiredMargin.toFixed(2)} USD
            </div>
            <div className="text-[11px] text-slate-500 mt-2">
              Based on nominal trade size of ${(marginUnits * 1.0845).toLocaleString()} with 1:{marginLeverage} leverage.
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Fibonacci Calculator */}
      {activeTab === 'fibonacci' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#0c1017] space-y-6">
          <h2 className="text-sm font-bold text-white font-sans">Fibonacci Retracement & Extension Formulations</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">Swing High ($)</label>
              <input
                type="number"
                value={fibHigh}
                onChange={(e) => setFibHigh(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm font-bold focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Swing Low ($)</label>
              <input
                type="number"
                value={fibLow}
                onChange={(e) => setFibLow(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm font-bold focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Trend Direction</label>
              <select
                value={fibTrend}
                onChange={(e) => setFibTrend(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="uptrend">Uptrend (Pullback Levels)</option>
                <option value="downtrend">Downtrend (Relief Levels)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400">23.6% Retracement</span>
              <div className="text-sm font-bold text-white tabular-nums mt-0.5">${fibLevels.r236.toFixed(2)}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-sky-400 font-bold">38.2% Retracement</span>
              <div className="text-sm font-bold text-white tabular-nums mt-0.5">${fibLevels.r382.toFixed(2)}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-amber-400 font-bold">50.0% Equilibrium</span>
              <div className="text-sm font-bold text-white tabular-nums mt-0.5">${fibLevels.r500.toFixed(2)}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-emerald-400 font-bold">61.8% Golden Ratio</span>
              <div className="text-sm font-bold text-emerald-400 tabular-nums mt-0.5">${fibLevels.r618.toFixed(2)}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-rose-400">78.6% Retracement</span>
              <div className="text-sm font-bold text-white tabular-nums mt-0.5">${fibLevels.r786.toFixed(2)}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-purple-400 font-bold">161.8% Extension TP</span>
              <div className="text-sm font-bold text-purple-300 tabular-nums mt-0.5">${fibLevels.ext1618.toFixed(2)}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 col-span-2">
              <span className="text-[11px] text-purple-400 font-bold">261.8% Macro Target</span>
              <div className="text-sm font-bold text-purple-300 tabular-nums mt-0.5">${fibLevels.ext2618.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Trade P&L Calculator */}
      {activeTab === 'pnl' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#0c1017] space-y-6">
          <h2 className="text-sm font-bold text-white font-sans">Trade Profit & Loss Simulation</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">Direction</label>
              <select
                value={pnlType}
                onChange={(e) => setPnlType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="BUY">BUY / LONG</option>
                <option value="SELL">SELL / SHORT</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Entry Price ($)</label>
              <input
                type="number"
                value={pnlEntry}
                onChange={(e) => setPnlEntry(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Exit Price ($)</label>
              <input
                type="number"
                value={pnlExit}
                onChange={(e) => setPnlExit(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Quantity (Units / Coins)</label>
              <input
                type="number"
                step="0.1"
                value={pnlQuantity}
                onChange={(e) => setPnlQuantity(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 font-mono">
            <span className="text-xs text-slate-400 block mb-1">Net Realized Profit / Loss</span>
            <div className={`text-3xl font-black tabular-nums ${
              pnlResult >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {pnlResult >= 0 ? '+' : ''}${pnlResult.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </div>
            <div className="text-[11px] text-slate-500 mt-2">
              ROI: {(((pnlResult) / (pnlEntry * pnlQuantity)) * 100).toFixed(2)}% on capital allocated.
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Position Size & Risk Calculator */}
      {activeTab === 'risk' && (() => {
        const riskUsd = accountBalance * (riskPercent / 100);
        const pipValPerLot = 10; // standard lot
        const recLots = stopLossPips > 0 ? (riskUsd / (stopLossPips * pipValPerLot)) : 0;
        const miniLots = recLots * 10;
        const microLots = recLots * 100;

        return (
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#0c1017] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white font-sans">Institutional Position Size & Risk Calculator</h2>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  Calculates exact recommended contract lot sizing based on account equity and stop loss parameters
                </p>
              </div>
              <Shield className="text-emerald-400" size={20} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Account Currency & Pair</label>
                <select
                  value={riskPair}
                  onChange={(e) => setRiskPair(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500 font-bold"
                >
                  <option value="EURUSD">EUR/USD</option>
                  <option value="GBPUSD">GBP/USD</option>
                  <option value="USDJPY">USD/JPY</option>
                  <option value="AUDUSD">AUD/USD</option>
                  <option value="USDCAD">USD/CAD</option>
                  <option value="BTCUSD">BTC/USD (Crypto)</option>
                  <option value="XAUUSD">XAU/USD (Gold)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Account Balance ($)</label>
                <input
                  type="number"
                  value={accountBalance}
                  onChange={(e) => setAccountBalance(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Risk Percentage (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Stop Loss Distance (Pips)</label>
                <input
                  type="number"
                  value={stopLossPips}
                  onChange={(e) => setStopLossPips(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500 font-bold"
                />
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Maximum Risk Amount</span>
                <div className="text-2xl font-black text-rose-400">
                  ${riskUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </div>
                <span className="text-[10px] text-slate-500">Fixed risk per trade ({riskPercent}%)</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Recommended Standard Lots</span>
                <div className="text-2xl font-black text-emerald-400">
                  {recLots.toFixed(2)} Lots
                </div>
                <span className="text-[10px] text-slate-500">100,000 units per lot</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Micro / Mini Sizing</span>
                <div className="text-lg font-black text-sky-400">
                  {miniLots.toFixed(1)} Mini / {microLots.toFixed(0)} Micro
                </div>
                <span className="text-[10px] text-slate-500">For retail accounts</span>
              </div>
            </div>

            {/* Projected Returns Matrix (1:1, 1:2, 1:3 R:R) */}
            <div className="p-4 rounded-xl bg-[#090d14] border border-slate-800 space-y-2 text-xs font-mono">
              <span className="text-slate-300 font-bold block">Profit Targets by Risk-to-Reward Ratio:</span>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                  <span className="text-slate-400 text-[11px] block">1:1 Risk / Reward</span>
                  <span className="text-emerald-400 font-bold text-sm">+${riskUsd.toFixed(2)}</span>
                  <span className="text-slate-500 text-[10px] block">+{stopLossPips} Pips</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                  <span className="text-slate-400 text-[11px] block">1:2 Risk / Reward</span>
                  <span className="text-emerald-400 font-bold text-sm">+${(riskUsd * 2).toFixed(2)}</span>
                  <span className="text-slate-500 text-[10px] block">+{stopLossPips * 2} Pips</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                  <span className="text-slate-400 text-[11px] block">1:3 Risk / Reward</span>
                  <span className="text-emerald-400 font-bold text-sm">+${(riskUsd * 3).toFixed(2)}</span>
                  <span className="text-slate-500 text-[10px] block">+{stopLossPips * 3} Pips</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
