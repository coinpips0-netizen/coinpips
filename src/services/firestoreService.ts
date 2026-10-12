import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  deleteDoc,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase/config';
import { UserProfile, WatchlistItem, SupportTicket, Signal } from '../types/market';

/**
 * Get or create User Profile in Firestore
 */
export async function syncUserProfile(uid: string, email: string, displayName?: string): Promise<UserProfile> {
  const userRef = doc(db, 'users', uid);
  const path = `users/${uid}`;
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        uid,
        email: data.email || email,
        displayName: data.displayName || displayName || 'Trader',
        membership: (data.membership as 'free' | 'vip') || 'free',
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString()
      };
    } else {
      const newProfile: UserProfile = {
        uid,
        email,
        displayName: displayName || (email.split('@')[0]) || 'Trader',
        membership: 'free',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(userRef, newProfile);
      return newProfile;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Upgrade or change membership tier
 */
export async function updateUserMembership(uid: string, membership: 'free' | 'vip'): Promise<void> {
  const userRef = doc(db, 'users', uid);
  const path = `users/${uid}`;
  try {
    await updateDoc(userRef, {
      membership,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Add instrument to user watchlist
 */
export async function addToWatchlist(item: WatchlistItem): Promise<void> {
  const path = `users/${item.userId}/watchlist/${item.symbol}`;
  const itemRef = doc(db, 'users', item.userId, 'watchlist', item.symbol);
  try {
    await setDoc(itemRef, {
      userId: item.userId,
      symbol: item.symbol,
      name: item.name,
      assetClass: item.assetClass,
      addedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Remove instrument from user watchlist
 */
export async function removeFromWatchlist(userId: string, symbol: string): Promise<void> {
  const path = `users/${userId}/watchlist/${symbol}`;
  const itemRef = doc(db, 'users', userId, 'watchlist', symbol);
  try {
    await deleteDoc(itemRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Subscribe to user watchlist in real-time
 */
export function subscribeToWatchlist(
  userId: string, 
  onUpdate: (items: WatchlistItem[]) => void,
  onError?: (err: Error) => void
): () => void {
  const path = `users/${userId}/watchlist`;
  const colRef = collection(db, 'users', userId, 'watchlist');

  const unsubscribe = onSnapshot(colRef, (snapshot) => {
    const list: WatchlistItem[] = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      list.push({
        userId: data.userId || userId,
        symbol: data.symbol,
        name: data.name,
        assetClass: data.assetClass,
        addedAt: data.addedAt
      });
    });
    onUpdate(list);
  }, (error) => {
    try {
      handleFirestoreError(error, OperationType.GET, path);
    } catch (e) {
      if (onError && e instanceof Error) onError(e);
    }
  });

  return unsubscribe;
}

/**
 * Create a new customer support ticket
 */
export async function createSupportTicket(ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>): Promise<string> {
  const id = `TCK-${Date.now().toString().slice(-6)}`;
  const path = `supportTickets/${id}`;
  const ticketRef = doc(db, 'supportTickets', id);

  const payload: SupportTicket = {
    ...ticket,
    id,
    status: 'open',
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(ticketRef, payload);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch support tickets for current user
 */
export async function fetchUserSupportTickets(userId: string): Promise<SupportTicket[]> {
  const path = 'supportTickets';
  try {
    const q = query(collection(db, 'supportTickets'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const tickets: SupportTicket[] = [];
    snap.forEach(d => tickets.push(d.data() as SupportTicket));
    return tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}
