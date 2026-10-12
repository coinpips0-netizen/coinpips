import React, { useState } from 'react';
import { Newspaper, Search, TrendingUp, TrendingDown, ExternalLink, Globe } from 'lucide-react';
import { MARKET_NEWS } from '../../data/marketData';
import { MarketNews, AssetClass } from '../../types/market';

export const MarketNewsView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filtered = MARKET_NEWS.filter(n => {
    const matchesCat = activeCategory === 'all' || n.category === activeCategory;
    const matchesQuery = n.title.toLowerCase().includes(search.toLowerCase()) || n.summary.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <Newspaper className="text-sky-400" size={22} />
          <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
            Financial News & Market Intelligence
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          Curated institutional wire feeds with sentiment tagging across global asset classes
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 rounded-xl bg-[#0c1017] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'crypto', 'forex', 'stock', 'commodities'].map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-md text-xs font-mono capitalize transition-colors ${
                activeCategory === cat
                  ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search headline keyword..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
          />
        </div>
      </div>

      {/* News Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(article => {
          const isBullish = article.sentiment === 'bullish';
          const isBearish = article.sentiment === 'bearish';

          return (
            <div
              key={article.id}
              className="p-5 rounded-xl border border-slate-800 bg-[#0c1017] hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-sky-400 font-bold">{article.source}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">{article.time}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    isBullish ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : isBearish ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {article.sentiment}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white hover:text-sky-300 cursor-pointer leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {article.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span className="uppercase text-slate-400">Desk: {article.category}</span>
                <span className="text-sky-400 flex items-center gap-1 hover:underline cursor-pointer">
                  <span>Full Coverage</span>
                  <ExternalLink size={11} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
