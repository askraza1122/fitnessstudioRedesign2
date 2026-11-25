"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getProduct, type Product } from "@/lib/data";

export type CartItem = { slug: string; qty: number };

type CartState = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (slug: string, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  lines: { product: Product; qty: number; lineTotal: number }[];
};

const CartContext = createContext<CartState>({
  items: [],
  count: 0,
  subtotal: 0,
  add: () => {},
  remove: () => {},
  setQty: () => {},
  clear: () => {},
  lines: [],
});

export function useCart() {
  return useContext(CartContext);
}

const STORAGE_KEY = "fitness-studio-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore corrupt cart */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);

  const add = (slug: string, qty = 1) =>
    setItems((prev) => {
      const found = prev.find((i) => i.slug === slug);
      if (found)
        return prev.map((i) => (i.slug === slug ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { slug, qty }];
    });

  const remove = (slug: string) => setItems((prev) => prev.filter((i) => i.slug !== slug));

  const setQty = (slug: string, qty: number) =>
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.slug !== slug)
        : prev.map((i) => (i.slug === slug ? { ...i, qty } : i))
    );

  const clear = () => setItems([]);

  const lines = items
    .map((i) => {
      const product = getProduct(i.slug);
      if (!product) return null;
      return { product, qty: i.qty, lineTotal: product.price * i.qty };
    })
    .filter((l): l is { product: Product; qty: number; lineTotal: number } => l !== null);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);

  return (
    <CartContext.Provider
      value={{ items, count, subtotal, add, remove, setQty, clear, lines }}
    >
      {children}
    </CartContext.Provider>
  );
}
