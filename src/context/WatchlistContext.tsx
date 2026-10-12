import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { WatchlistItem, Instrument } from '../types/market';
import { addToWatchlist, removeFromWatchlist, subscribeToWatchlist } from '../services/firestoreService';

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  isWatched: (symbol: string) => boolean;
  toggleWatchlist: (instrument: { symbol: string; name: string; assetClass: any }) => Promise<void>;
  loading: boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!currentUser) {
      setWatchlist([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToWatchlist(
      currentUser.uid,
      (items) => {
        setWatchlist(items);
        setLoading(false);
      },
      (err) => {
        console.warn('Watchlist listener warning:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const isWatched = (symbol: string) => {
    return watchlist.some(item => item.symbol === symbol);
  };

  const toggleWatchlist = async (instrument: { symbol: string; name: string; assetClass: any }) => {
    if (!currentUser) return;
    const exists = isWatched(instrument.symbol);
    if (exists) {
      await removeFromWatchlist(currentUser.uid, instrument.symbol);
    } else {
      await addToWatchlist({
        userId: currentUser.uid,
        symbol: instrument.symbol,
        name: instrument.name,
        assetClass: instrument.assetClass,
        addedAt: new Date().toISOString()
      });
    }
  };

  return (
    <WatchlistContext.Provider value={{
      watchlist,
      isWatched,
      toggleWatchlist,
      loading
    }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
