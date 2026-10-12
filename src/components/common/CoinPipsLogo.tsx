import React from 'react';

interface Props {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CoinPipsLogo: React.FC<Props> = ({ className = '', size = 'md' }) => {
  const iconSize = size === 'sm' ? 24 : size === 'lg' ? 36 : 28;
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Dynamic Candlestick & Pip Precision Crest */}
      <div 
        className="relative flex items-center justify-center rounded-lg bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/80 shadow-inner overflow-hidden shrink-0"
        style={{ width: iconSize, height: iconSize }}
      >
        <svg 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1"
        >
          {/* Subtle grid background */}
          <line x1="4" y1="16" x2="28" y2="16" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="2 2" />
          
          {/* Bearish candle wick & body */}
          <line x1="11" y1="6" x2="11" y2="26" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="9" y="11" width="4" height="9" rx="1" fill="#f43f5e" />

          {/* Bullish candle wick & body */}
          <line x1="21" y1="4" x2="21" y2="24" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="19" y="8" width="4" height="11" rx="1" fill="#10b981" />

          {/* Precision pip pulse arrow */}
          <path 
            d="M6 22L15 13L19 17L26 8" 
            stroke="#38bdf8" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <circle cx="26" cy="8" r="2" fill="#38bdf8" />
        </svg>
      </div>

      <div className="flex items-baseline">
        <span className={`font-extrabold tracking-tight text-white font-sans ${textSize}`}>
          COIN<span className="text-sky-400">PIPS</span>
        </span>
        <span className="ml-1.5 text-[9px] font-mono tracking-widest text-slate-400 uppercase hidden sm:inline-block">
          TERMINAL
        </span>
      </div>
    </div>
  );
};
