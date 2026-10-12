import React, { useEffect, useRef, useState, memo } from 'react';

interface Props {
  symbol?: string;
  defaultInterval?: string;
  height?: string | number;
  showTimeframeBar?: boolean;
  onSymbolChange?: (symbol: string) => void;
}

const TIMEFRAMES = [
  { label: '1m', value: '1' },
  { label: '5m', value: '5' },
  { label: '15m', value: '15' },
  { label: '30m', value: '30' },
  { label: '1h', value: '60' },
  { label: '4h', value: '240' },
  { label: '1D', value: 'D' },
  { label: '1W', value: 'W' },
  { label: '1M', value: 'M' },
];

export const TradingViewAdvancedChart: React.FC<Props> = memo(({
  symbol = 'BINANCE:BTCUSDT',
  defaultInterval = '60',
  height = '580px',
  showTimeframeBar = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [interval, setInterval] = useState<string>(defaultInterval);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container__widget';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';
    containerRef.current.appendChild(widgetContainer);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: interval,
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      enable_publishing: false,
      backgroundColor: '#0c1017',
      gridColor: 'rgba(255, 255, 255, 0.05)',
      hide_side_toolbar: false,
      allow_symbol_change: true,
      save_image: true,
      details: true,
      hotlist: true,
      calendar: true,
      support_host: 'https://www.tradingview.com'
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, interval]);

  return (
    <div className="flex flex-col w-full h-full bg-[#0c1017] rounded-lg border border-slate-800/80 overflow-hidden">
      {showTimeframeBar && (
        <div className="flex items-center justify-between px-3 py-2 bg-[#0a0d14] border-b border-slate-800/80 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-mono mr-2">{symbol}</span>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1 ml-1">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf.value}
                  type="button"
                  onClick={() => setInterval(tf.value)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    interval === tf.value
                      ? 'bg-sky-500/20 text-sky-400 font-semibold border border-sky-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <span>LIVE FEED: TRADINGVIEW</span>
          </div>
        </div>
      )}
      <div 
        ref={containerRef} 
        className="tradingview-widget-container flex-1 w-full"
        style={{ minHeight: typeof height === 'number' ? `${height}px` : height }}
      />
    </div>
  );
});

TradingViewAdvancedChart.displayName = 'TradingViewAdvancedChart';
