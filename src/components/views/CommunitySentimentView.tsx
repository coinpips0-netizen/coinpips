import React, { useState } from 'react';
import { 
  Users, 
  ThumbsUp, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown, 
  Send, 
  Filter, 
  Sparkles,
  CheckCircle2,
  Flame,
  Award
} from 'lucide-react';
import { INITIAL_COMMUNITY_COMMENTS, CommunityComment } from '../../data/investingData';
import { useAuth } from '../../context/AuthContext';

interface SentimentPoll {
  symbol: string;
  name: string;
  bullishVotes: number;
  bearishVotes: number;
  userVoted?: 'BULLISH' | 'BEARISH';
}

const INITIAL_POLLS: SentimentPoll[] = [
  { symbol: 'BTC/USDT', name: 'Bitcoin', bullishVotes: 1420, bearishVotes: 412 },
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', bullishVotes: 512, bearishVotes: 689 },
  { symbol: 'XAU/USD', name: 'Gold Spot', bullishVotes: 1890, bearishVotes: 230 },
  { symbol: 'SPX', name: 'S&P 500 Index', bullishVotes: 980, bearishVotes: 640 },
  { symbol: 'NVDA', name: 'NVIDIA Corp', bullishVotes: 2140, bearishVotes: 320 },
  { symbol: 'ETH/USDT', name: 'Ethereum', bullishVotes: 890, bearishVotes: 410 },
  { symbol: 'USOIL', name: 'Crude Oil WTI', bullishVotes: 430, bearishVotes: 590 }
];

export const CommunitySentimentView: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [polls, setPolls] = useState<SentimentPoll[]>(INITIAL_POLLS);
  const [comments, setComments] = useState<CommunityComment[]>(INITIAL_COMMUNITY_COMMENTS);
  const [selectedFilterSymbol, setSelectedFilterSymbol] = useState<string>('ALL');
  
  // Comment Form State
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentSymbol, setNewCommentSymbol] = useState('BTC/USDT');
  const [newCommentSentiment, setNewCommentSentiment] = useState<'BULLISH' | 'BEARISH'>('BULLISH');
  const [likedCommentIds, setLikedCommentIds] = useState<Set<string>>(new Set());

  // Handle voting
  const handleVote = (symbol: string, direction: 'BULLISH' | 'BEARISH') => {
    setPolls(prev => prev.map(poll => {
      if (poll.symbol !== symbol) return poll;
      if (poll.userVoted === direction) return poll; // already voted same

      let newBull = poll.bullishVotes;
      let newBear = poll.bearishVotes;

      if (poll.userVoted === 'BULLISH' && direction === 'BEARISH') {
        newBull = Math.max(0, newBull - 1);
        newBear += 1;
      } else if (poll.userVoted === 'BEARISH' && direction === 'BULLISH') {
        newBear = Math.max(0, newBear - 1);
        newBull += 1;
      } else if (!poll.userVoted) {
        if (direction === 'BULLISH') newBull += 1;
        else newBear += 1;
      }

      return {
        ...poll,
        bullishVotes: newBull,
        bearishVotes: newBear,
        userVoted: direction
      };
    }));
  };

  // Handle comment like
  const handleLike = (id: string) => {
    if (likedCommentIds.has(id)) return;
    setLikedCommentIds(prev => new Set(prev).add(id));
    setComments(prev => prev.map(c => c.id === id ? { ...c, likes: c.likes + 1 } : c));
  };

  // Submit comment
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const authorName = userProfile?.displayName || currentUser?.email?.split('@')[0] || 'Institutional Trader';
    const newComment: CommunityComment = {
      id: `c-${Date.now()}`,
      author: authorName,
      avatar: authorName.charAt(0).toUpperCase(),
      time: 'Just now',
      symbol: newCommentSymbol,
      sentiment: newCommentSentiment,
      text: newCommentText.trim(),
      likes: 0
    };

    setComments(prev => [newComment, ...prev]);
    setNewCommentText('');
  };

  const filteredComments = selectedFilterSymbol === 'ALL'
    ? comments
    : comments.filter(c => c.symbol === selectedFilterSymbol);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <Users className="text-sky-400" size={22} />
          <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
            Trader Community & Crowd Sentiment
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          Investing.com signature trader consensus sentiment meters, community trade ideas, and market discussion
        </p>
      </div>

      {/* Grid: Sentiment Polls & Community Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Crowd Sentiment Meters (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl bg-[#0c1017] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-amber-400" />
                <h2 className="text-sm font-bold text-white font-sans">Live Instrument Consensus</h2>
              </div>
              <span className="text-[11px] font-mono text-slate-500">Live Polling</span>
            </div>

            <div className="space-y-4">
              {polls.map(poll => {
                const total = poll.bullishVotes + poll.bearishVotes;
                const bullPct = total > 0 ? Math.round((poll.bullishVotes / total) * 100) : 50;
                const bearPct = 100 - bullPct;

                return (
                  <div key={poll.symbol} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="font-bold text-white">{poll.symbol}</span>
                        <span className="text-slate-500 ml-1.5 text-[11px]">{poll.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-emerald-400 font-bold">{bullPct}% Bull</span>
                        <span className="text-slate-500">/</span>
                        <span className="text-rose-400 font-bold">{bearPct}% Bear</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                      <div 
                        className="bg-emerald-500 h-full transition-all duration-300" 
                        style={{ width: `${bullPct}%` }}
                        title={`${bullPct}% Bullish`}
                      />
                      <div 
                        className="bg-rose-500 h-full transition-all duration-300" 
                        style={{ width: `${bearPct}%` }}
                        title={`${bearPct}% Bearish`}
                      />
                    </div>

                    {/* Voting Action Buttons */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-[10px] text-slate-500 font-mono">
                        {total.toLocaleString()} total votes
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleVote(poll.symbol, 'BULLISH')}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-colors ${
                            poll.userVoted === 'BULLISH'
                              ? 'bg-emerald-500 text-slate-950 shadow-sm'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          <TrendingUp size={12} />
                          <span>Bullish</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleVote(poll.symbol, 'BEARISH')}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-colors ${
                            poll.userVoted === 'BEARISH'
                              ? 'bg-rose-500 text-slate-950 shadow-sm'
                              : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          <TrendingDown size={12} />
                          <span>Bearish</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Trader Discussion & Idea Board (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Post New Comment Box */}
          <div className="p-4 rounded-2xl bg-[#0c1017] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-200 font-bold">
                <MessageSquare size={15} className="text-sky-400" />
                <span>Share Market Analysis & Discussion</span>
              </div>
              <span className="text-slate-500 text-[11px]">Investing Community</span>
            </div>

            <form onSubmit={handleSubmitComment} className="space-y-3">
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Instrument:</label>
                  <select
                    value={newCommentSymbol}
                    onChange={(e) => setNewCommentSymbol(e.target.value)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-white font-bold focus:outline-none focus:border-sky-500"
                  >
                    <option value="BTC/USDT">BTC/USDT</option>
                    <option value="ETH/USDT">ETH/USDT</option>
                    <option value="EUR/USD">EUR/USD</option>
                    <option value="XAU/USD">Gold (XAU/USD)</option>
                    <option value="SPX">S&P 500</option>
                    <option value="NVDA">NVDA</option>
                    <option value="USOIL">Crude Oil WTI</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Your Bias:</label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setNewCommentSentiment('BULLISH')}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                        newCommentSentiment === 'BULLISH'
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-900 text-emerald-400 border border-slate-800'
                      }`}
                    >
                      BULLISH
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewCommentSentiment('BEARISH')}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                        newCommentSentiment === 'BEARISH'
                          ? 'bg-rose-500 text-slate-950'
                          : 'bg-slate-900 text-rose-400 border border-slate-800'
                      }`}
                    >
                      BEARISH
                    </button>
                  </div>
                </div>
              </div>

              <textarea
                rows={3}
                required
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Share your technical observation, pivot target, or macro thesis..."
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-sans placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 text-xs font-bold font-mono transition-colors"
                >
                  <Send size={13} />
                  <span>Post to Desk</span>
                </button>
              </div>
            </form>
          </div>

          {/* Comment Filters & Feed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Desk Discussions ({filteredComments.length})</span>
              <div className="flex items-center gap-1">
                {['ALL', 'BTC/USDT', 'EUR/USD', 'Gold (XAU/USD)', 'NVDA'].map(sym => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => setSelectedFilterSymbol(sym)}
                    className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                      selectedFilterSymbol === sym
                        ? 'bg-sky-500/20 text-sky-400 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredComments.map(comment => {
                const isBull = comment.sentiment === 'BULLISH';
                const hasLiked = likedCommentIds.has(comment.id);

                return (
                  <div key={comment.id} className="p-4 rounded-xl bg-[#0c1017] border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 text-xs font-bold">
                          {comment.avatar}
                        </div>
                        <span className="font-bold text-white">{comment.author}</span>
                        <span className="text-slate-500 text-[11px]">· {comment.time}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-bold">{comment.symbol}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isBull
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}>
                          {comment.sentiment}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {comment.text}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs font-mono">
                      <button
                        type="button"
                        onClick={() => handleLike(comment.id)}
                        className={`flex items-center gap-1.5 text-[11px] transition-colors ${
                          hasLiked ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <ThumbsUp size={12} />
                        <span>{comment.likes} Likes</span>
                      </button>

                      <span className="text-[10px] text-slate-500">Verified Trader</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
