import React, { useEffect, useRef, memo } from 'react';

interface Props {
  height?: number | string;
  defaultScreen?: 'general' | 'most_capitalized' | 'volume_leaders' | 'top_gainers' | 'top_losers';
}

export const TradingViewStockScreener: React.FC<Props> = memo(({ height = 560, defaultScreen = 'general' }) => {
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
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: '100%',
      height: '100%',
      defaultColumn: 'overview',
      defaultScreen: defaultScreen,
      market: 'america',
      showToolbar: true,
      colorTheme: 'dark',
      locale: 'en',
      isTransparent: true
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [defaultScreen]);

  return (
    <div className="w-full bg-[#0c1017] rounded-lg border border-slate-800/80 p-2 overflow-hidden" style={{ height: typeof height === 'number' ? `${height}px` : height }}>
      <div ref={containerRef} className="tradingview-widget-container h-full w-full" />
    </div>
  );
});

TradingViewStockScreener.displayName = 'TradingViewStockScreener';
