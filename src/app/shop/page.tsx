"use client";

import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { products as staticProducts } from "@/lib/products";
import { CompatibilityFinder } from "@/components/showroom-gallery/CompatibilityFinder";
import { ShowroomDiscoveryPanel } from "@/components/showroom-gallery/ShowroomDiscoveryPanel";
import { VehicleGallery } from "@/components/showroom-gallery/VehicleGallery";
import { VehicleQuickView } from "@/components/showroom-gallery/VehicleQuickView";
import { VehicleCompareBar } from "@/components/showroom-gallery/VehicleCompareBar";
import { VehicleComparePanel } from "@/components/showroom-gallery/VehicleComparePanel";
import { ShopCategoryNav } from "@/components/showroom-gallery/ShopCategoryNav";
import { ShopCategoryChips } from "@/components/showroom-gallery/ShopCategoryChips";
import { CatalogToolbar } from "@/components/showroom-gallery/CatalogToolbar";
import { AccessoryGallery } from "@/components/showroom-gallery/AccessoryGallery";
import { ShopTrustStrip } from "@/components/showroom-gallery/ShopTrustStrip";
import {
  countActiveFilters,
  defaultShowroomFilters,
  filterShowroomProducts,
  sortShowroomProducts,
  type ShowroomFilterState,
  type SortKey,
  type VehicleCategoryGroup,
} from "@/lib/showroom-filters";

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const tabParam = searchParams.get("tab");
  const initialTab =
    tabParam === "accessories" || categoryParam === "zubehoer"
      ? "accessories"
      : "vehicles";

  const [activeTab, setActiveTab] = useState<"vehicles" | "accessories">(initialTab);
  const [allProducts, setAllProducts] = useState<Product[]>(staticProducts);
  const [accessories, setAccessories] = useState<
    { id: string; slug: string; name: string; price: number; image: string; description: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortKey>("featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<ShowroomFilterState>(() => ({
    ...defaultShowroomFilters,
    categories:
      categoryParam && categoryParam !== "zubehoer"
        ? mapLegacyCategory(categoryParam)
        : [],
  }));
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [productsRes, accessoriesRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/products?type=accessories"),
        ]);
        if (!cancelled && productsRes.ok) {
          const data = await productsRes.json();
          if (data.products?.length) setAllProducts(data.products);
        }
        if (!cancelled && accessoriesRes.ok) {
          const data = await accessoriesRes.json();
          if (data.accessories) setAccessories(data.accessories);
        }
      } catch {
        /* fallback */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () => sortShowroomProducts(filterShowroomProducts(allProducts, filters), sort),
    [allProducts, filters, sort]
  );

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  const handleCategoryToggle = useCallback((id: VehicleCategoryGroup) => {
    setFilters((prev) => {
      const categories = prev.categories.includes(id)
        ? prev.categories.filter((c) => c !== id)
        : [...prev.categories, id];
      return { ...prev, categories };
    });
  }, []);

  const pageTitle = activeTab === "vehicles" ? "Fahrzeugkatalog" : "Zubehör";

  return (
    <main className="showroom-catalog min-h-screen pt-24 pb-32 md:pt-28">
      <div className="section-padding">
        <ShopCategoryNav activeTab={activeTab} onTabChange={setActiveTab} />

        <motion.h1
          className="showroom-catalog__title"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {pageTitle}
        </motion.h1>

        {activeTab === "vehicles" ? (
          <>
            <CompatibilityFinder
              products={allProducts}
              activeCategories={filters.categories}
              onCategoryToggle={handleCategoryToggle}
            />

            <ShopCategoryChips filters={filters} onChange={setFilters} />

            <CatalogToolbar
              count={filtered.length}
              loading={loading}
              sort={sort}
              onSortChange={setSort}
              onFilterOpen={() => setFilterOpen(true)}
              activeFilterCount={activeFilterCount}
            />

            {loading ? (
              <div className="vehicle-gallery__grid vehicle-gallery__grid--catalog">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="vehicle-card__surface vehicle-card__surface--skeleton" />
                ))}
              </div>
            ) : (
              <VehicleGallery products={filtered} onQuickView={setQuickViewProduct} />
            )}
          </>
        ) : (
          <div className="mt-8">
            {loading ? (
              <div className="accessory-gallery__grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="accessory-gallery__card accessory-gallery__card--skeleton" />
                ))}
              </div>
            ) : (
              <AccessoryGallery accessories={accessories} />
            )}
          </div>
        )}

        <ShopTrustStrip />
      </div>

      <ShowroomDiscoveryPanel
        filters={filters}
        onChange={setFilters}
        resultCount={filtered.length}
        flyoutOpen={filterOpen}
        onFlyoutChange={setFilterOpen}
      />
      <VehicleQuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      <VehicleCompareBar products={allProducts} onOpenCompare={() => setCompareOpen(true)} />
      <VehicleComparePanel products={allProducts} open={compareOpen} onClose={() => setCompareOpen(false)} />
    </main>
  );
}

function mapLegacyCategory(param: string): VehicleCategoryGroup[] {
  const map: Record<string, VehicleCategoryGroup> = {
    kleinwagen: "electric-cars",
    mopedauto: "electric-cars",
    transporter: "cargo",
    quads: "quads",
    motorraeder: "e-bikes",
    roller: "e-bikes",
    utv: "utility",
  };
  const group = map[param];
  return group ? [group] : [];
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ShopContent />
    </Suspense>
  );
}
