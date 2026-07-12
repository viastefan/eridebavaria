"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { products } from "@/lib/products";
import type { Product } from "@/lib/types";

export interface FilterState {
  types: string[];
  priceMin: number;
  priceMax: number;
  rangeMin: number;
  seats: number[];
  availability: string[];
}

const defaultFilters: FilterState = {
  types: [],
  priceMin: 0,
  priceMax: 50000,
  rangeMin: 0,
  seats: [],
  availability: [],
};

const vehicleTypes = [
  { id: "kleinwagen", label: "Elektro Kleinwagen" },
  { id: "transporter", label: "Transporter" },
  { id: "quads", label: "Quads" },
  { id: "motorraeder", label: "Motorräder" },
  { id: "mopedauto", label: "Mopedauto" },
  { id: "roller", label: "Roller & Scooter" },
];

interface ShopFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  resultCount: number;
}

export function ShopFilters({ filters, onChange, resultCount }: ShopFiltersProps) {
  const [open, setOpen] = useState(false);

  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.types.length) count++;
    if (filters.priceMin > 0 || filters.priceMax < 50000) count++;
    if (filters.rangeMin > 0) count++;
    if (filters.seats.length) count++;
    if (filters.availability.length) count++;
    return count;
  }, [filters]);

  const toggleType = (id: string) => {
    const types = filters.types.includes(id)
      ? filters.types.filter((t) => t !== id)
      : [...filters.types, id];
    onChange({ ...filters, types });
  };

  const FilterPanel = () => (
    <div className="space-y-8">
      <div>
        <h4 className="mb-4 text-xs uppercase tracking-[0.2em] text-foreground-secondary">
          Vehicle Type
        </h4>
        <div className="flex flex-wrap gap-2">
          {vehicleTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => toggleType(type.id)}
              className={`rounded-full px-4 py-2 text-sm transition-all duration-300 ${
                filters.types.includes(type.id)
                  ? "bg-foreground text-background"
                  : "border border-border hover:border-foreground/20"
              }`}
              data-cursor="pointer"
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-4 text-xs uppercase tracking-[0.2em] text-foreground-secondary">
          Price Range
        </h4>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={50000}
            step={500}
            value={filters.priceMax}
            onChange={(e) => onChange({ ...filters, priceMax: Number(e.target.value) })}
            className="w-full accent-accent"
          />
          <span className="shrink-0 text-sm text-foreground-secondary">
            up to €{(filters.priceMax / 1000).toFixed(0)}k
          </span>
        </div>
      </div>

      <div>
        <h4 className="mb-4 text-xs uppercase tracking-[0.2em] text-foreground-secondary">
          Min Range
        </h4>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={350}
            step={10}
            value={filters.rangeMin}
            onChange={(e) => onChange({ ...filters, rangeMin: Number(e.target.value) })}
            className="w-full accent-accent"
          />
          <span className="shrink-0 text-sm text-foreground-secondary">
            {filters.rangeMin}+ km
          </span>
        </div>
      </div>

      <div>
        <h4 className="mb-4 text-xs uppercase tracking-[0.2em] text-foreground-secondary">
          Availability
        </h4>
        <div className="flex flex-wrap gap-2">
          {["in-stock", "pre-order"].map((status) => (
            <button
              key={status}
              onClick={() => {
                const availability = filters.availability.includes(status)
                  ? filters.availability.filter((s) => s !== status)
                  : [...filters.availability, status];
                onChange({ ...filters, availability });
              }}
              className={`rounded-full px-4 py-2 text-sm capitalize transition-all ${
                filters.availability.includes(status)
                  ? "bg-foreground text-background"
                  : "border border-border"
              }`}
              data-cursor="pointer"
            >
              {status.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {activeCount > 0 && (
        <button
          onClick={() => onChange(defaultFilters)}
          className="text-sm text-accent hover:underline"
          data-cursor="pointer"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <p className="text-sm text-foreground-secondary">
          {resultCount} vehicle{resultCount !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm transition-colors hover:bg-card lg:hidden"
          data-cursor="pointer"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-background">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      <div className="hidden lg:block">
        <div className="sticky top-32 rounded-2xl border border-border bg-card/50 p-8 backdrop-blur-xl">
          <FilterPanel />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed inset-x-4 bottom-4 z-50 max-h-[80vh] overflow-y-auto rounded-2xl border border-border bg-background p-8 lg:hidden"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-medium">Filters</h3>
                <button onClick={() => setOpen(false)} data-cursor="pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <FilterPanel />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function filterProducts(products: Product[], filters: FilterState): Product[] {
  return products.filter((p) => {
    if (filters.types.length && !filters.types.includes(p.categoryId)) return false;
    if (p.price < filters.priceMin || p.price > filters.priceMax) return false;
    if (filters.rangeMin > 0 && p.specs.rangeKm < filters.rangeMin) return false;
    if (filters.seats.length && !filters.seats.includes(p.specs.seats)) return false;
    if (filters.availability.length && !filters.availability.includes(p.availability))
      return false;
    return true;
  });
}

export { defaultFilters };
