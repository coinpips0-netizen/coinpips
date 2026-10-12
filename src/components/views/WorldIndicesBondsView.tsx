import React, { useState } from 'react';
import { Globe, TrendingUp, TrendingDown, DollarSign, BarChart2, ShieldAlert } from 'lucide-react';
import { SOVEREIGN_BONDS } from '../../data/investingData';
import { INITIAL_INSTRUMENTS } from '../../data/marketData';

export const WorldIndicesBondsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'indices' | 'bonds'>('indices');

  // World Indices dataset
  const AMERICAS_INDICES = [
    { name: 'S&P 500', symbol: 'SPX', price: 5985.40, change: 0.72, changePts: 42.80, high52: 6010.00, low52: 4680.00 },
    { name: 'Nasdaq 100', symbol: 'NDX', price: 21140.20, change: 1.24, changePts: 259.10, high52: 21260.00, low52: 15700.00 },
    { name: 'Dow Jones 30', symbol: 'DJI', price: 43810.50, change: 0.35, changePts: 152.80, high52: 43950.00, low52: 37100.00 },
    { name: 'Russell 2000', symbol: 'RUT', price: 2345.80, change: 1.48, changePts: 34.20, high52: 2360.00, low52: 1890.00 },
    { name: 'TSX Composite (Canada)', symbol: 'TSX', price: 24780.00, change: 0.45, changePts: 111.00, high52: 24900.00, low52: 20200.00 }
  ];

  const EUROPE_INDICES = [
    { name: 'DAX 40 (Germany)', symbol: 'GDAXI', price: 19680.10, change: -0.42, changePts: -83.00, high52: 19820.00, low52: 16300.00 },
    { name: 'FTSE 100 (UK)', symbol: 'FTSE', price: 8254.30, change: 0.28, changePts: 23.10, high52: 8480.00, low52: 7420.00 },
    { name: 'CAC 40 (France)', symbol: 'FCHI', price: 7520.40, change: -0.32, changePts: -24.10, high52: 8250.00, low52: 7150.00 },
    { name: 'Euro Stoxx 50', symbol: 'STOXX50E', price: 4945.20, change: -0.22, changePts: -10.90, high52: 5120.00, low52: 4080.00 },
    { name: 'IBEX 35 (Spain)', symbol: 'IBEX', price: 11840.00, change: 0.65, changePts: 76.40, high52: 11950.00, low52: 9800.00 }
  ];

  const ASIA_INDICES = [
    { name: 'Nikkei 225 (Japan)', symbol: 'N225', price: 39580.00, change: 0.88, changePts: 345.00, high52: 42400.00, low52: 30500.00 },
    { name: 'Hang Seng (Hong Kong)', symbol: 'HSI', price: 20620.50, change: 1.85, changePts: 374.50, high52: 23200.00, low52: 14800.00 },
    { name: 'Shanghai Composite', symbol: 'SSEC', price: 3340.20, change: 0.95, changePts: 31.40, high52: 3670.00, low52: 2680.00 },
    { name: 'ASX 200 (Australia)', symbol: 'AXJO', price: 8280.00, change: 0.42, changePts: 34.60, high52: 8350.00, low52: 6850.00 },
    { name: 'KOSPI (South Korea)', symbol: 'KS11', price: 2610.40, change: 0.15, changePts: 3.90, high52: 2890.00, low52: 2270.00 }
  ];

  // 10Y - 2Y Spread
  const us10Y = SOVEREIGN_BONDS[0].yield;
  const us2Y = SOVEREIGN_BONDS[1].yield;
  const spread10Y2Y = us10Y - us2Y;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <Globe className="text-purple-400" size={22} />
          <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
            World Stock Indices & Sovereign Bond Yields
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          Investing.com signature global benchmark matrix across Americas, Europe, Asia, and Treasury curve yields
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveTab('indices')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'indices'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BarChart2 size={14} />
          <span>Global Stock Indices (15 Benchmarks)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bonds')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'bonds'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign size={14} />
          <span>Sovereign Bond Yields & Yield Curve</span>
        </button>
      </div>

      {activeTab === 'indices' ? (
        <div className="space-y-6">
          {/* Americas */}
          <div className="rounded-xl border border-slate-800 bg-[#0c1017] overflow-hidden shadow-xl">
            <div className="px-5 py-3 bg-[#090c12] border-b border-slate-800 text-xs font-bold font-mono text-white flex items-center justify-between">
              <span>Americas Indices</span>
              <span className="text-[11px] text-slate-500">New York & Toronto Sessions</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-[#090c12]/40 border-b border-slate-800 text-[11px] text-slate-400 uppercase">
                    <th className="py-2.5 px-4">Index</th>
                    <th className="py-2.5 px-3 text-right">Last</th>
                    <th className="py-2.5 px-3 text-right">Net Change</th>
                    <th className="py-2.5 px-3 text-right">% Change</th>
                    <th className="py-2.5 px-3 text-right">52W High</th>
                    <th className="py-2.5 px-4 text-right">52W Low</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {AMERICAS_INDICES.map(idx => (
                    <tr key={idx.symbol} className="hover:bg-slate-900/60">
                      <td className="py-3 px-4 font-bold text-white">{idx.name} ({idx.symbol})</td>
                      <td className="py-3 px-3 text-right text-white font-bold tabular-nums">${idx.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className={`py-3 px-3 text-right font-semibold tabular-nums ${idx.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {idx.changePts > 0 ? '+' : ''}{idx.changePts.toFixed(2)}
                      </td>
                      <td className={`py-3 px-3 text-right font-bold tabular-nums ${idx.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {idx.change > 0 ? '+' : ''}{idx.change}%
                      </td>
                      <td className="py-3 px-3 text-right text-slate-400 tabular-nums">${idx.high52.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-slate-400 tabular-nums">${idx.low52.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Europe */}
          <div className="rounded-xl border border-slate-800 bg-[#0c1017] overflow-hidden shadow-xl">
            <div className="px-5 py-3 bg-[#090c12] border-b border-slate-800 text-xs font-bold font-mono text-white flex items-center justify-between">
              <span>European Indices</span>
              <span className="text-[11px] text-slate-500">London, Frankfurt & Paris Sessions</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-[#090c12]/40 border-b border-slate-800 text-[11px] text-slate-400 uppercase">
                    <th className="py-2.5 px-4">Index</th>
                    <th className="py-2.5 px-3 text-right">Last</th>
                    <th className="py-2.5 px-3 text-right">Net Change</th>
                    <th className="py-2.5 px-3 text-right">% Change</th>
                    <th className="py-2.5 px-3 text-right">52W High</th>
                    <th className="py-2.5 px-4 text-right">52W Low</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {EUROPE_INDICES.map(idx => (
                    <tr key={idx.symbol} className="hover:bg-slate-900/60">
                      <td className="py-3 px-4 font-bold text-white">{idx.name} ({idx.symbol})</td>
                      <td className="py-3 px-3 text-right text-white font-bold tabular-nums">${idx.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className={`py-3 px-3 text-right font-semibold tabular-nums ${idx.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {idx.changePts > 0 ? '+' : ''}{idx.changePts.toFixed(2)}
                      </td>
                      <td className={`py-3 px-3 text-right font-bold tabular-nums ${idx.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {idx.change > 0 ? '+' : ''}{idx.change}%
                      </td>
                      <td className="py-3 px-3 text-right text-slate-400 tabular-nums">${idx.high52.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-slate-400 tabular-nums">${idx.low52.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Asia-Pacific */}
          <div className="rounded-xl border border-slate-800 bg-[#0c1017] overflow-hidden shadow-xl">
            <div className="px-5 py-3 bg-[#090c12] border-b border-slate-800 text-xs font-bold font-mono text-white flex items-center justify-between">
              <span>Asia-Pacific Indices</span>
              <span className="text-[11px] text-slate-500">Tokyo, Hong Kong & Sydney Sessions</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-[#090c12]/40 border-b border-slate-800 text-[11px] text-slate-400 uppercase">
                    <th className="py-2.5 px-4">Index</th>
                    <th className="py-2.5 px-3 text-right">Last</th>
                    <th className="py-2.5 px-3 text-right">Net Change</th>
                    <th className="py-2.5 px-3 text-right">% Change</th>
                    <th className="py-2.5 px-3 text-right">52W High</th>
                    <th className="py-2.5 px-4 text-right">52W Low</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {ASIA_INDICES.map(idx => (
                    <tr key={idx.symbol} className="hover:bg-slate-900/60">
                      <td className="py-3 px-4 font-bold text-white">{idx.name} ({idx.symbol})</td>
                      <td className="py-3 px-3 text-right text-white font-bold tabular-nums">${idx.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className={`py-3 px-3 text-right font-semibold tabular-nums ${idx.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {idx.changePts > 0 ? '+' : ''}{idx.changePts.toFixed(2)}
                      </td>
                      <td className={`py-3 px-3 text-right font-bold tabular-nums ${idx.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {idx.change > 0 ? '+' : ''}{idx.change}%
                      </td>
                      <td className="py-3 px-3 text-right text-slate-400 tabular-nums">${idx.high52.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-slate-400 tabular-nums">${idx.low52.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Sovereign Bond Yields & Yield Curve */
        <div className="space-y-6">
          {/* Yield Curve Inversion Monitor Strip */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c1017] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] uppercase">U.S. Yield Curve Spread (10Y - 2Y)</span>
              <div className="text-2xl font-black text-white tabular-nums mt-0.5">
                {spread10Y2Y >= 0 ? '+' : ''}{(spread10Y2Y * 100).toFixed(1)} bps ({spread10Y2Y.toFixed(3)}%)
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {spread10Y2Y >= 0 ? 'Normal positive slope (Economic expansion)' : 'Inverted yield curve (Recession indicator)'}
              </div>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div>
                <span className="text-slate-500 block text-[10px]">10-YEAR</span>
                <span className="text-white font-bold text-base">{us10Y}%</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">2-YEAR</span>
                <span className="text-white font-bold text-base">{us2Y}%</span>
              </div>
            </div>
          </div>

          {/* Sovereign Debt Table */}
          <div className="rounded-xl border border-slate-800 bg-[#0c1017] overflow-hidden shadow-xl">
            <div className="px-5 py-3.5 bg-[#090c12] border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Government Bond Yields
              </h3>
              <span className="text-[11px] font-mono text-slate-500">Benchmark Sovereign Debt</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-[#090c12]/40 border-b border-slate-800 text-[11px] text-slate-400 uppercase">
                    <th className="py-3 px-4">Bond Issue</th>
                    <th className="py-3 px-3">Country</th>
                    <th className="py-3 px-3 text-right">Yield (%)</th>
                    <th className="py-3 px-3 text-right">Change (bps)</th>
                    <th className="py-3 px-3 text-right">Day High</th>
                    <th className="py-3 px-3 text-right">Day Low</th>
                    <th className="py-3 px-4 text-right">Maturity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {SOVEREIGN_BONDS.map((bond, i) => (
                    <tr key={i} className="hover:bg-slate-900/60">
                      <td className="py-3.5 px-4 font-bold text-white">{bond.bond}</td>
                      <td className="py-3.5 px-3 text-slate-300">{bond.country}</td>
                      <td className="py-3.5 px-3 text-right font-black text-sky-400 text-sm tabular-nums">{bond.yield.toFixed(3)}%</td>
                      <td className={`py-3.5 px-3 text-right font-bold tabular-nums ${bond.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {bond.change >= 0 ? '+' : ''}{(bond.change * 100).toFixed(1)}
                      </td>
                      <td className="py-3.5 px-3 text-right text-slate-400 tabular-nums">{bond.high.toFixed(3)}%</td>
                      <td className="py-3.5 px-3 text-right text-slate-400 tabular-nums">{bond.low.toFixed(3)}%</td>
                      <td className="py-3.5 px-4 text-right text-slate-400">{bond.maturity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
