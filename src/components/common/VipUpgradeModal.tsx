import React, { useState } from 'react';
import { Crown, Check, X, Sparkles, Shield, Zap, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const VipUpgradeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { upgradeToVip, isVip } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      await upgradeToVip();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const VIP_BENEFITS = [
    'Unrestricted access to all VIP High-Probability Trading Signals',
    'Multi-tiered take-profit scaling levels (TP1, TP2, TP3)',
    'Dynamic trailing stop-loss guidance & trade invalidation rules',
    'Instant signal delivery to your Gmail inbox via Workspace API',
    'Institutional macroeconomic commentary & pre-market briefs',
    'Priority 24/7 technical desk support via ticket dashboard'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-[#0c1017] border border-amber-500/30 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-md"
        >
          <X size={20} />
        </button>

        {/* Crest */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 mb-3">
            <Crown size={28} />
          </div>
          <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase font-bold">
            PREMIUM MEMBERSHIP
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1">
            COINPIPS VIP CLUB
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            Institutional-grade trade setups, asymmetric risk-to-reward ratios, and instant signal alerts.
          </p>
        </div>

        {/* Pricing Toggle */}
        <div className="flex items-center justify-center gap-2 p-1 max-w-xs mx-auto mb-6 bg-slate-900 rounded-lg border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Monthly ($49/mo)
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('annual')}
            className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
              billingCycle === 'annual'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Annual ($399/yr)
          </button>
        </div>

        {/* Features List */}
        <div className="space-y-2.5 mb-6 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
          {VIP_BENEFITS.map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
              <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check size={11} />
              </div>
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        {isVip ? (
          <div className="text-center p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            You are already an active VIP member. All features unlocked!
          </div>
        ) : success ? (
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
            <Check size={16} />
            <span>Welcome to VIP! Account tier successfully upgraded.</span>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              type="button"
              disabled={loading}
              onClick={handleUpgrade}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 text-sm font-extrabold transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50"
            >
              <Crown size={16} />
              <span>{loading ? 'Activating VIP Membership...' : 'Activate Instant VIP Access'}</span>
              <ArrowRight size={16} />
            </button>
            <p className="text-[10px] text-center text-slate-400">
              Immediate simulated activation enables full testing of locked signals and features.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
