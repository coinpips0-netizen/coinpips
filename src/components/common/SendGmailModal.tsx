import React, { useState } from 'react';
import { Mail, Check, AlertCircle, X, ShieldAlert } from 'lucide-react';
import { sendGmailMessage, buildSignalEmailHtml, getCachedGmailToken, connectGoogleWithGmail } from '../../services/gmailService';
import { useAuth } from '../../context/AuthContext';
import { Signal } from '../../types/market';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  signal: Signal;
}

export const SendGmailModal: React.FC<Props> = ({ isOpen, onClose, signal }) => {
  const { currentUser } = useAuth();
  const [recipient, setRecipient] = useState(currentUser?.email || '');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirmSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSending(true);

    try {
      let token = getCachedGmailToken();
      if (!token) {
        const connectResult = await connectGoogleWithGmail();
        token = connectResult.accessToken;
      }

      const html = buildSignalEmailHtml(signal);
      const subject = `[COINPIPS ALERT] ${signal.direction} ${signal.symbol} (${signal.timeframe}) Setup`;

      await sendGmailMessage({
        recipientEmail: recipient,
        senderEmail: currentUser?.email || 'me',
        subject,
        htmlContent: html
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1800);
    } catch (err: any) {
      setError(err?.message || 'Failed to dispatch email via Gmail API');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-[#0e131d] border border-slate-800 rounded-xl shadow-2xl p-6 text-slate-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-md"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Mail size={22} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Send Trade Signal to Gmail</h3>
            <p className="text-xs text-slate-400">Explicit Google Workspace API Confirmation</p>
          </div>
        </div>

        {/* Notice of Permission */}
        <div className="p-3 mb-4 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1.5">
          <div className="flex items-center gap-1.5 font-medium text-sky-400">
            <ShieldAlert size={14} />
            <span>User Confirmation Required</span>
          </div>
          <p className="text-slate-400">
            You are about to authorize sending a trade signal alert on behalf of your connected Google account using the official Gmail API.
          </p>
          <div className="pt-1 text-[11px] font-mono text-slate-400">
            <span className="text-slate-200 font-semibold">{signal.direction} {signal.symbol}</span> · Entry: {signal.entryZone} · SL: {signal.stopLoss} · TP: {signal.takeProfit1}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-semibold">
            <Check size={18} />
            <span>Email successfully sent to {recipient}!</span>
          </div>
        ) : (
          <form onSubmit={handleConfirmSend} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Recipient Email Address
              </label>
              <input
                type="email"
                required
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="your-email@example.com"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:border-sky-500 focus:outline-none text-xs text-white placeholder-slate-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={sending}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 transition-colors shadow-sm disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Confirm & Send Email'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
