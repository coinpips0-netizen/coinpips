import React, { useState, useEffect } from 'react';
import { LifeBuoy, Send, CheckCircle, Clock, AlertCircle, HelpCircle, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createSupportTicket, fetchUserSupportTickets } from '../../services/firestoreService';
import { SupportTicket } from '../../types/market';

export const SupportView: React.FC = () => {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Trading Signals');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser?.uid) {
      loadTickets();
    }
  }, [currentUser]);

  const loadTickets = async () => {
    if (!currentUser?.uid) return;
    setLoading(true);
    try {
      const data = await fetchUserSupportTickets(currentUser.uid);
      setTickets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.uid || !currentUser.email) return;

    setSubmitting(true);
    try {
      const ticketId = await createSupportTicket({
        userId: currentUser.uid,
        userEmail: currentUser.email,
        subject,
        message,
        category
      });

      setSubmittedTicketId(ticketId);
      setSubject('');
      setMessage('');
      await loadTickets();
      setTimeout(() => setSubmittedTicketId(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const FAQS = [
    {
      q: 'How does COINPIPS compute technical trading signals?',
      a: 'Signals are calculated by our multi-indicator technical engine combining RSI (14), MACD histogram momentum, 20/50 EMA dynamic trend filters, and 200 SMA macro baselines with ATR volatility bounds.'
    },
    {
      q: 'Are TradingView charts and prices delayed?',
      a: 'Cryptocurrency feeds connect via live Binance streaming, while Forex, Equities and Indices display real-time and exchange-regulated delayed quotes clearly identified by exchange provider tags.'
    },
    {
      q: 'How do I receive signals directly in my Gmail?',
      a: 'Connect your Google account via the Gmail button in the header or your Account Settings. You can click "Send to Gmail" on any trade signal to dispatch an institutional alert instantly.'
    },
    {
      q: 'What is the difference between Free and VIP tier?',
      a: 'Free tier users access public signals and standard market data. VIP members receive high-probability proprietary setups, multi-level take-profit zones, dynamic trailing stops, and pre-market macro notes.'
    }
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <LifeBuoy className="text-sky-400" size={22} />
          <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
            Client Support & Desk Inquiries
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          Submit technical tickets to the COINPIPS market desk, recorded in Cloud Firestore
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Form */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c1017] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
            <MessageSquare size={16} className="text-sky-400" />
            <h3 className="text-sm font-bold text-white font-sans">Create Support Ticket</h3>
          </div>

          {submittedTicketId && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
              <CheckCircle size={16} className="shrink-0" />
              <span>Ticket #{submittedTicketId} submitted successfully to Firestore!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono focus:outline-none focus:border-sky-500"
              >
                <option value="Trading Signals">Trading Signals Query</option>
                <option value="VIP Membership">VIP Membership & Billing</option>
                <option value="TradingView Charts">TradingView Chart Feed</option>
                <option value="Gmail Integration">Gmail Alert Dispatch</option>
                <option value="General Question">General Desk Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of inquiry..."
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Inquiry Details</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide detailed description of the setup or technical issue..."
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold transition-colors shadow-sm disabled:opacity-50"
            >
              <Send size={14} />
              <span>{submitting ? 'Submitting to Firestore...' : 'Dispatch Support Ticket'}</span>
            </button>
          </form>
        </div>

        {/* Existing User Tickets History */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c1017] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <h3 className="text-sm font-bold text-white font-sans">My Submitted Tickets</h3>
            <span className="text-[11px] font-mono text-slate-500">{tickets.length} Records</span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {loading ? (
              <div className="text-center py-12 text-slate-500 text-xs font-mono">
                Loading tickets from Firestore...
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No tickets submitted yet. Use the form to reach our desk.
              </div>
            ) : (
              tickets.map(t => (
                <div key={t.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono text-sky-400">{t.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      t.status === 'resolved' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : t.status === 'in_progress' 
                        ? 'bg-amber-500/20 text-amber-300' 
                        : 'bg-sky-500/20 text-sky-400'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <div className="font-semibold text-white">{t.subject}</div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{t.message}</p>
                  <div className="text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800/60">
                    Category: {t.category} · {t.createdAt?.slice(0, 16)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0c1017] space-y-4">
        <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
          <HelpCircle size={16} className="text-sky-400" />
          <span>Frequently Asked Questions</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {FAQS.map((faq, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-1.5">
              <span className="font-bold text-white block">{faq.q}</span>
              <p className="text-slate-400 leading-relaxed text-[11px]">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
