import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Monitor, Volume2, Save, Check } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [defaultTimeframe, setDefaultTimeframe] = useState('60');
  const [currency, setCurrency] = useState('USD');
  const [audioAlerts, setAudioAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('coinpips_settings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.defaultTimeframe) setDefaultTimeframe(parsed.defaultTimeframe);
        if (parsed.currency) setCurrency(parsed.currency);
        if (parsed.audioAlerts !== undefined) setAudioAlerts(parsed.audioAlerts);
        if (parsed.emailAlerts !== undefined) setEmailAlerts(parsed.emailAlerts);
      } catch {}
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('coinpips_settings', JSON.stringify({
      defaultTimeframe,
      currency,
      audioAlerts,
      emailAlerts
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <SettingsIcon className="text-sky-400" size={22} />
          <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
            Terminal Configuration & Preferences
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          Customize charting defaults, signal alert dispatch parameters, and terminal display density
        </p>
      </div>

      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0c1017] space-y-6 text-xs font-mono">
        {/* Charting Defaults */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
            <Monitor size={16} className="text-sky-400" />
            <span>Charting & Market Display</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1.5">Default Chart Timeframe</label>
              <select
                value={defaultTimeframe}
                onChange={(e) => setDefaultTimeframe(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="1">1 Minute (Scalping)</option>
                <option value="5">5 Minutes</option>
                <option value="15">15 Minutes</option>
                <option value="60">1 Hour (Intraday Default)</option>
                <option value="240">4 Hours (Swing Trend)</option>
                <option value="D">Daily (Macro)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5">Quote Currency Base</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="USD">USD ($) United States Dollar</option>
                <option value="EUR">EUR (€) Euro</option>
                <option value="GBP">GBP (£) British Pound</option>
              </select>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 my-4" />

        {/* Notifications & Sound */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
            <Bell size={16} className="text-amber-400" />
            <span>Signals & Execution Alerts</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-white font-semibold block font-sans">Audio Alert Tone</span>
                <span className="text-[11px] text-slate-400">Play subtle terminal chime on new trade signal generation</span>
              </div>
              <input
                type="checkbox"
                checked={audioAlerts}
                onChange={(e) => setAudioAlerts(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-white font-semibold block font-sans">Gmail Dispatch Integration</span>
                <span className="text-[11px] text-slate-400">Allow 1-click signal dispatch via connected Google account</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0"
              />
            </label>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-4 flex items-center justify-between">
          <span className="text-slate-500 text-[11px]">Settings cached in local terminal profile</span>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold transition-colors shadow-sm"
          >
            {saved ? <Check size={14} /> : <Save size={14} />}
            <span>{saved ? 'Preferences Saved!' : 'Save Preferences'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
