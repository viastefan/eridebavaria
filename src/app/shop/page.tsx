"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { products } from "@/lib/products";
import { labels } from "@/lib/labels";
import { ProductCard } from "@/components/commerce/ProductCard";
import {
  ShopFilters,
  filterProducts,
  defaultFilters,
  type FilterState,
} from "@/components/commerce/ShopFilters";

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...defaultFilters,
    types: categoryParam ? [categoryParam] : [],
  }));

  const filtered = useMemo(
    () => filterProducts(products, filters),
    [filters]
  );

  return (
    <main className="min-h-screen pt-32 pb-24">
      <div className="section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-xs uppercase tracking-[0.25em] text-accent">
            Kollektion
          </span>
          <h1 className="heading-display mt-4 text-gradient">Entdecken</h1>
          <p className="mt-4 max-w-lg text-foreground-secondary">
            Echte E-Fahrzeuge. Geprüft. Beraten. Für dich kuratiert.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[280px_1fr]">
          <ShopFilters
            filters={filters}
            onChange={setFilters}
            resultCount={filtered.length}
          />
          <div>
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <p className="text-sm text-foreground-secondary">
                {filtered.length} {filtered.length === 1 ? "Fahrzeug" : "Fahrzeuge"}
              </p>
            </div>
            {filtered.length === 0 ? (
              <div className="py-24 text-center text-foreground-secondary">
                {labels.noMatchFilters}
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ShopContent />
    </Suspense>
  );
}
