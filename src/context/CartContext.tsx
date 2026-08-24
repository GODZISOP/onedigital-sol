'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CheckoutData } from '@/app/checkout/types';

export type CartItem = {
  id: string;
  type: 'custom' | 'product';
  productId?: string | number;
  name: string;
  price: number;
  totalQuantity: number;
  image: string;
  checkoutData?: CheckoutData; // Full payload for compatibility with existing checkout
};

interface CartContextType {
  items: CartItem[];
  hasCustomDesign: boolean;
  setHasCustomDesign: (val: boolean) => void;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hasCustomDesign, setHasCustomDesign] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const checkCustomDesign = () => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = sessionStorage.getItem('checkoutState');
      if (stored) {
        const parsed = JSON.parse(stored);
        const qty = parsed.quantities 
          ? Object.values(parsed.quantities).reduce((a: any, b: any) => a + (parseInt(b as string) || 0), 0) 
          : 0;
        return !!(parsed.frontImage || parsed.backImage || (qty as number) > 0);
      }
    } catch (e) {}
    return false;
  };

  useEffect(() => {
    const stored = sessionStorage.getItem('globalCart');
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    setHasCustomDesign(checkCustomDesign());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      sessionStorage.setItem('globalCart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const newItem = { ...item, id: Math.random().toString(36).substring(2, 9) };
    setItems((prev) => [...prev, newItem]);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    setHasCustomDesign(false);
  };

  const cartCount = items.length + (hasCustomDesign ? 1 : 0);

  return (
    <CartContext.Provider value={{ items, hasCustomDesign, setHasCustomDesign, addToCart, removeFromCart, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
