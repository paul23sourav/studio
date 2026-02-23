'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
} from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

interface FirebaseProviderProps {
  children: ReactNode;
  value: {
    app: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
  } | null;
}

export function FirebaseProvider({ children, value }: FirebaseProviderProps) {
  const memoizedValue = useMemo(() => {
    if (!value) return { app: null, auth: null, firestore: null };
    return {
      app: value.app,
      auth: value.auth,
      firestore: value.firestore,
    };
  }, [value]);

  return (
    <FirebaseContext.Provider value={memoizedValue}>
        <FirebaseErrorListener />
        {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const useFirebaseApp = () => useFirebase().app;
export const useAuth = () => useFirebase().auth;
export const useFirestore = () => useFirebase().firestore;
