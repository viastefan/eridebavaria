"use client";

import {
  usageTags,
  vehicleCategoryGroups,
  type ShowroomFilterState,
  type UsageTag,
  type VehicleCategoryGroup,
} from "@/lib/showroom-filters";

interface ShopCategoryChipsProps {
  filters: ShowroomFilterState;
  onChange: (filters: ShowroomFilterState) => void;
}

export function ShopCategoryChips({ filters, onChange }: ShopCategoryChipsProps) {
  const hasActive =
    filters.categories.length > 0 || filters.usage.length > 0;

  const toggleCategory = (id: VehicleCategoryGroup) => {
    const categories = filters.categories.includes(id)
      ? filters.categories.filter((c) => c !== id)
      : [...filters.categories, id];
    onChange({ ...filters, categories });
  };

  const toggleUsage = (id: UsageTag) => {
    const usage = filters.usage.includes(id)
      ? filters.usage.filter((u) => u !== id)
      : [...filters.usage, id];
    onChange({ ...filters, usage });
  };

  return (
    <div className="shop-chips">
      <div className="shop-chips__scroll hide-scrollbar">
        <button
          type="button"
          className={`shop-chips__chip ${!hasActive ? "shop-chips__chip--active" : ""}`}
          onClick={() => onChange({ ...filters, categories: [], usage: [] })}
        >
          Alle Fahrzeuge
        </button>
        {vehicleCategoryGroups.map((group) => (
          <button
            key={group.id}
            type="button"
            className={`shop-chips__chip ${filters.categories.includes(group.id) ? "shop-chips__chip--active" : ""}`}
            onClick={() => toggleCategory(group.id)}
          >
            {group.label}
          </button>
        ))}
        <span className="shop-chips__divider" aria-hidden />
        {usageTags.map((tag) => (
          <button
            key={tag.id}
            type="button"
            className={`shop-chips__chip shop-chips__chip--muted ${filters.usage.includes(tag.id) ? "shop-chips__chip--active" : ""}`}
            onClick={() => toggleUsage(tag.id)}
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  );
}
