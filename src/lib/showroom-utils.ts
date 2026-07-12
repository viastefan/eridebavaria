import type { Product } from "./types";
import type {
  ShowroomConfig,
  ComputedShowroomSpecs,
  ConfigSnapshot,
} from "./showroom-types";
import { getShowroomData } from "./showroom-data";

function findOptionPrice(
  options: { id: string; price?: number; range?: string; rangeDelta?: number; weightDelta?: number; payloadDelta?: number; deliveryWeeks?: number }[],
  id: string
) {
  return options.find((o) => o.id === id);
}

export function computeShowroomSpecs(
  product: Product,
  config: ShowroomConfig
): ComputedShowroomSpecs {
  const data = getShowroomData(product);
  const cfg = product.configurator;
  const ext = data.extendedOptions;

  let extra = 0;
  let rangeKm = product.specs.rangeKm;
  let weightKg = product.specs.weightKg;
  let payloadKg = product.specs.payloadKg;
  let deliveryWeeks = 2;
  let powerKw = product.specs.powerKw;

  const addOption = (
    opt: { price?: number; range?: string; rangeDelta?: number; weightDelta?: number; payloadDelta?: number; deliveryWeeks?: number } | undefined
  ) => {
    if (!opt) return;
    extra += opt.price ?? 0;
    if (opt.range) {
      const km = parseInt(opt.range, 10);
      if (!Number.isNaN(km)) rangeKm = km;
    }
    if (opt.rangeDelta) rangeKm += opt.rangeDelta;
    if (opt.weightDelta) weightKg += opt.weightDelta;
    if (opt.payloadDelta) payloadKg += opt.payloadDelta;
    if (opt.deliveryWeeks) deliveryWeeks += opt.deliveryWeeks;
  };

  addOption(cfg.wheels.find((w) => w.id === config.wheels));
  addOption(cfg.battery.find((b) => b.id === config.battery));
  addOption(cfg.roof.find((r) => r.id === config.roof));
  addOption(cfg.cargoBox.find((c) => c.id === config.cargoBox));
  addOption(findOptionPrice(ext.tyres, config.tyres));
  addOption(findOptionPrice(ext.seats, config.seats));
  addOption(findOptionPrice(ext.lighting, config.lighting));
  addOption(findOptionPrice(ext.doors, config.doors));
  addOption(findOptionPrice(ext.windows, config.windows));
  addOption(findOptionPrice(ext.performance, config.performance));
  addOption(findOptionPrice(ext.towHook, config.towHook));
  addOption(findOptionPrice(ext.storage, config.storage));

  if (config.performance === "boost") powerKw += 1.5;

  config.accessories.forEach((accId) => {
    const acc = data.accessories.find((a) => a.id === accId);
    if (acc) extra += acc.price;
  });

  return {
    price: product.price + extra,
    rangeKm,
    weightKg,
    payloadKg,
    deliveryWeeks,
    powerKw,
  };
}

export function createSnapshot(
  product: Product,
  config: ShowroomConfig,
  label: string
): ConfigSnapshot {
  const specs = computeShowroomSpecs(product, config);
  return {
    id: `cfg-${Date.now()}`,
    label,
    config: { ...config, accessories: [...config.accessories] },
    price: specs.price,
    rangeKm: specs.rangeKm,
    weightKg: specs.weightKg,
    payloadKg: specs.payloadKg,
    deliveryWeeks: specs.deliveryWeeks,
    timestamp: Date.now(),
  };
}

export function getConfigDiff(
  a: ConfigSnapshot,
  b: ConfigSnapshot
): { key: string; a: string; b: string }[] {
  const diffs: { key: string; a: string; b: string }[] = [];
  if (a.price !== b.price)
    diffs.push({ key: "Preis", a: `€${a.price}`, b: `€${b.price}` });
  if (a.rangeKm !== b.rangeKm)
    diffs.push({ key: "Reichweite", a: `${a.rangeKm} km`, b: `${b.rangeKm} km` });
  if (a.weightKg !== b.weightKg)
    diffs.push({ key: "Gewicht", a: `${a.weightKg} kg`, b: `${b.weightKg} kg` });
  if (a.payloadKg !== b.payloadKg)
    diffs.push({ key: "Zuladung", a: `${a.payloadKg} kg`, b: `${b.payloadKg} kg` });
  if (a.deliveryWeeks !== b.deliveryWeeks)
    diffs.push({
      key: "Lieferzeit",
      a: `${a.deliveryWeeks} Wo.`,
      b: `${b.deliveryWeeks} Wo.`,
    });
  return diffs;
}
