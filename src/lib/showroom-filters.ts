import type { Product } from "./types";

export type VehicleCategoryGroup =
  | "electric-cars"
  | "cargo"
  | "quads"
  | "e-bikes"
  | "utility";

export type UsageTag =
  | "business"
  | "adventure"
  | "family"
  | "agriculture"
  | "transport"
  | "leisure";

export interface ShowroomFilterState {
  categories: VehicleCategoryGroup[];
  usage: UsageTag[];
  priceMin: number;
  priceMax: number;
  rangeMin: number;
  rangeMax: number;
  batteryMin: number;
  powerMin: number;
  speedMin: number;
  seats: number[];
  payloadMin: number;
  availability: string[];
  search: string;
}

export const defaultShowroomFilters: ShowroomFilterState = {
  categories: [],
  usage: [],
  priceMin: 0,
  priceMax: 50000,
  rangeMin: 0,
  rangeMax: 350,
  batteryMin: 0,
  powerMin: 0,
  speedMin: 0,
  seats: [],
  payloadMin: 0,
  availability: [],
  search: "",
};

export const vehicleCategoryGroups: {
  id: VehicleCategoryGroup;
  label: string;
  description: string;
}[] = [
  {
    id: "electric-cars",
    label: "Elektroautos",
    description: "Kleinwagen & Mopedautos",
  },
  {
    id: "cargo",
    label: "Nutzfahrzeuge",
    description: "Transporter & Logistik",
  },
  { id: "quads", label: "Quads", description: "Gelände & Freizeit" },
  {
    id: "e-bikes",
    label: "E-Bikes & Roller",
    description: "Motorräder & Scooter",
  },
  {
    id: "utility",
    label: "Utility",
    description: "UTV & Spezialfahrzeuge",
  },
];

export const usageTags: { id: UsageTag; label: string }[] = [
  { id: "business", label: "Business" },
  { id: "adventure", label: "Abenteuer" },
  { id: "family", label: "Familie" },
  { id: "agriculture", label: "Landwirtschaft" },
  { id: "transport", label: "Transport" },
  { id: "leisure", label: "Freizeit" },
];

const categoryToGroup: Record<string, VehicleCategoryGroup> = {
  kleinwagen: "electric-cars",
  mopedauto: "electric-cars",
  transporter: "cargo",
  quads: "quads",
  motorraeder: "e-bikes",
  roller: "e-bikes",
  utv: "utility",
};

const categoryToUsage: Record<string, UsageTag[]> = {
  kleinwagen: ["business", "family", "leisure"],
  mopedauto: ["family", "leisure", "business"],
  transporter: ["business", "transport", "agriculture"],
  quads: ["adventure", "leisure", "agriculture"],
  motorraeder: ["adventure", "leisure"],
  roller: ["leisure", "business"],
  utv: ["agriculture", "transport", "adventure"],
};

export function getProductCategoryGroup(product: Product): VehicleCategoryGroup {
  return categoryToGroup[product.categoryId] ?? "electric-cars";
}

export function getProductUsageTags(product: Product): UsageTag[] {
  return categoryToUsage[product.categoryId] ?? ["leisure"];
}

export function filterShowroomProducts(
  products: Product[],
  filters: ShowroomFilterState
): Product[] {
  const q = filters.search.trim().toLowerCase();

  return products.filter((p) => {
    if (filters.categories.length) {
      const group = getProductCategoryGroup(p);
      if (!filters.categories.includes(group)) return false;
    }

    if (filters.usage.length) {
      const tags = getProductUsageTags(p);
      if (!filters.usage.some((u) => tags.includes(u))) return false;
    }

    if (p.price < filters.priceMin || p.price > filters.priceMax) return false;
    if (p.specs.rangeKm < filters.rangeMin || p.specs.rangeKm > filters.rangeMax)
      return false;
    if (p.specs.batteryKwh < filters.batteryMin) return false;
    if (p.specs.powerKw < filters.powerMin) return false;
    if (p.specs.topSpeedKmh < filters.speedMin) return false;
    if (p.specs.payloadKg < filters.payloadMin) return false;
    if (filters.seats.length && !filters.seats.includes(p.specs.seats)) return false;
    if (
      filters.availability.length &&
      !filters.availability.includes(p.availability)
    )
      return false;

    if (q) {
      const haystack = [
        p.name,
        p.tagline,
        p.description,
        p.category,
        p.brand,
        p.specs.range,
        p.specs.power,
        p.specs.motor,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });
}

export function countActiveFilters(filters: ShowroomFilterState): number {
  let count = 0;
  if (filters.categories.length) count++;
  if (filters.usage.length) count++;
  if (filters.priceMin > 0 || filters.priceMax < 50000) count++;
  if (filters.rangeMin > 0 || filters.rangeMax < 350) count++;
  if (filters.batteryMin > 0) count++;
  if (filters.powerMin > 0) count++;
  if (filters.speedMin > 0) count++;
  if (filters.payloadMin > 0) count++;
  if (filters.seats.length) count++;
  if (filters.availability.length) count++;
  if (filters.search.trim()) count++;
  return count;
}

export type SortKey =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "range-desc"
  | "name";

export function sortShowroomProducts(
  list: Product[],
  sort: SortKey
): Product[] {
  const copy = [...list];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "range-desc":
      return copy.sort(
        (a, b) => (b.specs.rangeKm ?? 0) - (a.specs.rangeKm ?? 0)
      );
    case "name":
      return copy.sort((a, b) => a.name.localeCompare(b.name, "de"));
    default:
      return copy;
  }
}

export const compareMetrics = [
  {
    key: "rangeKm" as const,
    label: "Reichweite",
    unit: "km",
    format: (p: Product) => p.specs.rangeKm,
    display: (p: Product) => p.specs.range,
  },
  {
    key: "batteryKwh" as const,
    label: "Batterie",
    unit: "kWh",
    format: (p: Product) => p.specs.batteryKwh,
    display: (p: Product) => p.specs.battery,
  },
  {
    key: "powerKw" as const,
    label: "Leistung",
    unit: "kW",
    format: (p: Product) => p.specs.powerKw,
    display: (p: Product) => p.specs.power,
  },
  {
    key: "topSpeedKmh" as const,
    label: "Geschwindigkeit",
    unit: "km/h",
    format: (p: Product) => p.specs.topSpeedKmh,
    display: (p: Product) => p.specs.topSpeed,
  },
  {
    key: "payloadKg" as const,
    label: "Zuladung",
    unit: "kg",
    format: (p: Product) => p.specs.payloadKg,
    display: (p: Product) => p.specs.payload,
  },
  {
    key: "seats" as const,
    label: "Sitze",
    unit: "",
    format: (p: Product) => p.specs.seats,
    display: (p: Product) => String(p.specs.seats),
  },
];
