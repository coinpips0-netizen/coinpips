import React, { useState } from 'react';
import { 
  Search, 
  Crown, 
  User as UserIcon, 
  LogOut, 
  Mail, 
  CheckCircle2, 
  Menu, 
  X,
  Bell,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { CoinPipsLogo } from './CoinPipsLogo';
import { useAuth } from '../../context/AuthContext';
import { getCachedGmailToken, connectGoogleWithGmail } from '../../services/gmailService';
import { MARKET_SESSIONS } from '../../data/marketData';

interface Props {
  onOpenSearch: () => void;
  onOpenVipModal: () => void;
  onNavigate: (viewId: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  activeView: string;
}

export const Header: React.FC<Props> = ({
  onOpenSearch,
  onOpenVipModal,
  onNavigate,
  mobileMenuOpen,
  setMobileMenuOpen,
  activeView
}) => {
  const { currentUser, userProfile, isVip, signOut } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [gmailConnecting, setGmailConnecting] = useState(false);
  const [gmailConnected, setGmailConnected] = useState<boolean>(!!getCachedGmailToken());

  const handleConnectGmail = async () => {
    setGmailConnecting(true);
    try {
      await connectGoogleWithGmail();
      setGmailConnected(true);
    } catch (err) {
      console.error('Failed to connect Gmail:', err);
    } finally {
      setGmailConnecting(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-[#090c12]/95 backdrop-blur border-b border-slate-800/80">
      {/* Zone 1: Brand & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800/60 lg:hidden"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <button 
          type="button" 
          onClick={() => onNavigate('overview')}
          className="focus:outline-none focus-visible:ring-1 focus-visible:ring-sky-500 rounded"
        >
          <CoinPipsLogo size="md" />
        </button>
      </div>

      {/* Zone 2: Global Search Bar & Session Statuses */}
      <div className="hidden md:flex items-center gap-4 flex-1 max-w-xl mx-6">
        {/* Search Input Trigger */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex items-center justify-between w-full h-8 px-3 rounded-md bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 hover:text-slate-300 transition-colors shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search size={14} className="text-slate-500" />
            <span>Search Crypto, Forex, Stocks, Indices, Gold...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
            Ctrl K
          </kbd>
        </button>

        {/* Global Market Session Status */}
        <div className="hidden xl:flex items-center gap-3 text-[11px] font-mono text-slate-400 shrink-0">
          {MARKET_SESSIONS.slice(0, 3).map(session => (
            <div key={session.name} className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${
                session.status === 'OPEN' 
                  ? 'bg-emerald-400' 
                  : session.status === 'CLOSING_SOON' 
                  ? 'bg-amber-400' 
                  : 'bg-slate-600'
              }`} />
              <span className="text-slate-300 font-medium">{session.name.split(' ')[0]}:</span>
              <span className={session.status === 'OPEN' ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                {session.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Zone 3: Actions, Gmail Integration & Profile */}
      <div className="flex items-center gap-2.5">
        {/* Mobile Search Icon */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="p-1.5 text-slate-400 hover:text-slate-100 rounded-md md:hidden hover:bg-slate-800/60"
          aria-label="Search instruments"
        >
          <Search size={18} />
        </button>

        {/* Gmail Alerts Status / Connect */}
        <button
          type="button"
          onClick={handleConnectGmail}
          disabled={gmailConnecting}
          title={gmailConnected ? "Gmail Connected: Real-time signal dispatch enabled" : "Connect Google Account for Gmail Trade Alerts"}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-colors border ${
            gmailConnected
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <Mail size={13} className={gmailConnected ? 'text-emerald-400' : 'text-slate-400'} />
          <span className="hidden lg:inline">{gmailConnected ? 'Gmail Active' : 'Gmail Alerts'}</span>
          {gmailConnected && <CheckCircle2 size={11} className="text-emerald-400" />}
        </button>

        {/* VIP Status or Upgrade Button */}
        {isVip ? (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold font-mono tracking-wide">
            <Crown size={13} />
            <span>VIP TRADER</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenVipModal}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all shadow-sm"
          >
            <Crown size={13} />
            <span>UPGRADE VIP</span>
          </button>
        )}

        {/* Profile Menu Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 pl-2 rounded-md hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-700/60"
          >
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 text-xs font-bold uppercase">
              {userProfile?.displayName ? userProfile.displayName.charAt(0) : 'T'}
            </div>
            <span className="hidden md:inline-block text-xs font-medium text-slate-200 max-w-[100px] truncate">
              {userProfile?.displayName || 'My Account'}
            </span>
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg bg-[#0e131d] border border-slate-800 shadow-2xl py-1 text-xs text-slate-200 z-50">
              <div className="px-3 py-2 border-b border-slate-800/80">
                <div className="font-semibold text-white truncate">{userProfile?.displayName || 'Trader'}</div>
                <div className="text-[11px] text-slate-400 truncate font-mono">{currentUser?.email}</div>
                <div className="mt-1 flex items-center gap-1">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isVip ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isVip ? 'VIP MEMBERSHIP' : 'FREE TIER'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onNavigate('account');
                  setProfileDropdownOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-slate-800/60 text-left text-slate-300 hover:text-white"
              >
                <UserIcon size={14} />
                <span>My Account & Security</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onNavigate('watchlist');
                  setProfileDropdownOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-slate-800/60 text-left text-slate-300 hover:text-white"
              >
                <SlidersHorizontal size={14} />
                <span>My Watchlist</span>
              </button>

              {!isVip && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenVipModal();
                    setProfileDropdownOpen(false);
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-amber-500/10 text-left text-amber-400 font-medium"
                >
                  <Crown size={14} />
                  <span>Upgrade to VIP</span>
                </button>
              )}

              <div className="my-1 border-t border-slate-800/80" />

              <button
                type="button"
                onClick={() => {
                  signOut();
                  setProfileDropdownOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-rose-500/10 text-left text-rose-400"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
