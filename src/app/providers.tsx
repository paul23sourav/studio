'use client';

import { CartProvider } from '@/context/cart-context';
import { CurrencyProvider } from '@/context/currency-context';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CurrencyProvider>
      <CartProvider>{children}</CartProvider>
    </CurrencyProvider>
  );
}
