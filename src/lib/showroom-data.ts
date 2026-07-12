import type { Product } from "./types";
import type { ShowroomData, ShowroomConfig, MediaItem } from "./showroom-types";

const defaultExtendedOptions = {
  tyres: [
    { id: "allseason", name: "Ganzjahresreifen", price: 0 },
    { id: "performance", name: "Performance-Reifen", price: 390, weightDelta: -2 },
    { id: "winter", name: "Winterpaket", price: 590, deliveryWeeks: 1 },
  ],
  seats: [
    { id: "standard", name: "Komfortsitze", price: 0 },
    { id: "sport", name: "Sportsitze", price: 890 },
    { id: "heated", name: "Sitzheizung", price: 690 },
  ],
  lighting: [
    { id: "led", name: "LED Serie", price: 0 },
    { id: "matrix", name: "Matrix-LED", price: 1290 },
    { id: "ambient", name: "Ambiente-Licht", price: 490 },
  ],
  doors: [
    { id: "standard", name: "Serie", price: 0 },
    { id: "soft-close", name: "Soft-Close", price: 790 },
  ],
  windows: [
    { id: "clear", name: "Klarglas", price: 0 },
    { id: "tinted", name: "Getönt", price: 290 },
    { id: "acoustic", name: "Akustikglas", price: 590 },
  ],
  performance: [
    { id: "standard", name: "Serienleistung", price: 0 },
    { id: "boost", name: "Performance Boost", price: 1490, rangeDelta: -10 },
  ],
  towHook: [
    { id: "none", name: "Keine", price: 0 },
    { id: "fixed", name: "Fest", price: 490, payloadDelta: 50 },
    { id: "retractable", name: "Schwenkbar", price: 890, payloadDelta: 75 },
  ],
  storage: [
    { id: "basic", name: "Basis", price: 0 },
    { id: "extended", name: "Erweitert", price: 390 },
    { id: "secure", name: "Abschließbar", price: 690 },
  ],
};

function buildHotspots(product: Product): ShowroomData["hotspots"] {
  const base: ShowroomData["hotspots"] = [
    {
      id: "battery",
      label: "Batterie",
      position: [0, 0.55, 0],
      title: "Hochvolt-Architektur",
      description:
        "LiFePO4-Zellen mit intelligentem Batteriemanagement, Thermalschutz und zellübergreifender Überwachung für maximale Sicherheit und Langlebigkeit.",
      specs: [product.specs.battery, product.specs.charging, product.specs.range],
      icon: "battery",
    },
    {
      id: "motor",
      label: "Motor",
      position: [0, 0.25, 0.6],
      title: "Brushless Antrieb",
      description:
        "Wartungsfreier Synchronmotor mit sofortigem Drehmoment, Rekuperation und präziser Leistungsregelung.",
      specs: [product.specs.power, product.specs.motor],
      icon: "motor",
    },
    {
      id: "suspension",
      label: "Fahrwerk",
      position: [-0.9, 0.15, 0.7],
      title: "Adaptive Federung",
      description:
        "Abgestimmtes Fahrwerk für Komfort auf langen Strecken und Stabilität bei voller Zuladung.",
      icon: "suspension",
    },
    {
      id: "brakes",
      label: "Bremsen",
      position: [-1.1, 0.2, 0.5],
      title: "Regeneratives Bremssystem",
      description:
        "Hydraulische Scheibenbremsen kombiniert mit Rekuperation — mehr Reichweite bei jedem Bremsvorgang.",
      icon: "brakes",
    },
    {
      id: "charging",
      label: "Laden",
      position: [-0.3, 0.5, 0.75],
      title: "Ladeanschluss",
      description:
        "Standard- und Schnellladung. Kompatibel mit Hausanschluss und öffentlicher Infrastruktur.",
      specs: [product.specs.charging],
      icon: "charging",
    },
    {
      id: "display",
      label: "Display",
      position: [0.2, 0.95, 0.35],
      title: "Digitales Cockpit",
      description:
        "Hochauflösendes Display mit Navigation, Diagnose und personalisierbaren Fahrprofilen.",
      icon: "display",
    },
    {
      id: "lighting",
      label: "Licht",
      position: [-1.5, 0.45, 0.4],
      title: "LED-Lichtsystem",
      description:
        "Voll-LED-Beleuchtung mit Tagfahrlicht, Kurvenlicht und dynamischen Blinkern.",
      icon: "lighting",
    },
    {
      id: "cargo",
      label: "Ladung",
      position: [1.1, 0.55, 0],
      title: "Laderaum",
      description: `Zuladung bis ${product.specs.payload}. Modular erweiterbar mit Zubehör und Anhängerkupplung.`,
      specs: [product.specs.payload, product.specs.dimensions],
      icon: "cargo",
    },
  ];
  return base;
}

function buildParts(product: Product): ShowroomData["parts"] {
  return [
    {
      id: "part-battery",
      name: `${product.brand} Hochvolt-Batterie`,
      category: "Antrieb",
      price: 1890,
      availability: "in-stock",
      compatibility: [product.name],
      installDifficulty: "profi",
      installTime: "3–4 Std.",
      deliveryDays: 5,
      meshId: "battery",
      position: [0, 0.55, 0],
      description: "Original-Ersatzbatterie mit voller Garantie.",
    },
    {
      id: "part-motor",
      name: "Brushless Antriebsmotor",
      category: "Antrieb",
      price: 1290,
      availability: "in-stock",
      compatibility: [product.name],
      installDifficulty: "profi",
      installTime: "2–3 Std.",
      deliveryDays: 7,
      meshId: "motor",
      position: [0, 0.25, 0.6],
      description: "Originalmotor mit werkseitiger Kalibrierung.",
    },
    {
      id: "part-controller",
      name: "Motorsteuerung",
      category: "Elektronik",
      price: 590,
      availability: "in-stock",
      compatibility: [product.name],
      installDifficulty: "mittel",
      installTime: "1 Std.",
      deliveryDays: 3,
      meshId: "frame",
      position: [0, 0.45, 0.2],
      description: "Steuergerät für präzise Leistungsabgabe.",
    },
    {
      id: "part-brake-front",
      name: "Vorderbremszange",
      category: "Fahrwerk",
      price: 189,
      availability: "in-stock",
      compatibility: [product.name],
      installDifficulty: "mittel",
      installTime: "45 Min.",
      deliveryDays: 2,
      meshId: "brakes",
      position: [-1.1, 0.2, 0.5],
      description: "Hydraulische Scheibenbremse, Serie.",
    },
    {
      id: "part-headlight",
      name: "LED-Scheinwerfer",
      category: "Beleuchtung",
      price: 249,
      availability: "in-stock",
      compatibility: [product.name],
      installDifficulty: "einfach",
      installTime: "20 Min.",
      deliveryDays: 2,
      meshId: "lighting",
      position: [-1.5, 0.45, 0.4],
      description: "Plug-and-Play LED-Modul.",
    },
    {
      id: "part-display",
      name: "Digitales Display",
      category: "Cockpit",
      price: 349,
      availability: "pre-order",
      compatibility: [product.name],
      installDifficulty: "einfach",
      installTime: "15 Min.",
      deliveryDays: 10,
      meshId: "frame",
      position: [0.2, 0.95, 0.35],
      description: "Touch-Display mit Navigation.",
    },
    {
      id: "part-charger-port",
      name: "Ladeanschluss",
      category: "Laden",
      price: 89,
      availability: "in-stock",
      compatibility: [product.name],
      installDifficulty: "mittel",
      installTime: "30 Min.",
      deliveryDays: 2,
      meshId: "battery",
      position: [-0.3, 0.5, 0.75],
      description: "Original-Ladebuchse mit Staubschutz.",
    },
    {
      id: "part-suspension",
      name: "Federbein",
      category: "Fahrwerk",
      price: 279,
      availability: "in-stock",
      compatibility: [product.name],
      installDifficulty: "profi",
      installTime: "1,5 Std.",
      deliveryDays: 4,
      meshId: "suspension",
      position: [-0.9, 0.15, 0.7],
      description: "Abgestimmtes Dämpferelement.",
    },
  ];
}

function buildAccessories(product: Product): ShowroomData["accessories"] {
  return [
    {
      id: "acc-rack",
      name: "Dachgepäckträger",
      price: 349,
      description: "Aerodynamischer Träger aus Aluminium.",
      attachPosition: [0, 1.15, 0],
      meshType: "rack",
    },
    {
      id: "acc-cargo",
      name: "Dachbox",
      price: 489,
      description: "480L abschließbare Transportbox.",
      attachPosition: [0, 1.35, 0],
      attachScale: 1.2,
      meshType: "box",
    },
    {
      id: "acc-lights",
      name: "Zusatzscheinwerfer",
      price: 289,
      description: "LED-Bar für Gelände und Nacht.",
      attachPosition: [-1.55, 0.5, 0],
      meshType: "light-bar",
    },
    {
      id: "acc-winch",
      name: "Seilwinde",
      price: 690,
      description: "Elektrische Winde, 2000 kg.",
      attachPosition: [-1.6, 0.35, 0],
      meshType: "box",
    },
    {
      id: "acc-hitch",
      name: "Anhängerkupplung",
      price: 490,
      description: "Schwenkbar, 750 kg.",
      attachPosition: [1.55, 0.25, 0],
      meshType: "cylinder",
    },
    {
      id: "acc-mudguards",
      name: "Schmutzfänger",
      price: 129,
      description: "Karbon-Optik, Satz.",
      attachPosition: [-0.9, 0.1, 0.8],
      meshType: "box",
    },
    {
      id: "acc-storage",
      name: "Stauraumbox",
      price: 219,
      description: "Unterflur-Staufach.",
      attachPosition: [0.8, 0.35, 0],
      meshType: "box",
    },
    {
      id: "acc-winter",
      name: "Winterpaket",
      price: 590,
      description: "Sitzheizung, Winterreifen, Abdeckung.",
      attachPosition: [0, 0.9, 0],
      meshType: "box",
    },
  ];
}

function buildMedia(product: Product): MediaItem[] {
  const imgs = product.images;
  const types: MediaItem["type"][] = [
    "studio",
    "lifestyle",
    "detail",
    "macro",
    "material",
    "studio",
    "detail",
    "lifestyle",
  ];
  const titles = [
    "Studio-Aufnahme",
    "In der Landschaft",
    "Linienführung",
    "Materialdetail",
    "Oberflächenqualität",
    "Seitenprofil",
    "Technische Nähe",
    "Fahrerlebnis",
  ];
  const subtitles = [
    "Präzise Inszenierung",
    "Alpine Umgebung",
    "Formensprache",
    "Handwerksqualität",
    "Premium-Finish",
    "Proportionen",
    "Ingenieurskunst",
    "Emotion & Bewegung",
  ];

  return imgs.slice(0, 8).map((src, i) => ({
    id: `media-${i}`,
    type: types[i] ?? "studio",
    src,
    title: titles[i] ?? "Aufnahme",
    subtitle: subtitles[i] ?? "",
  }));
}

function buildTechnology(product: Product): ShowroomData["technology"] {
  return [
    {
      id: "battery",
      title: "Batterie",
      description: "Zellarchitektur mit aktivem Thermomanagement und präziser SOC-Berechnung.",
      metric: product.specs.battery,
      metricLabel: "Kapazität",
    },
    {
      id: "motor",
      title: "Motor",
      description: "Brushless-Synchronmotor mit linearer Leistungskurve.",
      metric: product.specs.power,
      metricLabel: "Leistung",
    },
    {
      id: "charging",
      title: "Laden",
      description: "Intelligente Ladeelektronik mit Überhitzungsschutz.",
      metric: product.specs.charging,
      metricLabel: "Ladezeit",
    },
    {
      id: "range",
      title: "Reichweite",
      description: "WLTP-nah unter realen Bedingungen optimiert.",
      metric: product.specs.range,
      metricLabel: "Maximal",
    },
    {
      id: "weight",
      title: "Gewichtsverteilung",
      description: "Tief liegender Schwerpunkt für Stabilität und Agilität.",
      metric: product.specs.weight,
      metricLabel: "Leergewicht",
    },
    {
      id: "frame",
      title: "Rahmen",
      description: "Strukturelle Integrität für maximale Sicherheit.",
      metric: product.specs.payload,
      metricLabel: "Zuladung",
    },
  ];
}

export function getShowroomData(product: Product): ShowroomData {
  return {
    hotspots: buildHotspots(product),
    parts: buildParts(product),
    accessories: buildAccessories(product),
    media: buildMedia(product),
    technology: buildTechnology(product),
    extendedOptions: defaultExtendedOptions,
  };
}

export function createDefaultConfig(product: Product): ShowroomConfig {
  const c = product.configurator;
  return {
    color: c.colors[0]?.id ?? "",
    wheels: c.wheels[0]?.id ?? "",
    tyres: "allseason",
    battery: c.battery[0]?.id ?? "",
    roof: c.roof[0]?.id ?? "",
    cargoBox: c.cargoBox[0]?.id ?? "",
    seats: "standard",
    lighting: "led",
    doors: "standard",
    windows: "clear",
    performance: "standard",
    towHook: "none",
    storage: "basic",
    accessories: [],
  };
}

export const CAMERA_PRESETS: Record<
  string,
  { position: [number, number, number]; target: [number, number, number]; fov?: number }
> = {
  exterior: { position: [5.5, 1.8, 5.5], target: [0, 0.4, 0] },
  interior: { position: [0.8, 1.1, 0.6], target: [0.3, 0.85, 0] },
  cargo: { position: [-3.5, 1.5, 0.5], target: [1, 0.5, 0] },
  underside: { position: [0, -1.5, 4], target: [0, 0.2, 0] },
  battery: { position: [2, 0.8, 2.5], target: [0, 0.5, 0] },
  lighting: { position: [-3, 1.2, 2], target: [-1.2, 0.45, 0] },
};

export const EXPLODED_OFFSETS: Record<string, [number, number, number]> = {
  battery: [0, 1.2, 0],
  motor: [0, -0.3, 1.2],
  frame: [0, 0, 0],
  suspension: [0, 0, 0],
  brakes: [0, 0, 0],
  lighting: [0, 0.2, 0],
  cargo: [0, 0.8, 0],
};
