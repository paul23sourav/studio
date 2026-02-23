'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

type Currency = 'USD' | 'INR';

const CONVERSION_RATES: Record<Currency, number> = {
  USD: 1,
  INR: 83.5,
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  INR: '₹',
};

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatCurrency: (amountInUsd: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<Currency>('INR');

  useEffect(() => {
    try {
      const storedCurrency = localStorage.getItem('currency') as Currency | null;
      if (storedCurrency && CONVERSION_RATES[storedCurrency]) {
        setCurrencyState(storedCurrency);
      }
    } catch (error) {
      console.error('Failed to parse currency from localStorage', error);
    }
  }, []);

  const setCurrency = useCallback((newCurrency: Currency) => {
    if (!CONVERSION_RATES[newCurrency]) return;
    try {
      localStorage.setItem('currency', newCurrency);
      setCurrencyState(newCurrency);
    } catch (error) {
      console.error('Failed to save currency to localStorage', error);
    }
  }, []);
  
  const formatCurrency = useCallback((amountInUsd: number) => {
    const rate = CONVERSION_RATES[currency];
    const symbol = CURRENCY_SYMBOLS[currency];
    const convertedAmount = amountInUsd * rate;
    return `${symbol}${convertedAmount.toFixed(2)}`;
  }, [currency]);


  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};
