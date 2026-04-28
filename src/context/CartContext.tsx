import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Artwork, CartLine } from '../types';

interface CartState {
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  add: (artwork: Artwork) => void;
  remove: (artworkId: string) => void;
  clear: () => void;
  has: (artworkId: string) => boolean;
}

const CartContext = createContext<CartState | null>(null);

const STORAGE_KEY = 'studio.cart.v1';

interface PersistedLine {
  artwork: Artwork;
  quantity: number;
}

function loadInitial(): CartLine[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PersistedLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(loadInitial);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const value = useMemo<CartState>(() => {
    const count = lines.reduce((acc, l) => acc + l.quantity, 0);
    const subtotalCents = lines.reduce((acc, l) => acc + l.artwork.price_cents * l.quantity, 0);
    return {
      lines,
      count,
      subtotalCents,
      has: (id: string) => lines.some((l) => l.artwork.id === id),
      add: (artwork: Artwork) =>
        setLines((prev) => {
          if (prev.some((l) => l.artwork.id === artwork.id)) return prev;
          return [...prev, { artwork, quantity: 1 }];
        }),
      remove: (artworkId: string) =>
        setLines((prev) => prev.filter((l) => l.artwork.id !== artworkId)),
      clear: () => setLines([]),
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
