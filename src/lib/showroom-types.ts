import type { Product } from "./types";

export type ShowroomMode = "showroom" | "exploded" | "parts" | "compare";
export type CameraView =
  | "exterior"
  | "interior"
  | "cargo"
  | "underside"
  | "battery"
  | "lighting";

export interface ShowroomConfig {
  color: string;
  wheels: string;
  tyres: string;
  battery: string;
  roof: string;
  cargoBox: string;
  seats: string;
  lighting: string;
  doors: string;
  windows: string;
  performance: string;
  towHook: string;
  storage: string;
  accessories: string[];
}

export interface ConfigOptionExtended {
  id: string;
  name: string;
  price?: number;
  hex?: string;
  range?: string;
  weightDelta?: number;
  payloadDelta?: number;
  rangeDelta?: number;
  deliveryWeeks?: number;
}

export interface ShowroomHotspot {
  id: string;
  label: string;
  position: [number, number, number];
  title: string;
  description: string;
  specs?: string[];
  videoUrl?: string;
  icon: string;
}

export interface ShowroomPart {
  id: string;
  name: string;
  category: string;
  price: number;
  availability: "in-stock" | "pre-order" | "sold-out";
  compatibility: string[];
  installDifficulty: "einfach" | "mittel" | "profi";
  installTime: string;
  deliveryDays: number;
  meshId: string;
  position: [number, number, number];
  description: string;
}

export interface ShowroomAccessory {
  id: string;
  name: string;
  price: number;
  description: string;
  attachPosition: [number, number, number];
  attachScale?: number;
  meshType: "box" | "cylinder" | "rack" | "light-bar";
}

export interface MediaItem {
  id: string;
  type: "studio" | "lifestyle" | "detail" | "macro" | "material" | "video" | "animation";
  src: string;
  title: string;
  subtitle: string;
}

export interface TechnologyTopic {
  id: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
}

export interface ConfigSnapshot {
  id: string;
  label: string;
  config: ShowroomConfig;
  price: number;
  rangeKm: number;
  weightKg: number;
  payloadKg: number;
  deliveryWeeks: number;
  timestamp: number;
}

export interface AIIdentificationResult {
  partId: string;
  partName: string;
  confidence: number;
  suggestedParts: string[];
  tools: string[];
  maintenanceTip: string;
}

export interface ComputedShowroomSpecs {
  price: number;
  rangeKm: number;
  weightKg: number;
  payloadKg: number;
  deliveryWeeks: number;
  powerKw: number;
}

export interface ShowroomData {
  hotspots: ShowroomHotspot[];
  parts: ShowroomPart[];
  accessories: ShowroomAccessory[];
  media: MediaItem[];
  technology: TechnologyTopic[];
  extendedOptions: {
    tyres: ConfigOptionExtended[];
    seats: ConfigOptionExtended[];
    lighting: ConfigOptionExtended[];
    doors: ConfigOptionExtended[];
    windows: ConfigOptionExtended[];
    performance: ConfigOptionExtended[];
    towHook: ConfigOptionExtended[];
    storage: ConfigOptionExtended[];
  };
}

export type VehicleProfile = "motorcycle" | "moped" | "car" | "truck" | "quad" | "scooter";

export function getVehicleProfile(product: Product): VehicleProfile {
  const map: Record<string, VehicleProfile> = {
    motorraeder: "motorcycle",
    mopedauto: "moped",
    kleinwagen: "car",
    transporter: "truck",
    quads: "quad",
    roller: "scooter",
  };
  return map[product.categoryId] ?? "car";
}
