export interface GarageSession {
  accessId: string;
  productSlug: string;
  productName: string;
  customerName: string | null;
}

export interface GarageServiceEntry {
  date: string;
  event: string;
  type: "service" | "upgrade" | "delivery";
}

export interface GarageDocument {
  name: string;
  type: string;
}

export interface GarageAccessData {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  customerName: string | null;
  vin: string | null;
  purchaseDate: string | null;
  warrantyUntil: string | null;
  batteryHealth: number;
  nextServiceDate: string | null;
  serviceLog: GarageServiceEntry[];
  documents: GarageDocument[];
}

export function normalizeGaragePin(raw: string) {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function formatGaragePin(raw: string) {
  const clean = normalizeGaragePin(raw);
  if (clean.length <= 2) return clean;
  const prefix = clean.slice(0, 2);
  const rest = clean.slice(2);
  if (!rest) return prefix;
  return `${prefix}-${rest.match(/.{1,3}/g)?.join("-") ?? rest}`;
}
