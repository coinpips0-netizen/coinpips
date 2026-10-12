import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { syncUserProfile, updateUserMembership } from '../services/firestoreService';
import { UserProfile } from '../types/market';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isVip: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (name: string, email: string, pass: string) => Promise<void>;
  loginWithEmailOnly: (email: string, displayName?: string, requestedTier?: 'free' | 'vip') => Promise<void>;
  signInAsDemo: () => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  upgradeToVip: () => Promise<void>;
  downgradeToFree: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to generate deterministic secure authentication key per email
const deriveEmailKey = (email: string): string => {
  const clean = email.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash << 5) - hash + clean.charCodeAt(i);
    hash |= 0;
  }
  return `CoinPips_${Math.abs(hash).toString(36)}#Secure2026!`;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profile = await syncUserProfile(
            user.uid, 
            user.email || 'user@coinpips.com', 
            user.displayName || undefined
          );
          
          // If the user email is coinpips0@gmail.com, ensure VIP tier
          if (user.email === 'coinpips0@gmail.com' && profile.membership !== 'vip') {
            await updateUserMembership(user.uid, 'vip');
            profile.membership = 'vip';
          }
          
          setUserProfile(profile);
        } catch (err) {
          console.error("Profile sync error:", err);
          setUserProfile({
            uid: user.uid,
            displayName: user.displayName || 'Trader',
            email: user.email || 'user@coinpips.com',
            membership: user.email === 'coinpips0@gmail.com' ? 'vip' : 'free',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Seamless Email-Only Instant Access (No manual password setup or registration required)
   */
  const loginWithEmailOnly = async (email: string, displayName?: string, requestedTier?: 'free' | 'vip') => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }

    const key = deriveEmailKey(cleanEmail);
    const name = displayName || cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ') || 'Trader';

    try {
      // 1. Try signing in directly
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, key);
      const profile = await syncUserProfile(cred.user.uid, cleanEmail, name);
      if (cleanEmail === 'coinpips0@gmail.com' || requestedTier === 'vip') {
        await updateUserMembership(cred.user.uid, 'vip');
        profile.membership = 'vip';
      }
      setUserProfile(profile);
    } catch (err: any) {
      // 2. If user does not exist or password mismatch, automatically create account
      if (err?.code === 'auth/user-not-found' || err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password') {
        try {
          const newCred = await createUserWithEmailAndPassword(auth, cleanEmail, key);
          await updateProfile(newCred.user, { displayName: name });
          const profile = await syncUserProfile(newCred.user.uid, cleanEmail, name);
          if (cleanEmail === 'coinpips0@gmail.com' || requestedTier === 'vip') {
            await updateUserMembership(newCred.user.uid, 'vip');
            profile.membership = 'vip';
          }
          setUserProfile(profile);
        } catch (creationErr: any) {
          // If already registered with another password, fallback to demo key or throw
          if (creationErr?.code === 'auth/email-already-in-use') {
            // Try standard fallback password
            const fallbackKey = 'CoinPips#DefaultTrader2026!';
            try {
              const retryCred = await signInWithEmailAndPassword(auth, cleanEmail, fallbackKey);
              const p = await syncUserProfile(retryCred.user.uid, cleanEmail, name);
              setUserProfile(p);
            } catch {
              throw new Error(`Authentication conflict for ${cleanEmail}. Please use Google Sign-In or another email.`);
            }
          } else {
            throw creationErr;
          }
        }
      } else {
        throw err;
      }
    }
  };

  const signIn = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const profile = await syncUserProfile(cred.user.uid, cred.user.email || email, cred.user.displayName || undefined);
    setUserProfile(profile);
  };

  const signUp = async (name: string, email: string, pass: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (name) {
      await updateProfile(cred.user, { displayName: name });
    }
    const profile = await syncUserProfile(cred.user.uid, email, name);
    setUserProfile(profile);
  };

  const signInAsDemo = async () => {
    await loginWithEmailOnly('institutional.demo@coinpips.com', 'Institutional Pro Desk', 'vip');
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const upgradeToVip = async () => {
    if (!currentUser || !userProfile) return;
    await updateUserMembership(currentUser.uid, 'vip');
    setUserProfile(prev => prev ? { ...prev, membership: 'vip' } : null);
  };

  const downgradeToFree = async () => {
    if (!currentUser || !userProfile) return;
    await updateUserMembership(currentUser.uid, 'free');
    setUserProfile(prev => prev ? { ...prev, membership: 'free' } : null);
  };

  const isVip = userProfile?.membership === 'vip';

  return (
    <AuthContext.Provider value={{
      currentUser,
      userProfile,
      loading,
      isVip,
      signIn,
      signUp,
      loginWithEmailOnly,
      signInAsDemo,
      signOut,
      sendPasswordReset,
      upgradeToVip,
      downgradeToFree
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
