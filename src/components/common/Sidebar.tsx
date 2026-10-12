import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Coins, 
  ArrowRightLeft, 
  TrendingUp, 
  BarChart3, 
  Gem, 
  Activity, 
  CandlestickChart, 
  Crown, 
  Star, 
  CalendarDays, 
  Newspaper, 
  User, 
  LifeBuoy, 
  Settings, 
  LogOut,
  Globe,
  Sliders,
  Landmark,
  Layers,
  Calculator,
  Briefcase,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWatchlist } from '../../context/WatchlistContext';

interface Props {
  activeView: string;
  onSelectView: (viewId: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  signalsCount?: {
    crypto: number;
    forex: number;
    stock: number;
    indices: number;
    commodities: number;
    vip: number;
  };
}

export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, section: 'main' },
  { id: 'search', label: 'Market Search', icon: Search, section: 'main' },
  
  // Market Signals
  { id: 'crypto-signals', label: 'Crypto Signals', icon: Coins, section: 'signals', badgeKey: 'crypto' },
  { id: 'forex-signals', label: 'Forex Signals', icon: ArrowRightLeft, section: 'signals', badgeKey: 'forex' },
  { id: 'stock-signals', label: 'Stock Signals', icon: TrendingUp, section: 'signals', badgeKey: 'stock' },
  { id: 'indices-signals', label: 'Indices Signals', icon: BarChart3, section: 'signals', badgeKey: 'indices' },
  { id: 'commodities', label: 'Commodities', icon: Gem, section: 'signals', badgeKey: 'commodities' },
  { id: 'vip-signals', label: 'VIP Signals', icon: Crown, section: 'signals', isVipHighlight: true, badgeKey: 'vip' },

  // Investing.com Signature Intelligence
  { id: 'world-indices-bonds', label: 'World Indices & Bonds', icon: Globe, section: 'investing' },
  { id: 'technical-summary-pivots', label: 'Technical & Pivots', icon: Sliders, section: 'investing' },
  { id: 'calendar-hub', label: 'Rates & Earnings Hub', icon: Landmark, section: 'investing' },
  { id: 'market-screeners', label: 'Screeners & Heatmap', icon: Layers, section: 'investing' },
  { id: 'calculators', label: 'Financial Calculators', icon: Calculator, section: 'investing' },
  { id: 'portfolio-alerts', label: 'Portfolio & Alerts', icon: Briefcase, section: 'investing' },
  { id: 'community-sentiment', label: 'Trader Sentiment', icon: Users, section: 'investing' },
  
  // Terminal Analytics & Charts
  { id: 'technical-analysis', label: 'Technical Analysis', icon: Activity, section: 'tools' },
  { id: 'charts', label: 'TradingView Charts', icon: CandlestickChart, section: 'tools' },
  { id: 'watchlist', label: 'My Watchlist', icon: Star, section: 'tools', showWatchlistCount: true },
  { id: 'economic-calendar', label: 'Economic Calendar', icon: CalendarDays, section: 'tools' },
  { id: 'market-news', label: 'Market News', icon: Newspaper, section: 'tools' },
  
  // User & Support
  { id: 'account', label: 'My Account', icon: User, section: 'user' },
  { id: 'support', label: 'Support & Tickets', icon: LifeBuoy, section: 'user' },
  { id: 'settings', label: 'Settings', icon: Settings, section: 'user' },
];

export const Sidebar: React.FC<Props> = ({
  activeView,
  onSelectView,
  mobileMenuOpen,
  setMobileMenuOpen,
  signalsCount = { crypto: 4, forex: 3, stock: 3, indices: 2, commodities: 2, vip: 5 }
}) => {
  const { isVip, signOut } = useAuth();
  const { watchlist } = useWatchlist();

  const handleSelect = (id: string) => {
    onSelectView(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside className={`fixed lg:static top-14 bottom-0 left-0 z-40 w-64 bg-[#0a0d14] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-200 select-none overflow-y-auto ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="py-3 px-2 space-y-5">
          {/* Section: Main */}
          <div>
            <div className="px-3 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-500">
              Terminal
            </div>
            <div className="space-y-0.5">
              {NAV_ITEMS.filter(item => item.section === 'main').map(item => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.id)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      isActive 
                        ? 'bg-sky-500/15 text-sky-400 font-semibold' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className={isActive ? 'text-sky-400' : 'text-slate-400'} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Signal Desks */}
          <div>
            <div className="px-3 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-500">
              Trading Signals
            </div>
            <div className="space-y-0.5">
              {NAV_ITEMS.filter(item => item.section === 'signals').map(item => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                const count = item.badgeKey ? (signalsCount as any)[item.badgeKey] : undefined;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.id)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      item.isVipHighlight
                        ? isActive
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'text-amber-400 hover:bg-amber-500/10'
                        : isActive
                        ? 'bg-sky-500/15 text-sky-400 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon 
                        size={16} 
                        className={
                          item.isVipHighlight 
                            ? 'text-amber-400' 
                            : isActive 
                            ? 'text-sky-400' 
                            : 'text-slate-400'
                        } 
                      />
                      <span>{item.label}</span>
                    </div>

                    {count !== undefined && (
                      <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                        item.isVipHighlight
                          ? 'bg-amber-500/20 text-amber-300 font-bold'
                          : isActive
                          ? 'bg-sky-500/20 text-sky-300'
                          : 'bg-slate-800/80 text-slate-400'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Investing.com Market Intelligence */}
          <div>
            <div className="px-3 pb-1 text-[10px] font-mono uppercase tracking-wider text-amber-500/80 font-bold flex items-center justify-between">
              <span>Investing.com Suite</span>
              <span className="text-[9px] px-1 rounded bg-amber-500/10 text-amber-400">PRO</span>
            </div>
            <div className="space-y-0.5">
              {NAV_ITEMS.filter(item => item.section === 'investing').map(item => {
                const Icon = item.icon;
                const isActive = activeView === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.id)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      isActive 
                        ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className={isActive ? 'text-amber-400' : 'text-slate-400'} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Tools & Feeds */}
          <div>
            <div className="px-3 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-500">
              Analytics & Feeds
            </div>
            <div className="space-y-0.5">
              {NAV_ITEMS.filter(item => item.section === 'tools').map(item => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                const wlCount = item.showWatchlistCount ? watchlist.length : undefined;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.id)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      isActive 
                        ? 'bg-sky-500/15 text-sky-400 font-semibold' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className={isActive ? 'text-sky-400' : 'text-slate-400'} />
                      <span>{item.label}</span>
                    </div>

                    {wlCount !== undefined && wlCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-300">
                        {wlCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Account & Client */}
          <div>
            <div className="px-3 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-500">
              Account
            </div>
            <div className="space-y-0.5">
              {NAV_ITEMS.filter(item => item.section === 'user').map(item => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.id)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      isActive 
                        ? 'bg-sky-500/15 text-sky-400 font-semibold' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className={isActive ? 'text-sky-400' : 'text-slate-400'} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Logout Section */}
        <div className="p-3 border-t border-slate-800/80">
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut size={16} />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>
    </>
  );
};
