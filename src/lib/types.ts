export type ProductBadge = "new" | "popular" | "limited" | "premium";
export type Availability = "in-stock" | "pre-order" | "sold-out";

export interface ProductSpecs {
  battery: string;
  batteryKwh: number;
  power: string;
  powerKw: number;
  charging: string;
  range: string;
  rangeKm: number;
  topSpeed: string;
  topSpeedKmh: number;
  payload: string;
  payloadKg: number;
  seats: number;
  dimensions: string;
  weight: string;
  weightKg: number;
  motor: string;
}

export interface StoryBlock {
  title: string;
  text: string;
  image: string;
}

export interface ConfigOption {
  id: string;
  name: string;
  price?: number;
  hex?: string;
  range?: string;
}

export interface ProductConfigurator {
  colors: ConfigOption[];
  wheels: ConfigOption[];
  battery: ConfigOption[];
  roof: ConfigOption[];
  cargoBox: ConfigOption[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  category: string;
  categoryId: string;
  badge?: ProductBadge;
  availability: Availability;
  brand: string;
  images: string[];
  specs: ProductSpecs;
  story: StoryBlock[];
  configurator: ProductConfigurator;
  relatedAccessoryIds: string[];
}

export interface Accessory {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  configuration?: Record<string, string>;
}

export interface SearchResult {
  id: string;
  type: "product" | "accessory" | "category";
  name: string;
  subtitle: string;
  image: string;
  href: string;
}
