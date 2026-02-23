'use client';

import { ReactNode, useMemo } from 'react';
import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const firebaseServices = useMemo(() => {
    if (typeof window !== 'undefined') {
      return initializeFirebase();
    }
    return null;
  }, []);

  return <FirebaseProvider value={firebaseServices}>{children}</FirebaseProvider>;
}
