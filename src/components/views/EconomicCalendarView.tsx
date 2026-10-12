import React from 'react';
import { CalendarDays, AlertTriangle, ShieldCheck } from 'lucide-react';
import { TradingViewEconomicCalendar } from '../tradingview/TradingViewEconomicCalendar';
import { ECONOMIC_EVENTS } from '../../data/marketData';

export const EconomicCalendarView: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <CalendarDays className="text-amber-400" size={22} />
          <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
            Global Economic Calendar & Macro Releases
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          High-impact macroeconomic catalysts, interest rate decisions, CPI prints, and labor reports
        </p>
      </div>

      {/* High-Impact Today Highlights */}
      <div className="p-4 rounded-xl border border-slate-800 bg-[#0c1017] space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200 font-mono">
          <AlertTriangle size={15} className="text-amber-400" />
          <span>Priority Macro Announcements (High Volatility Risk)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {ECONOMIC_EVENTS.slice(0, 4).map(evt => (
            <div key={evt.id} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs font-mono space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sky-400">{evt.currency}</span>
                <span className="text-[10px] text-slate-400">{evt.time}</span>
              </div>
              <div className="text-white font-semibold truncate">{evt.event}</div>
              <div className="text-[11px] text-slate-400 flex justify-between pt-1 border-t border-slate-800/80">
                <span>Forecast: <strong className="text-slate-200">{evt.forecast}</strong></span>
                <span>Prior: <strong className="text-slate-300">{evt.previous}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live TradingView Calendar Widget */}
      <div className="rounded-xl border border-slate-800 bg-[#0c1017] p-2 overflow-hidden shadow-xl">
        <TradingViewEconomicCalendar height={600} />
      </div>
    </div>
  );
};
