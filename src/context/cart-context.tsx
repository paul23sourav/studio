'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { CartItem, Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, size?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const items = localStorage.getItem('cart');
      if (items) {
        setCartItems(JSON.parse(items));
      }
    } catch (error) {
      console.error('Failed to parse cart from localStorage', error);
      setCartItems([]);
    }
  }, []);

  const updateLocalStorage = useCallback((items: CartItem[]) => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart to localStorage', error);
    }
  }, []);

  const addToCart = (product: Product, size?: string) => {
    setCartItems(prevItems => {
      const itemKey = size ? `${product.id}-${size}` : product.id;
      const existingItem = prevItems.find(item => item.id === itemKey);
      let newItems;
      if (existingItem) {
        newItems = prevItems.map(item =>
          item.id === itemKey ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newItems = [...prevItems, { 
          id: itemKey, 
          name: product.name, 
          price: product.price, 
          imageUrl: product.imageUrl, 
          quantity: 1, 
          size 
        }];
      }
      updateLocalStorage(newItems);
      toast({
        title: "Added to cart",
        description: `${product.name} is now in your cart.`,
      });
      return newItems;
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== itemId);
      updateLocalStorage(newItems);
      return newItems;
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setCartItems(prevItems => {
      if (quantity <= 0) {
        const itemToRemove = prevItems.find(item => item.id === itemId);
        if (itemToRemove) {
          toast({
            title: "Item removed",
            description: `${itemToRemove.name} has been removed from your cart.`,
          });
        }
        const newItems = prevItems.filter(item => item.id !== itemId);
        updateLocalStorage(newItems);
        return newItems;
      }
      const newItems = prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      updateLocalStorage(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    updateLocalStorage([]);
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
