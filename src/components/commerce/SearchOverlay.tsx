"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Search, ArrowRight, TrendingUp } from "lucide-react";
import { useStore, getSearchResults } from "@/lib/store";
import { trendingSearches } from "@/lib/products";
import type { SearchResult } from "@/lib/types";

export function SearchOverlay() {
  const { searchOpen, setSearchOpen, recentSearches, addRecentSearch } = useStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  useEffect(() => {
    setResults(getSearchResults(query));
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
      if (e.key === "Escape") setSearchOpen(false);
      if (!searchOpen) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && results[activeIndex]) {
        addRecentSearch(query);
        setSearchOpen(false);
        window.location.href = results[activeIndex].href;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen, results, activeIndex, query, setSearchOpen, addRecentSearch]);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      addRecentSearch(query || result.name);
      setSearchOpen(false);
    },
    [query, addRecentSearch, setSearchOpen]
  );

  const displayItems = query ? results : [];

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-background/90 pt-[15vh] backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-full max-w-2xl section-padding"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative">
              <Search className="absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-foreground-secondary" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search vehicles, accessories..."
                className="w-full rounded-2xl border border-border bg-card py-5 pr-6 pl-14 text-lg outline-none transition-colors focus:border-accent/50"
              />
              <kbd className="absolute top-1/2 right-5 hidden -translate-y-1/2 rounded-lg border border-border px-2 py-1 text-xs text-foreground-secondary md:block">
                ESC
              </kbd>
            </div>

            <div className="mt-6">
              {!query && (
                <>
                  {recentSearches.length > 0 && (
                    <div className="mb-6">
                      <span className="mb-3 block text-xs uppercase tracking-[0.2em] text-foreground-secondary">
                        Recent
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((s) => (
                          <button
                            key={s}
                            onClick={() => setQuery(s)}
                            className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-card"
                            data-cursor="pointer"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <span className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground-secondary">
                      <TrendingUp className="h-3 w-3" /> Trending
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((s) => (
                        <button
                          key={s}
                          onClick={() => setQuery(s)}
                          className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-card"
                          data-cursor="pointer"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {displayItems.length > 0 && (
                <div className="space-y-1">
                  {displayItems.map((result, i) => (
                    <Link
                      key={result.id}
                      href={result.href}
                      onClick={() => handleSelect(result)}
                      className={`flex items-center gap-4 rounded-xl p-3 transition-colors ${
                        i === activeIndex ? "bg-card" : "hover:bg-card/50"
                      }`}
                      data-cursor="pointer"
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={result.image}
                          alt={result.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1">
                        <span className="font-medium">{result.name}</span>
                        <span className="mt-0.5 block text-sm text-foreground-secondary">
                          {result.subtitle}
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-foreground-secondary" />
                    </Link>
                  ))}
                </div>
              )}

              {query && displayItems.length === 0 && (
                <p className="py-8 text-center text-foreground-secondary">
                  No results for &ldquo;{query}&rdquo;
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
