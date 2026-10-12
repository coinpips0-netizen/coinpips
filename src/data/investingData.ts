export interface CentralBankRate {
  bank: string;
  country: string;
  currency: string;
  currentRate: string;
  previousRate: string;
  lastChangeDate: string;
  nextMeetingDate: string;
  bias: 'Hawkish' | 'Dovish' | 'Neutral';
}

export interface BondYield {
  country: string;
  bond: string;
  yield: number;
  change: number;
  high: number;
  low: number;
  maturity: string;
}

export interface EarningsRecord {
  ticker: string;
  company: string;
  reportDate: string;
  timing: 'BMO' | 'AMC'; // Before Market Open | After Market Close
  epsForecast: string;
  epsPrior: string;
  revenueForecast: string;
  marketCap: string;
}

export interface DividendRecord {
  ticker: string;
  company: string;
  exDividendDate: string;
  paymentDate: string;
  dividendAmount: string;
  yieldPercent: string;
}

export interface CommunityComment {
  id: string;
  author: string;
  avatar: string;
  time: string;
  symbol: string;
  sentiment: 'BULLISH' | 'BEARISH';
  text: string;
  likes: number;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  name: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW';
  createdAt: string;
  triggered: boolean;
  sendEmail: boolean;
}

export interface PortfolioPosition {
  id: string;
  symbol: string;
  name: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  quantity: number;
  assetClass: string;
  timestamp: string;
}

// Global Central Bank Interest Rates
export const CENTRAL_BANK_RATES: CentralBankRate[] = [
  { bank: 'Federal Reserve (Fed)', country: 'United States', currency: 'USD', currentRate: '4.75%', previousRate: '5.00%', lastChangeDate: 'Sep 2026', nextMeetingDate: 'Nov 07, 2026', bias: 'Dovish' },
  { bank: 'European Central Bank (ECB)', country: 'Eurozone', currency: 'EUR', currentRate: '3.25%', previousRate: '3.50%', lastChangeDate: 'Oct 2026', nextMeetingDate: 'Dec 12, 2026', bias: 'Dovish' },
  { bank: 'Bank of England (BoE)', country: 'United Kingdom', currency: 'GBP', currentRate: '4.75%', previousRate: '5.00%', lastChangeDate: 'Aug 2026', nextMeetingDate: 'Nov 07, 2026', bias: 'Neutral' },
  { bank: 'Bank of Japan (BoJ)', country: 'Japan', currency: 'JPY', currentRate: '0.25%', previousRate: '0.10%', lastChangeDate: 'Jul 2026', nextMeetingDate: 'Oct 31, 2026', bias: 'Hawkish' },
  { bank: 'Swiss National Bank (SNB)', country: 'Switzerland', currency: 'CHF', currentRate: '1.00%', previousRate: '1.25%', lastChangeDate: 'Sep 2026', nextMeetingDate: 'Dec 12, 2026', bias: 'Dovish' },
  { bank: 'Reserve Bank of Australia (RBA)', country: 'Australia', currency: 'AUD', currentRate: '4.35%', previousRate: '4.35%', lastChangeDate: 'Nov 2025', nextMeetingDate: 'Nov 05, 2026', bias: 'Neutral' },
  { bank: 'Bank of Canada (BoC)', country: 'Canada', currency: 'CAD', currentRate: '3.75%', previousRate: '4.25%', lastChangeDate: 'Oct 2026', nextMeetingDate: 'Dec 11, 2026', bias: 'Dovish' },
  { bank: 'Reserve Bank of New Zealand (RBNZ)', country: 'New Zealand', currency: 'NZD', currentRate: '4.75%', previousRate: '5.25%', lastChangeDate: 'Oct 2026', nextMeetingDate: 'Nov 27, 2026', bias: 'Dovish' }
];

// Sovereign Bond Yields
export const SOVEREIGN_BONDS: BondYield[] = [
  { country: 'United States', bond: 'U.S. 10Y Benchmark', yield: 4.285, change: 0.042, high: 4.312, low: 4.240, maturity: '10 Years' },
  { country: 'United States', bond: 'U.S. 2Y Note', yield: 4.148, change: 0.031, high: 4.175, low: 4.110, maturity: '2 Years' },
  { country: 'United States', bond: 'U.S. 30Y Bond', yield: 4.518, change: 0.038, high: 4.540, low: 4.475, maturity: '30 Years' },
  { country: 'Germany', bond: 'Germany 10Y Bund', yield: 2.342, change: -0.015, high: 2.368, low: 2.325, maturity: '10 Years' },
  { country: 'United Kingdom', bond: 'U.K. 10Y Gilt', yield: 4.215, change: 0.024, high: 4.245, low: 4.180, maturity: '10 Years' },
  { country: 'Japan', bond: 'Japan 10Y JGB', yield: 0.954, change: 0.008, high: 0.965, low: 0.942, maturity: '10 Years' },
  { country: 'Australia', bond: 'Australia 10Y', yield: 4.385, change: 0.018, high: 4.410, low: 4.355, maturity: '10 Years' },
  { country: 'Canada', bond: 'Canada 10Y', yield: 3.265, change: -0.009, high: 3.290, low: 3.245, maturity: '10 Years' }
];

// Earnings Calendar
export const UPCOMING_EARNINGS: EarningsRecord[] = [
  { ticker: 'NVDA', company: 'NVIDIA Corporation', reportDate: 'Oct 22, 2026', timing: 'AMC', epsForecast: '$0.75', epsPrior: '$0.68', revenueForecast: '$32.9B', marketCap: '$3.64T' },
  { ticker: 'AAPL', company: 'Apple Inc.', reportDate: 'Oct 31, 2026', timing: 'AMC', epsForecast: '$1.60', epsPrior: '$1.46', revenueForecast: '$94.5B', marketCap: '$3.72T' },
  { ticker: 'MSFT', company: 'Microsoft Corporation', reportDate: 'Oct 29, 2026', timing: 'AMC', epsForecast: '$3.10', epsPrior: '$2.99', revenueForecast: '$64.5B', marketCap: '$3.22T' },
  { ticker: 'AMZN', company: 'Amazon.com, Inc.', reportDate: 'Oct 24, 2026', timing: 'AMC', epsForecast: '$1.14', epsPrior: '$0.94', revenueForecast: '$157.2B', marketCap: '$2.24T' },
  { ticker: 'TSLA', company: 'Tesla, Inc.', reportDate: 'Oct 23, 2026', timing: 'AMC', epsForecast: '$0.58', epsPrior: '$0.52', revenueForecast: '$25.4B', marketCap: '$856B' },
  { ticker: 'GOOGL', company: 'Alphabet Inc.', reportDate: 'Oct 29, 2026', timing: 'AMC', epsForecast: '$1.85', epsPrior: '$1.64', revenueForecast: '$86.3B', marketCap: '$2.11T' },
  { ticker: 'META', company: 'Meta Platforms, Inc.', reportDate: 'Oct 30, 2026', timing: 'AMC', epsForecast: '$5.25', epsPrior: '$4.39', revenueForecast: '$40.2B', marketCap: '$1.48T' }
];

// Dividend Calendar
export const UPCOMING_DIVIDENDS: DividendRecord[] = [
  { ticker: 'JNJ', company: 'Johnson & Johnson', exDividendDate: 'Nov 18, 2026', paymentDate: 'Dec 10, 2026', dividendAmount: '$1.24', yieldPercent: '3.12%' },
  { ticker: 'PG', company: 'Procter & Gamble Co.', exDividendDate: 'Oct 18, 2026', paymentDate: 'Nov 15, 2026', dividendAmount: '$1.006', yieldPercent: '2.44%' },
  { ticker: 'XOM', company: 'Exxon Mobil Corp.', exDividendDate: 'Nov 14, 2026', paymentDate: 'Dec 10, 2026', dividendAmount: '$0.99', yieldPercent: '3.25%' },
  { ticker: 'CVX', company: 'Chevron Corporation', exDividendDate: 'Nov 18, 2026', paymentDate: 'Dec 10, 2026', dividendAmount: '$1.63', yieldPercent: '4.28%' },
  { ticker: 'KO', company: 'Coca-Cola Company', exDividendDate: 'Nov 29, 2026', paymentDate: 'Dec 16, 2026', dividendAmount: '$0.485', yieldPercent: '2.95%' },
  { ticker: 'MCD', company: 'McDonald\'s Corporation', exDividendDate: 'Nov 29, 2026', paymentDate: 'Dec 16, 2026', dividendAmount: '$1.77', yieldPercent: '2.38%' }
];

// Trader Community Comments & Live Sentiment
export const INITIAL_COMMUNITY_COMMENTS: CommunityComment[] = [
  {
    id: 'c-1',
    author: 'QuantumMacroTrader',
    avatar: 'Q',
    time: '4m ago',
    symbol: 'BTC/USDT',
    sentiment: 'BULLISH',
    text: 'Sustained daily close above $93.8K confirmed the weekly cup and handle pattern. Looking for expansion into $98,500 by Friday options expiry.',
    likes: 18
  },
  {
    id: 'c-2',
    author: 'LondonFXSniper',
    avatar: 'L',
    time: '12m ago',
    symbol: 'EUR/USD',
    sentiment: 'BEARISH',
    text: 'ECB rate path divergence keeps 1.0880 as heavy ceiling. Taking partials on shorts at 1.0820 with trailing stop locked in profit.',
    likes: 9
  },
  {
    id: 'c-3',
    author: 'CommodityDesk_Geneva',
    avatar: 'C',
    time: '25m ago',
    symbol: 'Gold (XAU/USD)',
    sentiment: 'BULLISH',
    text: 'Sovereign accumulation continues unabated. Any pullback toward $2,760 represents a prime institutional bid area.',
    likes: 31
  },
  {
    id: 'c-4',
    author: 'SiliconValleyAlgos',
    avatar: 'S',
    time: '42m ago',
    symbol: 'NVDA',
    sentiment: 'BULLISH',
    text: 'Supply chain checks for Blackwell server racks indicate zero cancellations and extended order backlogs into 2027.',
    likes: 14
  }
];

/**
 * Calculates Investing.com signature Pivot Points across 5 methods:
 * Classic, Fibonacci, Camarilla, Woodie's, and DeMark's
 */
export function calculatePivotPoints(high: number, low: number, close: number, open: number = close) {
  // Classic Pivot Points
  const pp = (high + low + close) / 3;
  const classic = {
    pivot: pp,
    r1: 2 * pp - low,
    r2: pp + (high - low),
    r3: high + 2 * (pp - low),
    s1: 2 * pp - high,
    s2: pp - (high - low),
    s3: low - 2 * (high - pp)
  };

  // Fibonacci Pivot Points
  const diff = high - low;
  const fibonacci = {
    pivot: pp,
    r1: pp + 0.382 * diff,
    r2: pp + 0.618 * diff,
    r3: pp + 1.000 * diff,
    s1: pp - 0.382 * diff,
    s2: pp - 0.618 * diff,
    s3: pp - 1.000 * diff
  };

  // Camarilla Pivot Points
  const camarilla = {
    pivot: pp,
    r1: close + 1.1 * diff / 12,
    r2: close + 1.1 * diff / 6,
    r3: close + 1.1 * diff / 4,
    r4: close + 1.1 * diff / 2,
    s1: close - 1.1 * diff / 12,
    s2: close - 1.1 * diff / 6,
    s3: close - 1.1 * diff / 4,
    s4: close - 1.1 * diff / 2
  };

  // Woodie's Pivot Points
  const wpp = (high + low + 2 * open) / 4;
  const woodie = {
    pivot: wpp,
    r1: 2 * wpp - low,
    r2: wpp + diff,
    s1: 2 * wpp - high,
    s2: wpp - diff
  };

  // DeMark's Pivot Points
  let demarkX = 0;
  if (close < open) demarkX = high + 2 * low + close;
  else if (close > open) demarkX = 2 * high + low + close;
  else demarkX = high + low + 2 * close;

  const demark = {
    pivot: demarkX / 4,
    r1: demarkX / 2 - low,
    s1: demarkX / 2 - high
  };

  return { classic, fibonacci, camarilla, woodie, demark };
}

/**
 * Returns Investing.com's famous Technical Indicators Table for an instrument
 */
export function getTechnicalIndicatorsTable(price: number, change24h: number) {
  const isBull = change24h >= 0;
  return [
    { name: 'RSI (14)', value: isBull ? '62.40' : '41.20', action: isBull ? 'BUY' : 'SELL' },
    { name: 'STOCH (9,6)', value: isBull ? '68.80' : '38.10', action: isBull ? 'BUY' : 'SELL' },
    { name: 'STOCHRSI (14)', value: isBull ? '74.20' : '28.40', action: isBull ? 'BUY' : 'OVERSOLD' },
    { name: 'MACD (12,26)', value: isBull ? '+14.85' : '-8.20', action: isBull ? 'BUY' : 'SELL' },
    { name: 'ADX (14)', value: '38.50', action: 'STRONG TREND' },
    { name: 'Williams %R', value: isBull ? '-28.10' : '-74.50', action: isBull ? 'BUY' : 'SELL' },
    { name: 'CCI (14)', value: isBull ? '+118.4' : '-94.2', action: isBull ? 'BUY' : 'SELL' },
    { name: 'ATR (14)', value: (price * 0.018).toFixed(2), action: 'HIGH VOLATILITY' },
    { name: 'Highs/Lows (14)', value: isBull ? '+0.0084' : '-0.0042', action: isBull ? 'BUY' : 'SELL' },
    { name: 'Ultimate Oscillator', value: isBull ? '58.40' : '44.10', action: isBull ? 'BUY' : 'NEUTRAL' },
    { name: 'ROC', value: `${change24h > 0 ? '+' : ''}${change24h.toFixed(2)}%`, action: isBull ? 'BUY' : 'SELL' },
    { name: 'Bull/Bear Power (13)', value: isBull ? '+42.10' : '-28.40', action: isBull ? 'BUY' : 'SELL' }
  ];
}

/**
 * Returns Investing.com's famous Moving Averages Table for an instrument
 */
export function getMovingAveragesTable(price: number, change24h: number) {
  const isBull = change24h >= 0;
  return [
    { period: 'MA5', sma: (price * (isBull ? 0.995 : 1.005)).toFixed(price > 100 ? 2 : 4), smaAction: isBull ? 'BUY' : 'SELL', ema: (price * (isBull ? 0.996 : 1.004)).toFixed(price > 100 ? 2 : 4), emaAction: isBull ? 'BUY' : 'SELL' },
    { period: 'MA10', sma: (price * (isBull ? 0.991 : 1.009)).toFixed(price > 100 ? 2 : 4), smaAction: isBull ? 'BUY' : 'SELL', ema: (price * (isBull ? 0.992 : 1.008)).toFixed(price > 100 ? 2 : 4), emaAction: isBull ? 'BUY' : 'SELL' },
    { period: 'MA20', sma: (price * (isBull ? 0.985 : 1.015)).toFixed(price > 100 ? 2 : 4), smaAction: isBull ? 'BUY' : 'SELL', ema: (price * (isBull ? 0.987 : 1.013)).toFixed(price > 100 ? 2 : 4), emaAction: isBull ? 'BUY' : 'SELL' },
    { period: 'MA50', sma: (price * (isBull ? 0.970 : 1.030)).toFixed(price > 100 ? 2 : 4), smaAction: isBull ? 'BUY' : 'SELL', ema: (price * (isBull ? 0.975 : 1.025)).toFixed(price > 100 ? 2 : 4), emaAction: isBull ? 'BUY' : 'SELL' },
    { period: 'MA100', sma: (price * (isBull ? 0.950 : 1.050)).toFixed(price > 100 ? 2 : 4), smaAction: isBull ? 'BUY' : 'SELL', ema: (price * (isBull ? 0.958 : 1.042)).toFixed(price > 100 ? 2 : 4), emaAction: isBull ? 'BUY' : 'SELL' },
    { period: 'MA200', sma: (price * (isBull ? 0.920 : 1.080)).toFixed(price > 100 ? 2 : 4), smaAction: isBull ? 'BUY' : 'SELL', ema: (price * (isBull ? 0.935 : 1.065)).toFixed(price > 100 ? 2 : 4), emaAction: isBull ? 'BUY' : 'SELL' }
  ];
}
