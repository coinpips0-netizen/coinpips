import React, { useState } from 'react';
import { Activity, Sliders, TrendingUp, TrendingDown, Layers, HelpCircle } from 'lucide-react';
import { TradingViewTechnicalAnalysis } from '../tradingview/TradingViewTechnicalAnalysis';
import { TradingViewMarketOverview } from '../tradingview/TradingViewMarketOverview';
import { INITIAL_INSTRUMENTS } from '../../data/marketData';

export const TechnicalAnalysisView: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('BINANCE:BTCUSDT');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');

  const INSTRUMENT_OPTIONS = [
    { label: 'BTC/USDT (Bitcoin)', symbol: 'BINANCE:BTCUSDT' },
    { label: 'ETH/USDT (Ethereum)', symbol: 'BINANCE:ETHUSDT' },
    { label: 'SOL/USDT (Solana)', symbol: 'BINANCE:SOLUSDT' },
    { label: 'EUR/USD (Euro)', symbol: 'FX:EURUSD' },
    { label: 'GBP/USD (Pound)', symbol: 'FX:GBPUSD' },
    { label: 'USD/JPY (Yen)', symbol: 'FX:USDJPY' },
    { label: 'AAPL (Apple)', symbol: 'NASDAQ:AAPL' },
    { label: 'NVDA (NVIDIA)', symbol: 'NASDAQ:NVDA' },
    { label: 'S&P 500 Index', symbol: 'FOREXCOM:SPXUSD' },
    { label: 'Gold (Ounce)', symbol: 'TVC:GOLD' },
    { label: 'WTI Crude Oil', symbol: 'TVC:USOIL' }
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="text-sky-400" size={22} />
            <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
              Technical Analysis Intelligence
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Oscillators, Moving Averages, and Multi-Indicator gauges powered by TradingView
          </p>
        </div>

        {/* Instrument Switcher */}
        <div className="flex items-center gap-2">
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
          >
            {INSTRUMENT_OPTIONS.map(opt => (
              <option key={opt.symbol} value={opt.symbol}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Technical Analysis Gauges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 rounded-xl border border-slate-800 bg-[#0c1017] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Technical Summary Speedometer
            </h3>
            <span className="text-[11px] font-mono text-sky-400">{selectedSymbol}</span>
          </div>
          <TradingViewTechnicalAnalysis
            symbol={selectedSymbol}
            interval={selectedTimeframe}
            height={440}
          />
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-[#0c1017] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Cross-Market Overview
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Multi-Asset Correlation</span>
          </div>
          <TradingViewMarketOverview height={440} />
        </div>
      </div>

      {/* Indicator Education & Methodology */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-4">
        <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
          <Layers size={14} className="text-sky-400" />
          <span>Core Indicator Mechanics in COINPIPS Engine</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-[#0c1017] border border-slate-800/80 space-y-1.5">
            <span className="font-bold text-white">Relative Strength Index (RSI - 14)</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Measures velocity and magnitude of directional price movements. Values below 30 denote oversold conditions ripe for mean-reversion; values above 70 indicate overbought exhaustion.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0c1017] border border-slate-800/80 space-y-1.5">
            <span className="font-bold text-white">Moving Average Convergence Divergence (MACD)</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Standard 12, 26, 9 EMA settings. Crossovers occurring outside the zero line indicate accelerating momentum in the direction of the dominant trend.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0c1017] border border-slate-800/80 space-y-1.5">
            <span className="font-bold text-white">Average True Range (ATR - 14)</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Used for exact stop-loss placement and volatility-adjusted position sizing, protecting traders from abnormal market noise and sudden spread spikes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
