"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Search, ArrowRight, TrendingUp } from "lucide-react";
import { useStore, fetchSearchResults } from "@/lib/store";
import { trendingSearches } from "@/lib/products";
import { labels } from "@/lib/labels";
import type { SearchResult } from "@/lib/types";

export function SearchOverlay() {
  const { searchOpen, setSearchOpen, recentSearches, addRecentSearch } = useStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
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
    if (!query.trim()) {
      setResults([]);
      setActiveIndex(0);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      const items = await fetchSearchResults(query);
      setResults(items);
      setActiveIndex(0);
      setLoading(false);
    }, 250);

    return () => clearTimeout(timer);
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
          className="search-overlay fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]"
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
                placeholder={labels.searchPlaceholder}
                className="search-overlay__input"
              />
              <kbd className="search-overlay__kbd absolute top-1/2 right-5 hidden -translate-y-1/2 md:block">
                ESC
              </kbd>
            </div>

            <div className="mt-6">
              {!query && (
                <>
                  {recentSearches.length > 0 && (
                    <div className="mb-6">
                      <span className="mb-3 block text-xs uppercase tracking-[0.2em] text-foreground-secondary">
                        {labels.recent}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setQuery(s)}
                            className="search-overlay__chip"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <span className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground-secondary">
                      <TrendingUp className="h-3 w-3" /> {labels.trending}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setQuery(s)}
                          className="search-overlay__chip"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {loading && query && (
                <p className="py-4 text-center text-sm text-foreground-secondary">Suche …</p>
              )}

              {!loading && displayItems.length > 0 && (
                <div className="space-y-1">
                  {displayItems.map((result, i) => (
                    <Link
                      key={result.id}
                      href={result.href}
                      onClick={() => handleSelect(result)}
                      className={`search-overlay__result ${i === activeIndex ? "is-active" : ""}`}
                    >
                      {result.image ? (
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-card">
                          <Image
                            src={result.image}
                            alt={result.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 shrink-0 rounded-lg bg-card" />
                      )}
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

              {query && !loading && displayItems.length === 0 && (
                <p className="py-8 text-center text-foreground-secondary">
                  {labels.noResults} &ldquo;{query}&rdquo;
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
