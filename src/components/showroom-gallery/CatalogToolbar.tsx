"use client";

import { ListFilter } from "lucide-react";
import type { SortKey } from "@/lib/showroom-filters";

interface CatalogToolbarProps {
  count: number;
  loading?: boolean;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  onFilterOpen: () => void;
  activeFilterCount: number;
}

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Top-Ergebnisse" },
  { value: "price-asc", label: "Niedrigster Preis" },
  { value: "price-desc", label: "Höchster Preis" },
  { value: "range-desc", label: "Reichweite" },
  { value: "name", label: "Name A–Z" },
];

export function CatalogToolbar({
  count,
  loading,
  sort,
  onSortChange,
  onFilterOpen,
  activeFilterCount,
}: CatalogToolbarProps) {
  return (
    <div className="catalog-toolbar">
      <h2 className="catalog-toolbar__heading">
        {loading ? "…" : count} {count === 1 ? "Fahrzeug" : "Fahrzeuge"}
      </h2>

      <div className="catalog-toolbar__controls">
        <button
          type="button"
          className="catalog-toolbar__control"
          onClick={onFilterOpen}
        >
          <ListFilter className="h-4 w-4" strokeWidth={1.25} />
          Filter
          {activeFilterCount > 0 && (
            <span className="catalog-toolbar__badge">{activeFilterCount}</span>
          )}
        </button>

        <label className="catalog-toolbar__control catalog-toolbar__sort">
          <span>Sortierung</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            className="catalog-toolbar__select"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
