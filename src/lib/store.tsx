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

interface StoreContextValue {
  cart: CartItem[];
  wishlist: string[];
  compare: string[];
  searchOpen: boolean;
  megaMenuOpen: boolean;
  cartOpen: boolean;
  recentSearches: string[];
  cartSyncing: boolean;
  addToCart: (item: Omit<CartItem, "id" | "quantity"> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleRequestOffer: (id: string, requestOffer: boolean) => void;
  toggleWishlist: (productId: string) => void;
  toggleCompare: (productId: string) => void;
  clearCompare: () => void;
  setSearchOpen: (open: boolean) => void;
  setMegaMenuOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
  addRecentSearch: (query: string) => void;
  syncCart: () => Promise<void>;
  cartTotal: number;
  cartCount: number;
}

const StoreContext = createContext<StoreContextValue | null>(null);

async function syncCartFromServer() {
  try {
    const res = await fetch("/api/cart");
    if (!res.ok) return null;
    const data = await res.json();
    return data.items as CartItem[];
  } catch {
    return null;
  }
}

async function migrateLocalCartToServer() {
  try {
    const saved = localStorage.getItem("eride-cart");
    if (!saved) return null;
    const localItems = JSON.parse(saved) as CartItem[];
    if (!localItems.length) return null;

    for (const item of localItems) {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.productId,
          quantity: item.quantity,
          configuration: item.configuration,
          requestOffer: item.requestOffer ?? false,
        }),
      });
    }
    localStorage.removeItem("eride-cart");
    return syncCartFromServer();
  } catch {
    return null;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartSyncing, setCartSyncing] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("eride-wishlist");
      const savedCompare = localStorage.getItem("eride-compare");
      const savedSearches = localStorage.getItem("eride-searches");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      if (savedCompare) setCompare(JSON.parse(savedCompare));
      if (savedSearches) setRecentSearches(JSON.parse(savedSearches));
    } catch {
      /* ignore */
    }

    syncCartFromServer().then(async (items) => {
      if (items && items.length > 0) {
        setCart(items);
        localStorage.removeItem("eride-cart");
        return;
      }
      const migrated = await migrateLocalCartToServer();
      if (migrated) setCart(migrated);
    });
  }, []);

  useEffect(() => {
    if (cart.length === 0) localStorage.removeItem("eride-cart");
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

  const addToCart = useCallback(
    async (item: Omit<CartItem, "id" | "quantity"> & { quantity?: number }) => {
      setCartOpen(true);
      setCartSyncing(true);
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: item.productId,
            quantity: item.quantity ?? 1,
            configuration: item.configuration,
            requestOffer: item.requestOffer ?? false,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setCart(data.items);
          return;
        }
      } catch {
        /* fallback below */
      } finally {
        setCartSyncing(false);
      }

      setCart((prev) => {
        const existing = prev.find(
          (i) =>
            i.productId === item.productId &&
            JSON.stringify(i.configuration) === JSON.stringify(item.configuration)
        );
        if (existing) {
          return prev.map((i) =>
            i.id === existing.id ? { ...i, quantity: i.quantity + (item.quantity ?? 1) } : i
          );
        }
        return [...prev, { ...item, id: crypto.randomUUID(), quantity: item.quantity ?? 1 }];
      });
    },
    []
  );

  const removeFromCart = useCallback(async (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: id }),
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data.items);
      }
    } catch {
      /* local state already updated */
    }
  }, []);

  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
    try {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: id, quantity }),
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data.items);
      }
    } catch {
      /* local state already updated */
    }
  }, [removeFromCart]);

  const toggleRequestOffer = useCallback(async (id: string, requestOffer: boolean) => {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, requestOffer } : i)));
    try {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: id, requestOffer }),
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data.items);
      }
    } catch {
      /* ignore */
    }
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

  const syncCart = useCallback(async () => {
    const items = await syncCartFromServer();
    setCart(items ?? []);
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
      cartSyncing,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleRequestOffer,
      toggleWishlist,
      toggleCompare,
      clearCompare,
      setSearchOpen,
      setMegaMenuOpen,
      setCartOpen,
      addRecentSearch,
      syncCart,
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
      cartSyncing,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleRequestOffer,
      toggleWishlist,
      toggleCompare,
      clearCompare,
      addRecentSearch,
      syncCart,
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

export async function fetchSearchResults(query: string) {
  if (!query.trim()) return [];
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? []) as import("./types").SearchResult[];
  } catch {
    return [];
  }
}
