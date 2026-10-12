import React, { useState } from 'react';
import { 
  User, 
  Crown, 
  ShieldCheck, 
  Mail, 
  Key, 
  Clock, 
  Star, 
  Check, 
  LogOut,
  RefreshCw,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWatchlist } from '../../context/WatchlistContext';
import { connectGoogleWithGmail, getCachedGmailToken } from '../../services/gmailService';

interface Props {
  onOpenVipModal: () => void;
}

export const MyAccountView: React.FC<Props> = ({ onOpenVipModal }) => {
  const { currentUser, userProfile, isVip, upgradeToVip, downgradeToFree, sendPasswordReset, signOut } = useAuth();
  const { watchlist } = useWatchlist();
  const [resetSent, setResetSent] = useState(false);
  const [gmailConnecting, setGmailConnecting] = useState(false);
  const [gmailActive, setGmailActive] = useState(!!getCachedGmailToken());
  const [tierToggling, setTierToggling] = useState(false);

  const handlePasswordReset = async () => {
    if (!currentUser?.email) return;
    await sendPasswordReset(currentUser.email);
    setResetSent(true);
    setTimeout(() => setResetSent(false), 4000);
  };

  const handleConnectGmail = async () => {
    setGmailConnecting(true);
    try {
      await connectGoogleWithGmail();
      setGmailActive(true);
    } catch (err) {
      console.error(err);
    } finally {
      setGmailConnecting(false);
    }
  };

  const handleToggleTier = async () => {
    setTierToggling(true);
    try {
      if (isVip) {
        await downgradeToFree();
      } else {
        await upgradeToVip();
      }
    } finally {
      setTierToggling(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <User className="text-sky-400" size={22} />
          <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
            Account Management & Security
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          Firebase Authentication credentials, Firestore profile record, and VIP subscription tier
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0c1017] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-slate-950 text-xl font-extrabold uppercase shadow-lg shadow-sky-500/20">
              {userProfile?.displayName?.charAt(0) || 'T'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-sans">
                  {userProfile?.displayName || 'Institutional Trader'}
                </h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  isVip 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {isVip ? 'VIP TRADER' : 'FREE TIER'}
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">{currentUser?.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={tierToggling}
              onClick={handleToggleTier}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-colors border ${
                isVip
                  ? 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 shadow-md'
              }`}
            >
              {tierToggling ? 'Updating...' : isVip ? 'Downgrade to Free' : 'Simulate Instant VIP Upgrade'}
            </button>
          </div>
        </div>

        {/* Database Key-Value Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-500 uppercase">Firestore UID</span>
            <div className="text-white font-medium truncate" title={currentUser?.uid}>
              {currentUser?.uid || 'anonymous-user'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-500 uppercase">Watchlist Items</span>
            <div className="text-white font-bold">{watchlist.length} Instruments Tracked</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-500 uppercase">Account Created</span>
            <div className="text-white font-medium">
              {userProfile?.createdAt?.slice(0, 10) || new Date().toISOString().slice(0, 10)}
            </div>
          </div>
        </div>
      </div>

      {/* Integrations & Security Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Google Workspace & Gmail */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c1017] space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="text-sky-400" size={18} />
            <h3 className="text-sm font-bold text-white font-sans">
              Google Workspace (Gmail) Integration
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Connect your Google account to automatically dispatch institutional trade signal alerts directly to your personal or corporate Gmail inbox.
          </p>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${gmailActive ? 'bg-emerald-400' : 'bg-slate-600'}`} />
              <span className="text-slate-300">{gmailActive ? 'Gmail Dispatch Active' : 'Not Connected'}</span>
            </div>
            <button
              type="button"
              disabled={gmailConnecting}
              onClick={handleConnectGmail}
              className="px-3 py-1 rounded bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 border border-sky-500/30 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {gmailConnecting ? 'Connecting...' : gmailActive ? 'Reconnect' : 'Connect Gmail'}
            </button>
          </div>
        </div>

        {/* Security & Credentials */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c1017] space-y-4">
          <div className="flex items-center gap-2">
            <Key className="text-amber-400" size={18} />
            <h3 className="text-sm font-bold text-white font-sans">
              Password & Session Security
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Manage your credentials and security tokens via Firebase Authentication services.
          </p>

          <div className="space-y-3 pt-1">
            <button
              type="button"
              onClick={handlePasswordReset}
              className="flex items-center justify-between w-full p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 transition-colors"
            >
              <span>Dispatch Password Reset Link</span>
              <span className="text-sky-400 font-semibold">{resetSent ? 'Sent!' : 'Request Email'}</span>
            </button>

            <button
              type="button"
              onClick={signOut}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold transition-colors"
            >
              <LogOut size={14} />
              <span>Terminate Active Session</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
