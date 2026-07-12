"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "./types";
import { products, accessoryCatalog } from "./products";

interface StoreContextValue {
  cart: CartItem[];
  wishlist: string[];
  compare: string[];
  searchOpen: boolean;
  megaMenuOpen: boolean;
  cartOpen: boolean;
  recentSearches: string[];
  addToCart: (item: Omit<CartItem, "id" | "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleWishlist: (productId: string) => void;
  toggleCompare: (productId: string) => void;
  clearCompare: () => void;
  setSearchOpen: (open: boolean) => void;
  setMegaMenuOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
  addRecentSearch: (query: string) => void;
  cartTotal: number;
  cartCount: number;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("eride-cart");
      const savedWishlist = localStorage.getItem("eride-wishlist");
      const savedCompare = localStorage.getItem("eride-compare");
      const savedSearches = localStorage.getItem("eride-searches");
      if (saved) setCart(JSON.parse(saved));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      if (savedCompare) setCompare(JSON.parse(savedCompare));
      if (savedSearches) setRecentSearches(JSON.parse(savedSearches));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("eride-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("eride-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("eride-compare", JSON.stringify(compare));
  }, [compare]);

  useEffect(() => {
    localStorage.setItem("eride-searches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  const addToCart = useCallback((item: Omit<CartItem, "id" | "quantity">) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.productId === item.productId && JSON.stringify(i.configuration) === JSON.stringify(item.configuration)
      );
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, id: crypto.randomUUID(), quantity: 1 }];
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const toggleCompare = useCallback((productId: string) => {
    setCompare((prev) => {
      if (prev.includes(productId)) return prev.filter((id) => id !== productId);
      if (prev.length >= 4) return [...prev.slice(1), productId];
      return [...prev, productId];
    });
  }, []);

  const clearCompare = useCallback(() => setCompare([]), []);

  const addRecentSearch = useCallback((query: string) => {
    if (!query.trim()) return;
    setRecentSearches((prev) =>
      [query, ...prev.filter((s) => s !== query)].slice(0, 5)
    );
  }, []);

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      compare,
      searchOpen,
      megaMenuOpen,
      cartOpen,
      recentSearches,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleWishlist,
      toggleCompare,
      clearCompare,
      setSearchOpen,
      setMegaMenuOpen,
      setCartOpen,
      addRecentSearch,
      cartTotal,
      cartCount,
    }),
    [
      cart,
      wishlist,
      compare,
      searchOpen,
      megaMenuOpen,
      cartOpen,
      recentSearches,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleWishlist,
      toggleCompare,
      clearCompare,
      addRecentSearch,
      cartTotal,
      cartCount,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function getSearchResults(query: string) {
  const q = query.toLowerCase();
  if (!q) return [];

  const productResults = products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    )
    .map((p) => ({
      id: p.id,
      type: "product" as const,
      name: p.name,
      subtitle: p.tagline,
      image: p.images[0],
      href: `/product/${p.slug}`,
    }));

  const accessoryResults = accessoryCatalog
    .filter((a) => a.name.toLowerCase().includes(q))
    .map((a) => ({
      id: a.id,
      type: "accessory" as const,
      name: a.name,
      subtitle: `€${a.price}`,
      image: a.image,
      href: `/shop?category=accessories`,
    }));

  return [...productResults, ...accessoryResults].slice(0, 8);
}
