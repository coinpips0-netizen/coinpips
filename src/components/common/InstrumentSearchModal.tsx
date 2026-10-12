import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, TrendingDown, Star, ArrowRight, CornerDownLeft } from 'lucide-react';
import { Instrument, AssetClass } from '../../types/market';
import { INITIAL_INSTRUMENTS } from '../../data/marketData';
import { useWatchlist } from '../../context/WatchlistContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectInstrument: (instrument: Instrument) => void;
}

export const InstrumentSearchModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectInstrument
}) => {
  const [query, setQuery] = useState('');
  const [selectedAssetClass, setSelectedAssetClass] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isWatched, toggleWatchlist } = useWatchlist();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = INITIAL_INSTRUMENTS.filter(inst => {
    const matchesQuery = 
      inst.symbol.toLowerCase().includes(query.toLowerCase()) ||
      inst.displaySymbol.toLowerCase().includes(query.toLowerCase()) ||
      inst.name.toLowerCase().includes(query.toLowerCase()) ||
      inst.exchange.toLowerCase().includes(query.toLowerCase());
    
    const matchesClass = selectedAssetClass === 'all' || inst.assetClass === selectedAssetClass;
    return matchesQuery && matchesClass;
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        onSelectInstrument(filtered[selectedIndex]);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const ASSET_TABS = [
    { id: 'all', label: 'All Assets' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'forex', label: 'Forex' },
    { id: 'stock', label: 'Stocks' },
    { id: 'indices', label: 'Indices' },
    { id: 'commodities', label: 'Commodities' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-[#0c1017] border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col text-slate-200 max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 bg-[#0a0d14] border-b border-slate-800 shrink-0">
          <Search size={18} className="text-slate-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search symbol, currency pair, stock, or index (e.g. BTC, EURUSD, AAPL)..."
            className="flex-1 bg-transparent border-none text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white mr-2"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-1 rounded text-xs font-mono bg-slate-800 text-slate-400 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-[#090c12] border-b border-slate-800/80 overflow-x-auto shrink-0">
          {ASSET_TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setSelectedAssetClass(tab.id);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                selectedAssetClass === tab.id
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No matching instruments found for "{query}". Check spelling or try a different asset class.
            </div>
          ) : (
            filtered.map((inst, index) => {
              const isSelected = index === selectedIndex;
              const isBullish = inst.change24h >= 0;
              return (
                <div
                  key={inst.symbol}
                  onClick={() => {
                    onSelectInstrument(inst);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-slate-800/90 border border-slate-700/80'
                      : 'hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchlist({ symbol: inst.symbol, name: inst.name, assetClass: inst.assetClass });
                      }}
                      className="text-slate-500 hover:text-amber-400"
                    >
                      <Star size={14} fill={isWatched(inst.symbol) ? "currentColor" : "none"} className={isWatched(inst.symbol) ? "text-amber-400" : ""} />
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white font-mono">{inst.displaySymbol}</span>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {inst.assetClass}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1.5">
                        <span>{inst.name}</span>
                        <span>·</span>
                        <span className="font-mono text-slate-500">{inst.exchange}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-sm font-bold text-white font-mono tabular-nums">
                        ${inst.price.toLocaleString(undefined, { minimumFractionDigits: inst.price > 100 ? 2 : 4 })}
                      </div>
                      <div className={`text-xs font-mono flex items-center justify-end gap-1 ${
                        isBullish ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {isBullish ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        <span>{isBullish ? '+' : ''}{inst.change24h}%</span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="hidden sm:flex items-center text-sky-400">
                        <CornerDownLeft size={14} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-[#0a0d14] border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono shrink-0">
          <span>Navigate with ↑ ↓ and Press Enter to load chart</span>
          <span>{filtered.length} Instruments Indexed</span>
        </div>
      </div>
    </div>
  );
};
