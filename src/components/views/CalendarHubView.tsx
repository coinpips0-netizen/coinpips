import React, { useState } from 'react';
import { CalendarDays, Landmark, DollarSign, Clock, Building, TrendingUp } from 'lucide-react';
import { CENTRAL_BANK_RATES, UPCOMING_EARNINGS, UPCOMING_DIVIDENDS } from '../../data/investingData';

export const CalendarHubView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'central-banks' | 'earnings' | 'dividends'>('central-banks');

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <CalendarDays className="text-amber-400" size={22} />
          <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
            Central Bank Rates, Earnings & Dividend Calendars
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          Investing.com signature policy rate monitors, Wall Street quarterly reporting dates, and ex-dividend schedules
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveTab('central-banks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'central-banks'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Landmark size={14} />
          <span>Central Bank Interest Rates ({CENTRAL_BANK_RATES.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('earnings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'earnings'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building size={14} />
          <span>Earnings Calendar ({UPCOMING_EARNINGS.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dividends')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'dividends'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign size={14} />
          <span>Dividend Calendar ({UPCOMING_DIVIDENDS.length})</span>
        </button>
      </div>

      {/* Tab 1: Central Bank Rates Table */}
      {activeTab === 'central-banks' && (
        <div className="rounded-xl border border-slate-800 bg-[#0c1017] overflow-hidden shadow-xl">
          <div className="px-5 py-3.5 bg-[#090c12] border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              World Central Bank Monetary Policy Rates
            </h3>
            <span className="text-[11px] font-mono text-slate-500">Live Global Benchmark Watch</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-[#090c12]/40 border-b border-slate-800 text-[11px] text-slate-400 uppercase">
                  <th className="py-3 px-4">Central Bank</th>
                  <th className="py-3 px-3">Country / Region</th>
                  <th className="py-3 px-3 text-right">Current Rate</th>
                  <th className="py-3 px-3 text-right">Previous</th>
                  <th className="py-3 px-3 text-center">Bias</th>
                  <th className="py-3 px-3 text-center">Last Adjusted</th>
                  <th className="py-3 px-4 text-right">Next Policy Meeting</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {CENTRAL_BANK_RATES.map((bank, i) => (
                  <tr key={i} className="hover:bg-slate-900/60">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {bank.bank}
                    </td>
                    <td className="py-3.5 px-3 text-slate-300">
                      {bank.country} ({bank.currency})
                    </td>
                    <td className="py-3.5 px-3 text-right font-black text-sky-400 text-sm tabular-nums">
                      {bank.currentRate}
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-400 tabular-nums">
                      {bank.previousRate}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        bank.bias === 'Hawkish' ? 'bg-rose-500/20 text-rose-300' : bank.bias === 'Dovish' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {bank.bias}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-400">
                      {bank.lastChangeDate}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-amber-400">
                      {bank.nextMeetingDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Earnings Calendar */}
      {activeTab === 'earnings' && (
        <div className="rounded-xl border border-slate-800 bg-[#0c1017] overflow-hidden shadow-xl">
          <div className="px-5 py-3.5 bg-[#090c12] border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Upcoming Corporate Earnings Calendar
            </h3>
            <span className="text-[11px] font-mono text-slate-500">Wall Street Consensus Estimates</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-[#090c12]/40 border-b border-slate-800 text-[11px] text-slate-400 uppercase">
                  <th className="py-3 px-4">Company / Ticker</th>
                  <th className="py-3 px-3 text-center">Timing</th>
                  <th className="py-3 px-3 text-right">Report Date</th>
                  <th className="py-3 px-3 text-right">EPS Forecast</th>
                  <th className="py-3 px-3 text-right">Prior EPS</th>
                  <th className="py-3 px-3 text-right">Revenue Est</th>
                  <th className="py-3 px-4 text-right">Market Cap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {UPCOMING_EARNINGS.map((earn, i) => (
                  <tr key={i} className="hover:bg-slate-900/60">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-xs">{earn.ticker}</div>
                      <div className="text-[10px] text-slate-400 font-sans">{earn.company}</div>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-sky-400 font-bold">
                        {earn.timing === 'AMC' ? 'After Close' : 'Before Open'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-300 font-medium">
                      {earn.reportDate}
                    </td>
                    <td className="py-3.5 px-3 text-right font-black text-emerald-400 tabular-nums">
                      {earn.epsForecast}
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-400 tabular-nums">
                      {earn.epsPrior}
                    </td>
                    <td className="py-3.5 px-3 text-right text-white font-bold tabular-nums">
                      {earn.revenueForecast}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400 tabular-nums">
                      {earn.marketCap}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Dividend Calendar */}
      {activeTab === 'dividends' && (
        <div className="rounded-xl border border-slate-800 bg-[#0c1017] overflow-hidden shadow-xl">
          <div className="px-5 py-3.5 bg-[#090c12] border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Ex-Dividend & Yield Distribution Calendar
            </h3>
            <span className="text-[11px] font-mono text-slate-500">Upcoming Shareholder Payouts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-[#090c12]/40 border-b border-slate-800 text-[11px] text-slate-400 uppercase">
                  <th className="py-3 px-4">Company / Ticker</th>
                  <th className="py-3 px-3 text-right">Ex-Dividend Date</th>
                  <th className="py-3 px-3 text-right">Payment Date</th>
                  <th className="py-3 px-3 text-right">Payout per Share</th>
                  <th className="py-3 px-4 text-right font-bold text-emerald-400">Annual Yield</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {UPCOMING_DIVIDENDS.map((div, i) => (
                  <tr key={i} className="hover:bg-slate-900/60">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-xs">{div.ticker}</div>
                      <div className="text-[10px] text-slate-400 font-sans">{div.company}</div>
                    </td>
                    <td className="py-3.5 px-3 text-right text-amber-400 font-medium">
                      {div.exDividendDate}
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-300">
                      {div.paymentDate}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-white tabular-nums">
                      {div.dividendAmount}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-emerald-400 tabular-nums">
                      {div.yieldPercent}
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
