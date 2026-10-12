import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { TradingViewTickerTape } from './components/tradingview/TradingViewTickerTape';
import { LoginDashboard } from './components/views/LoginDashboard';
import { OverviewView } from './components/views/OverviewView';
import { MarketSearchView } from './components/views/MarketSearchView';
import { CryptoSignalsView } from './components/views/CryptoSignalsView';
import { ForexSignalsView } from './components/views/ForexSignalsView';
import { StockSignalsView } from './components/views/StockSignalsView';
import { IndicesSignalsView } from './components/views/IndicesSignalsView';
import { CommoditiesView } from './components/views/CommoditiesView';
import { VipSignalsView } from './components/views/VipSignalsView';
import { TechnicalAnalysisView } from './components/views/TechnicalAnalysisView';
import { ChartsView } from './components/views/ChartsView';
import { WatchlistView } from './components/views/WatchlistView';
import { EconomicCalendarView } from './components/views/EconomicCalendarView';
import { MarketNewsView } from './components/views/MarketNewsView';
import { MyAccountView } from './components/views/MyAccountView';
import { SupportView } from './components/views/SupportView';
import { SettingsView } from './components/views/SettingsView';
import { WorldIndicesBondsView } from './components/views/WorldIndicesBondsView';
import { TechnicalSummaryPivotsView } from './components/views/TechnicalSummaryPivotsView';
import { CalendarHubView } from './components/views/CalendarHubView';
import { MarketScreenersView } from './components/views/MarketScreenersView';
import { CalculatorsView } from './components/views/CalculatorsView';
import { PortfolioAlertsView } from './components/views/PortfolioAlertsView';
import { CommunitySentimentView } from './components/views/CommunitySentimentView';
import { SignalDetailModal } from './components/common/SignalDetailModal';
import { VipUpgradeModal } from './components/common/VipUpgradeModal';
import { InstrumentSearchModal } from './components/common/InstrumentSearchModal';
import { INITIAL_SIGNALS, INITIAL_INSTRUMENTS } from './data/marketData';
import { Signal, Instrument } from './types/market';
import { globalMarketStreamer } from './services/marketDataStream';

const MainTerminal: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const [activeView, setActiveView] = useState<string>('overview');
  const [signals, setSignals] = useState<Signal[]>(INITIAL_SIGNALS);
  const [instruments, setInstruments] = useState<Instrument[]>(INITIAL_INSTRUMENTS);
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const [selectedChartInstrument, setSelectedChartInstrument] = useState<string>('BINANCE:BTCUSDT');
  
  // Modals
  const [vipModalOpen, setVipModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Subscribe to live real-time price stream (Binance WebSocket + live micro-tick engine matching TradingView)
  useEffect(() => {
    const unsubscribe = globalMarketStreamer.subscribe((updatedList) => {
      setInstruments(updatedList);
    });
    return () => unsubscribe();
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K to launch search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle selecting instrument from search or tables
  const handleSelectInstrument = (inst: Instrument) => {
    setSelectedChartInstrument(inst.tradingViewSymbol);
    setActiveView('charts');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center text-slate-400 font-mono text-xs space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
        <span>Initializing COINPIPS Terminal & Firebase session...</span>
      </div>
    );
  }

  // If visitor is unauthenticated, show advanced institutional Email-Only Login Dashboard
  if (!currentUser) {
    return (
      <LoginDashboard
        liveInstruments={instruments}
      />
    );
  }

  // Authenticated Financial Markets Terminal
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans">
      {/* Top Scrolling TradingView Ticker Tape */}
      <TradingViewTickerTape />

      {/* Main Terminal Header */}
      <Header
        activeView={activeView}
        onNavigate={(viewId) => setActiveView(viewId)}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenVipModal={() => setVipModalOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Terminal Workspace Body: Sidebar + Main Dynamic View */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeView={activeView}
          onSelectView={(viewId) => setActiveView(viewId)}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          signalsCount={{
            crypto: signals.filter(s => s.assetClass === 'crypto').length,
            forex: signals.filter(s => s.assetClass === 'forex').length,
            stock: signals.filter(s => s.assetClass === 'stock').length,
            indices: signals.filter(s => s.assetClass === 'indices').length,
            commodities: signals.filter(s => s.assetClass === 'commodities').length,
            vip: signals.filter(s => s.isVip).length
          }}
        />

        <main className="flex-1 overflow-y-auto bg-[#07090e]">
          {activeView === 'overview' && (
            <OverviewView
              signals={signals}
              onSelectSignal={(s) => setSelectedSignal(s)}
              onNavigate={(v) => setActiveView(v)}
              onSelectInstrument={handleSelectInstrument}
            />
          )}

          {activeView === 'search' && (
            <MarketSearchView
              onSelectSignal={(s) => setSelectedSignal(s)}
            />
          )}

          {activeView === 'crypto-signals' && (
            <CryptoSignalsView
              signals={signals}
              onSelectSignal={(s) => setSelectedSignal(s)}
              onSelectInstrument={handleSelectInstrument}
              onOpenVipModal={() => setVipModalOpen(true)}
            />
          )}

          {activeView === 'forex-signals' && (
            <ForexSignalsView
              signals={signals}
              onSelectSignal={(s) => setSelectedSignal(s)}
              onSelectInstrument={handleSelectInstrument}
              onOpenVipModal={() => setVipModalOpen(true)}
            />
          )}

          {activeView === 'stock-signals' && (
            <StockSignalsView
              signals={signals}
              onSelectSignal={(s) => setSelectedSignal(s)}
              onSelectInstrument={handleSelectInstrument}
              onOpenVipModal={() => setVipModalOpen(true)}
            />
          )}

          {activeView === 'indices-signals' && (
            <IndicesSignalsView
              signals={signals}
              onSelectSignal={(s) => setSelectedSignal(s)}
              onSelectInstrument={handleSelectInstrument}
              onOpenVipModal={() => setVipModalOpen(true)}
            />
          )}

          {activeView === 'commodities' && (
            <CommoditiesView
              signals={signals}
              onSelectSignal={(s) => setSelectedSignal(s)}
              onSelectInstrument={handleSelectInstrument}
              onOpenVipModal={() => setVipModalOpen(true)}
            />
          )}

          {activeView === 'vip-signals' && (
            <VipSignalsView
              signals={signals}
              onSelectSignal={(s) => setSelectedSignal(s)}
              onOpenVipModal={() => setVipModalOpen(true)}
            />
          )}

          {/* Investing.com Signature Suite Views */}
          {activeView === 'world-indices-bonds' && (
            <WorldIndicesBondsView />
          )}

          {activeView === 'technical-summary-pivots' && (
            <TechnicalSummaryPivotsView
              liveInstruments={instruments}
            />
          )}

          {activeView === 'calendar-hub' && (
            <CalendarHubView />
          )}

          {activeView === 'market-screeners' && (
            <MarketScreenersView />
          )}

          {activeView === 'calculators' && (
            <CalculatorsView />
          )}

          {activeView === 'portfolio-alerts' && (
            <PortfolioAlertsView
              liveInstruments={instruments}
            />
          )}

          {activeView === 'community-sentiment' && (
            <CommunitySentimentView />
          )}

          {activeView === 'technical-analysis' && (
            <TechnicalAnalysisView />
          )}

          {activeView === 'charts' && (
            <ChartsView
              initialSymbol={selectedChartInstrument}
            />
          )}

          {activeView === 'watchlist' && (
            <WatchlistView
              onSelectInstrument={handleSelectInstrument}
              onOpenSearch={() => setSearchModalOpen(true)}
            />
          )}

          {activeView === 'economic-calendar' && (
            <EconomicCalendarView />
          )}

          {activeView === 'market-news' && (
            <MarketNewsView />
          )}

          {activeView === 'account' && (
            <MyAccountView
              onOpenVipModal={() => setVipModalOpen(true)}
            />
          )}

          {activeView === 'support' && (
            <SupportView />
          )}

          {activeView === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* Modals */}
      {selectedSignal && (
        <SignalDetailModal
          signal={selectedSignal}
          onClose={() => setSelectedSignal(null)}
          onOpenVipModal={() => setVipModalOpen(true)}
        />
      )}

      {vipModalOpen && (
        <VipUpgradeModal
          isOpen={vipModalOpen}
          onClose={() => setVipModalOpen(false)}
        />
      )}

      {searchModalOpen && (
        <InstrumentSearchModal
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
          onSelectInstrument={handleSelectInstrument}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <WatchlistProvider>
        <MainTerminal />
      </WatchlistProvider>
    </AuthProvider>
  );
}
