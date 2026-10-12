export type AssetClass = 'crypto' | 'forex' | 'stock' | 'indices' | 'commodities';

export type SignalDirection = 'BUY' | 'SELL' | 'NEUTRAL' | 'STRONG_BUY' | 'STRONG_SELL';

export type SignalStatus = 'ACTIVE' | 'HIT_TARGET' | 'STOPPED_OUT' | 'EXPIRED' | 'CANCELLED';

export type Timeframe = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1D' | '1W' | '1M';

export interface Instrument {
  symbol: string;              // Internal unique key, e.g. "BTCUSDT"
  displaySymbol: string;       // Formatted for UI, e.g. "BTC/USDT"
  name: string;                // "Bitcoin"
  assetClass: AssetClass;
  price: number;
  change24h: number;           // percentage
  changeAmount?: number;
  high24h: number;
  low24h: number;
  volume: string;
  exchange: string;            // "Binance", "OANDA", "NASDAQ"
  tradingViewSymbol: string;   // e.g. "BINANCE:BTCUSDT"
  trend: 'bullish' | 'bearish' | 'neutral';
  sparkline: number[];
  sector?: string;             // For stocks
  isTradableCfd?: boolean;     // For indices/commodities
}

export interface SignalIndicators {
  rsi: number;
  macd: string;
  emaCross: string;
  sma200: string;
  bollinger: string;
  atr: number;
}

export interface Signal {
  id: string;
  symbol: string;
  name: string;
  assetClass: AssetClass;
  direction: SignalDirection;
  entryPrice: number;
  entryZone: string;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  takeProfit3: number;
  riskRewardRatio: string;
  timeframe: string;
  indicators: SignalIndicators;
  explanation: string;
  isVip: boolean;
  status: SignalStatus;
  createdAt: string;
  tradingViewSymbol: string;
  hitTargetLevel?: number;
  pipsGain?: number;
}

export interface WatchlistItem {
  userId: string;
  symbol: string;
  name: string;
  assetClass: AssetClass;
  addedAt: string;
  price?: number;
  change24h?: number;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  membership: 'free' | 'vip';
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userEmail: string;
  subject: string;
  message: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}

export interface MarketNews {
  id: string;
  title: string;
  summary: string;
  source: string;
  time: string;
  category: AssetClass | 'general';
  sentiment: 'bullish' | 'bearish' | 'neutral';
  url?: string;
}

export interface EconomicEvent {
  id: string;
  time: string;
  country: string;
  currency: string;
  event: string;
  impact: 'HIGH' | 'MED' | 'LOW';
  actual: string;
  forecast: string;
  previous: string;
}

export interface MarketSession {
  name: string;
  city: string;
  timezone: string;
  openUtc: number; // Hour in UTC
  closeUtc: number; // Hour in UTC
  status: 'OPEN' | 'CLOSED' | 'CLOSING_SOON';
}
