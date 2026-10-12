import React, { useState } from 'react';
import { 
  Sliders, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  HelpCircle, 
  BarChart3, 
  Table as TableIcon,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { INITIAL_INSTRUMENTS } from '../../data/marketData';
import { calculatePivotPoints, getTechnicalIndicatorsTable, getMovingAveragesTable } from '../../data/investingData';
import { Instrument } from '../../types/market';

interface Props {
  liveInstruments?: Instrument[];
}

export const TechnicalSummaryPivotsView: React.FC<Props> = ({ liveInstruments = INITIAL_INSTRUMENTS }) => {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [timeframe, setTimeframe] = useState('Daily');

  const currentInst = liveInstruments.find(i => i.symbol === selectedSymbol) || liveInstruments[0];
  const price = currentInst.price;
  const change24h = currentInst.change24h;
  const high = currentInst.high24h;
  const low = currentInst.low24h;

  const pivots = calculatePivotPoints(high, low, price);
  const indicators = getTechnicalIndicatorsTable(price, change24h);
  const movingAverages = getMovingAveragesTable(price, change24h);

  const buyCount = indicators.filter(i => i.action === 'BUY').length;
  const sellCount = indicators.filter(i => i.action === 'SELL').length;
  const neutralCount = indicators.length - buyCount - sellCount;

  const overallRating = buyCount >= 8 ? 'STRONG BUY' : buyCount >= 6 ? 'BUY' : sellCount >= 6 ? 'STRONG SELL' : sellCount >= 4 ? 'SELL' : 'NEUTRAL';

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title & Instrument Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="text-sky-400" size={22} />
            <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
              Technical Summary & Pivot Points
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Investing.com signature multi-model pivot points, oscillator ratings, and moving average consensus
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
          >
            {liveInstruments.slice(0, 15).map(inst => (
              <option key={inst.symbol} value={inst.symbol}>
                {inst.displaySymbol} ({inst.name})
              </option>
            ))}
          </select>

          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
          >
            <option value="5m">5 Minutes</option>
            <option value="15m">15 Minutes</option>
            <option value="1h">1 Hour</option>
            <option value="4h">4 Hours</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
          </select>
        </div>
      </div>

      {/* Signature Overall Consensus Speedometer Box */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c1017] grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        <div className="space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Selected Asset</span>
          <div className="text-xl font-bold text-white font-mono">{currentInst.displaySymbol}</div>
          <div className="text-xs text-slate-400">{currentInst.name} · {currentInst.exchange}</div>
          <div className="text-lg font-black text-white font-mono tabular-nums mt-1">
            ${price.toLocaleString(undefined, { minimumFractionDigits: price > 100 ? 2 : 4 })}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Technical Indicators</span>
          <div className={`text-base font-black font-mono ${
            buyCount > sellCount ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {buyCount > sellCount ? 'BUY' : 'SELL'}
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            Buy: <strong className="text-emerald-400">{buyCount}</strong> · Sell: <strong className="text-rose-400">{sellCount}</strong> · Neutral: <strong>{neutralCount}</strong>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Moving Averages (12)</span>
          <div className={`text-base font-black font-mono ${
            change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {change24h >= 0 ? 'STRONG BUY' : 'STRONG SELL'}
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            Buy: <strong className="text-emerald-400">{change24h >= 0 ? 12 : 0}</strong> · Sell: <strong className="text-rose-400">{change24h < 0 ? 12 : 0}</strong>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-sky-500/30 text-center space-y-1">
          <span className="text-[10px] font-mono text-sky-400 uppercase font-bold">Summary Consensus</span>
          <div className={`text-lg font-black font-mono ${
            overallRating.includes('BUY') ? 'text-emerald-400' : overallRating.includes('SELL') ? 'text-rose-400' : 'text-slate-300'
          }`}>
            {overallRating}
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            Timeframe: {timeframe}
          </div>
        </div>
      </div>

      {/* Signature Pivot Points Multi-Model Table */}
      <div className="rounded-xl border border-slate-800 bg-[#0c1017] overflow-hidden shadow-xl space-y-1">
        <div className="px-5 py-3.5 bg-[#090c12] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TableIcon size={16} className="text-sky-400" />
            <h3 className="text-sm font-bold text-white font-sans">
              Pivot Points Matrix ({currentInst.displaySymbol} · {timeframe})
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">5 Institutional Formulations</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-[#090c12]/60 border-b border-slate-800 text-[11px] text-slate-400 uppercase">
                <th className="py-3 px-4">Methodology</th>
                <th className="py-3 px-3 text-right">S3</th>
                <th className="py-3 px-3 text-right">S2</th>
                <th className="py-3 px-3 text-right">S1</th>
                <th className="py-3 px-3 text-right font-bold text-sky-400">Pivot Point</th>
                <th className="py-3 px-3 text-right">R1</th>
                <th className="py-3 px-3 text-right">R2</th>
                <th className="py-3 px-4 text-right">R3</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {/* Classic */}
              <tr className="hover:bg-slate-900/60">
                <td className="py-3 px-4 font-bold text-white">Classic</td>
                <td className="py-3 px-3 text-right text-rose-400 tabular-nums">${pivots.classic.s3.toFixed(2)}</td>
                <td className="py-3 px-3 text-right text-rose-400 tabular-nums">${pivots.classic.s2.toFixed(2)}</td>
                <td className="py-3 px-3 text-right text-rose-400 tabular-nums">${pivots.classic.s1.toFixed(2)}</td>
                <td className="py-3 px-3 text-right font-bold text-white tabular-nums">${pivots.classic.pivot.toFixed(2)}</td>
                <td className="py-3 px-3 text-right text-emerald-400 tabular-nums">${pivots.classic.r1.toFixed(2)}</td>
                <td className="py-3 px-3 text-right text-emerald-400 tabular-nums">${pivots.classic.r2.toFixed(2)}</td>
                <td className="py-3 px-4 text-right text-emerald-400 tabular-nums">${pivots.classic.r3.toFixed(2)}</td>
              </tr>

              {/* Fibonacci */}
              <tr className="hover:bg-slate-900/60">
                <td className="py-3 px-4 font-bold text-white">Fibonacci</td>
                <td className="py-3 px-3 text-right text-rose-400 tabular-nums">${pivots.fibonacci.s3.toFixed(2)}</td>
                <td className="py-3 px-3 text-right text-rose-400 tabular-nums">${pivots.fibonacci.s2.toFixed(2)}</td>
                <td className="py-3 px-3 text-right text-rose-400 tabular-nums">${pivots.fibonacci.s1.toFixed(2)}</td>
                <td className="py-3 px-3 text-right font-bold text-white tabular-nums">${pivots.fibonacci.pivot.toFixed(2)}</td>
                <td className="py-3 px-3 text-right text-emerald-400 tabular-nums">${pivots.fibonacci.r1.toFixed(2)}</td>
                <td className="py-3 px-3 text-right text-emerald-400 tabular-nums">${pivots.fibonacci.r2.toFixed(2)}</td>
                <td className="py-3 px-4 text-right text-emerald-400 tabular-nums">${pivots.fibonacci.r3.toFixed(2)}</td>
              </tr>

              {/* Camarilla */}
              <tr className="hover:bg-slate-900/60">
                <td className="py-3 px-4 font-bold text-white">Camarilla</td>
                <td className="py-3 px-3 text-right text-rose-400 tabular-nums">${pivots.camarilla.s3.toFixed(2)}</td>
                <td className="py-3 px-3 text-right text-rose-400 tabular-nums">${pivots.camarilla.s2.toFixed(2)}</td>
                <td className="py-3 px-3 text-right text-rose-400 tabular-nums">${pivots.camarilla.s1.toFixed(2)}</td>
                <td className="py-3 px-3 text-right font-bold text-white tabular-nums">${pivots.camarilla.pivot.toFixed(2)}</td>
                <td className="py-3 px-3 text-right text-emerald-400 tabular-nums">${pivots.camarilla.r1.toFixed(2)}</td>
                <td className="py-3 px-3 text-right text-emerald-400 tabular-nums">${pivots.camarilla.r2.toFixed(2)}</td>
                <td className="py-3 px-4 text-right text-emerald-400 tabular-nums">${pivots.camarilla.r3.toFixed(2)}</td>
              </tr>

              {/* Woodie's */}
              <tr className="hover:bg-slate-900/60">
                <td className="py-3 px-4 font-bold text-white">Woodie's</td>
                <td className="py-3 px-3 text-right text-slate-500">—</td>
                <td className="py-3 px-3 text-right text-rose-400 tabular-nums">${pivots.woodie.s2.toFixed(2)}</td>
                <td className="py-3 px-3 text-right text-rose-400 tabular-nums">${pivots.woodie.s1.toFixed(2)}</td>
                <td className="py-3 px-3 text-right font-bold text-white tabular-nums">${pivots.woodie.pivot.toFixed(2)}</td>
                <td className="py-3 px-3 text-right text-emerald-400 tabular-nums">${pivots.woodie.r1.toFixed(2)}</td>
                <td className="py-3 px-3 text-right text-emerald-400 tabular-nums">${pivots.woodie.r2.toFixed(2)}</td>
                <td className="py-3 px-4 text-right text-slate-500">—</td>
              </tr>

              {/* DeMark's */}
              <tr className="hover:bg-slate-900/60">
                <td className="py-3 px-4 font-bold text-white">DeMark's</td>
                <td className="py-3 px-3 text-right text-slate-500">—</td>
                <td className="py-3 px-3 text-right text-slate-500">—</td>
                <td className="py-3 px-3 text-right text-rose-400 tabular-nums">${pivots.demark.s1.toFixed(2)}</td>
                <td className="py-3 px-3 text-right font-bold text-white tabular-nums">${pivots.demark.pivot.toFixed(2)}</td>
                <td className="py-3 px-3 text-right text-emerald-400 tabular-nums">${pivots.demark.r1.toFixed(2)}</td>
                <td className="py-3 px-3 text-right text-slate-500">—</td>
                <td className="py-3 px-4 text-right text-slate-500">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Technical Indicators & Moving Averages Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technical Indicators Table */}
        <div className="rounded-xl border border-slate-800 bg-[#0c1017] overflow-hidden shadow-xl">
          <div className="px-5 py-3.5 bg-[#090c12] border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Technical Indicators (12 Oscillators)
            </h3>
            <span className="text-[11px] font-mono text-emerald-400">Buy: {buyCount} | Sell: {sellCount}</span>
          </div>

          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-[#090c12]/40 border-b border-slate-800 text-[11px] text-slate-400 uppercase">
                <th className="py-2.5 px-4">Name</th>
                <th className="py-2.5 px-3 text-right">Value</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {indicators.map((ind, i) => (
                <tr key={i} className="hover:bg-slate-900/60">
                  <td className="py-2.5 px-4 font-semibold text-slate-200">{ind.name}</td>
                  <td className="py-2.5 px-3 text-right text-white tabular-nums">{ind.value}</td>
                  <td className="py-2.5 px-4 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ind.action.includes('BUY') ? 'bg-emerald-500/20 text-emerald-400' : ind.action.includes('SELL') ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {ind.action}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Moving Averages Table */}
        <div className="rounded-xl border border-slate-800 bg-[#0c1017] overflow-hidden shadow-xl">
          <div className="px-5 py-3.5 bg-[#090c12] border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Moving Averages (Simple vs Exponential)
            </h3>
            <span className="text-[11px] font-mono text-sky-400">SMA & EMA</span>
          </div>

          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-[#090c12]/40 border-b border-slate-800 text-[11px] text-slate-400 uppercase">
                <th className="py-2.5 px-4">Period</th>
                <th className="py-2.5 px-3 text-right">Simple (SMA)</th>
                <th className="py-2.5 px-3 text-right">Action</th>
                <th className="py-2.5 px-3 text-right">Exp (EMA)</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {movingAverages.map((ma, i) => (
                <tr key={i} className="hover:bg-slate-900/60">
                  <td className="py-2.5 px-4 font-bold text-white">{ma.period}</td>
                  <td className="py-2.5 px-3 text-right text-slate-200 tabular-nums">${ma.sma}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="text-[10px] font-bold text-emerald-400">{ma.smaAction}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-200 tabular-nums">${ma.ema}</td>
                  <td className="py-2.5 px-4 text-right">
                    <span className="text-[10px] font-bold text-emerald-400">{ma.emaAction}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
