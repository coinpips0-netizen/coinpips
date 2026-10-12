import React, { useEffect, useRef, memo } from 'react';

interface Props {
  symbol?: string;
  interval?: string; // 1m, 5m, 15m, 1h, 4h, 1D, 1W, 1M
  height?: number | string;
}

export const TradingViewTechnicalAnalysis: React.FC<Props> = memo(({
  symbol = 'BINANCE:BTCUSDT',
  interval = '1h',
  height = 420
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container__widget';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';
    containerRef.current.appendChild(widgetContainer);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      interval: interval,
      width: '100%',
      isTransparent: true,
      height: '100%',
      symbol: symbol,
      showIntervalTabs: true,
      displayMode: 'single',
      locale: 'en',
      colorTheme: 'dark'
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, interval]);

  return (
    <div className="w-full bg-[#0c1017] rounded-lg border border-slate-800/80 p-2 overflow-hidden" style={{ height: typeof height === 'number' ? `${height}px` : height }}>
      <div ref={containerRef} className="tradingview-widget-container h-full w-full" />
    </div>
  );
});

TradingViewTechnicalAnalysis.displayName = 'TradingViewTechnicalAnalysis';
