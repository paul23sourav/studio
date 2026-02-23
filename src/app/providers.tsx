'use client';

import { CartProvider } from '@/context/cart-context';
import { CurrencyProvider } from '@/context/currency-context';
import { FirebaseClientProvider } from '@/firebase';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <FirebaseClientProvider>
      <CurrencyProvider>
        <CartProvider>{children}</CartProvider>
      </CurrencyProvider>
    </FirebaseClientProvider>
  );
}
