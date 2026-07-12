import type { Accessory, Product } from "./types";
import { images } from "./images";

const motorcycleConfig = {
  colors: [
    { id: "schwarz", name: "Tiefschwarz", hex: "#0a0a0a" },
    { id: "chrom", name: "Chrom Akzent", hex: "#c0c0c0" },
    { id: "rot", name: "Alpinrot", hex: "#8b1a1a" },
  ],
  wheels: [
    { id: "standard", name: "21\" Cruiser", price: 0 },
    { id: "custom", name: "Speichenrad", price: 490 },
  ],
  battery: [
    { id: "72v-117ah", name: "72V 117Ah Serie", range: "150 km", price: 0 },
    { id: "extended", name: "Erweitertes Paket", range: "180 km", price: 890 },
  ],
  roof: [{ id: "none", name: "—", price: 0 }],
  cargoBox: [{ id: "none", name: "—", price: 0 }],
};

const mopedConfig = {
  colors: [
    { id: "weiss", name: "Alpinweiß", hex: "#f4f4f4" },
    { id: "blau", name: "Ozeanblau", hex: "#1e4a6f" },
    { id: "grau", name: "Graphit", hex: "#3a3a3a" },
  ],
  wheels: [{ id: "standard", name: "14\" Standard", price: 0 }],
  battery: [
    { id: "60ah", name: "60V 60Ah · 40 km", range: "40 km", price: 0 },
    { id: "125ah", name: "60V 125Ah · 80 km", range: "80 km", price: 1290 },
    { id: "lipo", name: "LiFePO4 Lithium · 120 km", range: "120 km", price: 2490 },
  ],
  roof: [
    { id: "hardtop", name: "Festes Dach", price: 0 },
    { id: "panorama", name: "Panorama-Glas", price: 990 },
  ],
  cargoBox: [{ id: "none", name: "Keine", price: 0 }],
};

const carConfig = {
  colors: [
    { id: "weiss", name: "Perlweiß", hex: "#f0f0f0" },
    { id: "schwarz", name: "Mitternacht", hex: "#111111" },
    { id: "silber", name: "Silber Metallic", hex: "#9a9a9a" },
  ],
  wheels: [
    { id: "standard", name: "15\" Standard", price: 0 },
    { id: "alloy", name: "16\" Leichtmetall", price: 690 },
  ],
  battery: [
    { id: "standard", name: "Standard-Paket", range: "120 km", price: 0 },
    { id: "extended", name: "Langstrecken-Paket", range: "200 km", price: 1990 },
  ],
  roof: [{ id: "solid", name: "Festdach", price: 0 }],
  cargoBox: [{ id: "none", name: "Keine", price: 0 }],
};

export const products: Product[] = [
  {
    id: "efo-em8",
    slug: "efo-em8-elektro-chopper",
    name: "EFO EM8 Elektro Chopper",
    tagline: "Der sportliche Cruiser",
    description:
      "Erleben Sie die Revolution der Elektromobilität mit unserem sportlichen Cruiser-Elektromotorrad. Bis zu 120 km/h, 150 km Reichweite und 8000W Dauerleistung — ein Fahrerlebnis, das seinesgleichen sucht.",
    price: 7990,
    category: "Motorräder",
    categoryId: "motorraeder",
    badge: "premium",
    availability: "in-stock",
    brand: "E.F.O.",
    images: images.em8,
    specs: {
      battery: "72V 117Ah",
      batteryKwh: 8.4,
      power: "8000 W",
      powerKw: 8,
      charging: "6–8 Std.",
      range: "150 km",
      rangeKm: 150,
      topSpeed: "120 km/h",
      topSpeedKmh: 120,
      payload: "150 kg",
      payloadKg: 150,
      seats: 2,
      dimensions: "Chopper · Cruiser",
      weight: "95 kg",
      weightKg: 95,
      motor: "8000W Brushless",
    },
    story: [
      {
        title: "120 km/h. Null Emissionen.",
        text: "Fühlen Sie den Adrenalinkick, wenn Sie mit bis zu 120 km/h über die Straßen gleiten. Geschwindigkeit und Leistung wie bei einem echten Cruiser — perfekt für Ausfahrten und schnelle Stadtpassagen.",
        image: images.em8[4],
      },
      {
        title: "72V 117Ah Herzstück",
        text: "Der Hochleistungsakku liefert konstante Energie, kraftvolle Beschleunigung und gleichmäßige Fahrleistung. Außergewöhnliche Reichweite, Effizienz und Zuverlässigkeit für endlose Fahrabenteuer.",
        image: images.em8[1],
      },
      {
        title: "LED & Digital Display",
        text: "Hochmoderne LED-Beleuchtung für Sicherheit und Stil. Das digitale Display zeigt Geschwindigkeit, Akkuladestand und alle relevanten Fahrdaten kristallklar auf einen Blick.",
        image: images.em8[6],
      },
    ],
    configurator: motorcycleConfig,
    relatedAccessoryIds: ["ladegeraet-72v", "helm-carbon", "abdeckplane"],
  },
  {
    id: "ego-ek4",
    slug: "ego-ek4-moped-auto",
    name: "E-GO eK4 Elektro Moped Auto",
    tagline: "4 Sitze. Volle Freiheit.",
    description:
      "Das Elektro-Mopedauto mit 4 Sitzplätzen. Wählen Sie zwischen 40, 80 oder 120 km Reichweite — je nach Batteriekonfiguration. Ideal für Stadt und Umland.",
    price: 9900,
    category: "Mopedauto 45 km/h",
    categoryId: "mopedauto",
    badge: "new",
    availability: "in-stock",
    brand: "E-GO",
    images: images.ek4,
    specs: {
      battery: "60V 60–125Ah",
      batteryKwh: 7.5,
      power: "3,6 kW",
      powerKw: 3.6,
      charging: "6–8 Std.",
      range: "40–120 km",
      rangeKm: 120,
      topSpeed: "45 km/h",
      topSpeedKmh: 45,
      payload: "400 kg",
      payloadKg: 400,
      seats: 4,
      dimensions: "4-Sitzer Mopedauto",
      weight: "420 kg",
      weightKg: 420,
      motor: "Elektro Antrieb",
    },
    story: [
      {
        title: "Die ganze Familie.",
        text: "Vier Sitze, null Emissionen. Das eK4 verbindet kompakte Abmessungen mit echtem Platzangebot — perfekt für den Alltag in Stadt und Region.",
        image: images.ek4[0],
      },
    ],
    configurator: mopedConfig,
    relatedAccessoryIds: ["ladegeraet-60v", "abdeckplane"],
  },
  {
    id: "e-truck-45",
    slug: "e-truck-45-transporter",
    name: "E-Truck 45 Transporter",
    tagline: "Mopedauto meets Nutzfahrzeug",
    description:
      "Der E-Truck 45 vereint Mopedauto-Zulassung mit Transporter-Funktionalität. Robust, wirtschaftlich und emissionsfrei — ideal für Gewerbe und Logistik.",
    price: 6790,
    category: "Elektro-Transporter",
    categoryId: "transporter",
    badge: "popular",
    availability: "in-stock",
    brand: "E-Truck",
    images: images.etruck,
    specs: {
      battery: "60V Lithium",
      batteryKwh: 5,
      power: "4 kW",
      powerKw: 4,
      charging: "5–7 Std.",
      range: "60 km",
      rangeKm: 60,
      topSpeed: "45 km/h",
      topSpeedKmh: 45,
      payload: "500 kg",
      payloadKg: 500,
      seats: 2,
      dimensions: "Transporter · 45 km/h",
      weight: "380 kg",
      weightKg: 380,
      motor: "Elektro Nutzfahrzeug",
    },
    story: [
      {
        title: "Business. Elektrisch.",
        text: "Last-Mile-Logistik ohne Lärm und Abgase. Der E-Truck 45 ist die clevere Wahl für Unternehmen, die vorausdenken.",
        image: images.etruck[0],
      },
    ],
    configurator: mopedConfig,
    relatedAccessoryIds: ["ladegeraet-60v", "anhangerkupplung"],
  },
  {
    id: "eec-amy-35",
    slug: "eec-amy-35",
    name: "EEC Elektroauto AMY 3.5",
    tagline: "Kompakt. Zugelassen. Electric.",
    description:
      "Das EEC AMY 3.5 — ein vollwertiges Elektroauto in kompakter Form. Perfekt für urbane Mobilität mit echtem Fahrzeugcharakter.",
    price: 10490,
    category: "Elektro Kleinwagen",
    categoryId: "kleinwagen",
    badge: "premium",
    availability: "in-stock",
    brand: "EEC",
    images: images.amy,
    specs: {
      battery: "72V Lithium",
      batteryKwh: 10,
      power: "7,5 kW",
      powerKw: 7.5,
      charging: "6 Std.",
      range: "100 km",
      rangeKm: 100,
      topSpeed: "80 km/h",
      topSpeedKmh: 80,
      payload: "300 kg",
      payloadKg: 300,
      seats: 2,
      dimensions: "L7e · Kleinwagen",
      weight: "650 kg",
      weightKg: 650,
      motor: "Elektro L7e",
    },
    story: [
      {
        title: "Kleinwagen. Großes Statement.",
        text: "Das AMY 3.5 beweist, dass Elektromobilität nicht Kompromisse bedeuten muss. Zugelassen, sicher und überraschend geräumig.",
        image: images.amy[0],
      },
    ],
    configurator: carConfig,
    relatedAccessoryIds: ["ladegeraet-72v", "abdeckplane"],
  },
  {
    id: "eec-star-60",
    slug: "eec-star-60",
    name: "EEC Elektroauto Star 6.0",
    tagline: "Mehr Raum. Mehr Range.",
    description:
      "Der Star 6.0 ist EECs Premium-Kleinwagen — mehr Leistung, mehr Reichweite, mehr Komfort. Für alle, die das Maximum erwarten.",
    price: 12990,
    category: "Elektro Kleinwagen",
    categoryId: "kleinwagen",
    badge: "limited",
    availability: "in-stock",
    brand: "EEC",
    images: images.star,
    specs: {
      battery: "96V Lithium",
      batteryKwh: 15,
      power: "12 kW",
      powerKw: 12,
      charging: "7 Std.",
      range: "150 km",
      rangeKm: 150,
      topSpeed: "90 km/h",
      topSpeedKmh: 90,
      payload: "350 kg",
      payloadKg: 350,
      seats: 4,
      dimensions: "L7e · Premium",
      weight: "780 kg",
      weightKg: 780,
      motor: "Elektro L7e Premium",
    },
    story: [
      {
        title: "Der Star der Klasse.",
        text: "Mehr Platz, mehr Power, mehr Reichweite. Der Star 6.0 setzt neue Maßstäbe im Segment der zugelassenen Elektrokleinwagen.",
        image: images.star[0],
      },
    ],
    configurator: carConfig,
    relatedAccessoryIds: ["ladegeraet-72v", "abdeckplane", "smart-display"],
  },
  {
    id: "efo-ev3000",
    slug: "efo-ev3000-roller",
    name: "E.F.O EV3000 Elektro Roller",
    tagline: "Stadtflitzer der Extraklasse",
    description:
      "Der EV3000 Elektroroller verbindet Eleganz mit Alltagstauglichkeit. Leise, wendig und überraschend kraftvoll — die smarte Wahl für urbane Mobilität.",
    price: 3290,
    category: "Roller & Scooter",
    categoryId: "roller",
    badge: "popular",
    availability: "in-stock",
    brand: "E.F.O.",
    images: images.ev3000,
    specs: {
      battery: "60V 20Ah",
      batteryKwh: 1.2,
      power: "3000 W",
      powerKw: 3,
      charging: "4 Std.",
      range: "65 km",
      rangeKm: 65,
      topSpeed: "45 km/h",
      topSpeedKmh: 45,
      payload: "150 kg",
      payloadKg: 150,
      seats: 2,
      dimensions: "Roller · 45 km/h",
      weight: "95 kg",
      weightKg: 95,
      motor: "3000W Hub Motor",
    },
    story: [
      {
        title: "Die Stadt gehört dir.",
        text: "Sofortiges Drehmoment, flüsterleiser Betrieb, null Emissionen. Der EV3000 macht jeden Weg zum Vergnügen.",
        image: images.ev3000[0],
      },
    ],
    configurator: {
      colors: [
        { id: "schwarz", name: "Schwarz", hex: "#111" },
        { id: "weiss", name: "Weiß", hex: "#f5f5f5" },
        { id: "rot", name: "Rot", hex: "#aa2222" },
      ],
      wheels: [{ id: "standard", name: "12\" Standard", price: 0 }],
      battery: [
        { id: "standard", name: "60V 20Ah", range: "65 km", price: 0 },
        { id: "extended", name: "60V 32Ah", range: "90 km", price: 390 },
      ],
      roof: [{ id: "none", name: "—", price: 0 }],
      cargoBox: [
        { id: "none", name: "Keine", price: 0 },
        { id: "topcase", name: "Topcase 45L", price: 189 },
      ],
    },
    relatedAccessoryIds: ["helm-carbon", "ladegeraet-60v"],
  },
  {
    id: "e8-quad",
    slug: "e8-series-e-quad",
    name: "E8 Series E-Quad 4kW",
    tagline: "4kW Power. Geländetauglich.",
    description:
      "Das E8 Series E-Quad mit 4000W Leistung und 7,2 kWh 72V 100Ah Lithium-Batterie. Leise, emissionsfrei und bereit für jedes Abenteuer.",
    price: 8490,
    category: "Quads",
    categoryId: "quads",
    badge: "new",
    availability: "in-stock",
    brand: "E8 Series",
    images: images.equad,
    specs: {
      battery: "72V 100Ah LiFePO4",
      batteryKwh: 7.2,
      power: "4000 W",
      powerKw: 4,
      charging: "6 Std.",
      range: "80 km",
      rangeKm: 80,
      topSpeed: "45 km/h",
      topSpeedKmh: 45,
      payload: "200 kg",
      payloadKg: 200,
      seats: 2,
      dimensions: "ATV · E-Quad",
      weight: "280 kg",
      weightKg: 280,
      motor: "4000W 4WD",
    },
    story: [
      {
        title: "Abseits der Straße.",
        text: "Elektro-Quads sind leise, emissionsfrei und vielseitig. Perfekt für Naturliebhaber, die Abenteuer suchen ohne die Umwelt zu belasten.",
        image: images.equad[0],
      },
    ],
    configurator: motorcycleConfig,
    relatedAccessoryIds: ["helm-carbon", "abdeckplane"],
  },
  {
    id: "ampero-hx25",
    slug: "ampero-hx25-e-quad",
    name: "Ampero Hummer HX25 E-Quad",
    tagline: "2 Personen · 25 km/h",
    description:
      "Das Ampero Hummer HX25 E-Quad mit Zulassung für 2 Personen. Robust, geländegängig und vollständig elektrisch.",
    price: 5990,
    category: "Quads",
    categoryId: "quads",
    availability: "in-stock",
    brand: "Ampero",
    images: [images.quadHx],
    specs: {
      battery: "60V 50Ah",
      batteryKwh: 3,
      power: "2500 W",
      powerKw: 2.5,
      charging: "5 Std.",
      range: "50 km",
      rangeKm: 50,
      topSpeed: "25 km/h",
      topSpeedKmh: 25,
      payload: "180 kg",
      payloadKg: 180,
      seats: 2,
      dimensions: "E-Quad · 25 km/h",
      weight: "220 kg",
      weightKg: 220,
      motor: "2500W",
    },
    story: [
      {
        title: "Zweisitzer für die Natur.",
        text: "Gemeinsam unterwegs — leise, sicher und ohne Emissionen. Das HX25 ist der ideale Begleiter für Ausflüge abseits befestigter Wege.",
        image: images.quadHx,
      },
    ],
    configurator: motorcycleConfig,
    relatedAccessoryIds: ["helm-carbon"],
  },
];

export const accessoryCatalog: Accessory[] = [
  {
    id: "ladegeraet-72v",
    slug: "ladegeraet-72v",
    name: "Schnellladegerät 72V",
    price: 289,
    image: "https://ebuddys.at/wp-content/uploads/2024/11/Gecotiroblau.jpg",
    description: "Kompatibel mit 72V Fahrzeugen. LED-Ladestatus, Überhitzungsschutz.",
  },
  {
    id: "ladegeraet-60v",
    slug: "ladegeraet-60v",
    name: "Ladegerät 60V",
    price: 199,
    image: "https://ebuddys.at/wp-content/uploads/2024/11/Gecotiroblau.jpg",
    description: "Standardladegerät für 60V E-Fahrzeuge.",
  },
  {
    id: "helm-carbon",
    slug: "helm-carbon",
    name: "Carbon Integralhelm",
    price: 189,
    image: "https://ebuddys.at/wp-content/uploads/2024/11/Gecotiroblau.jpg",
    description: "Leicht, sicher, mit integriertem Visier.",
  },
  {
    id: "abdeckplane",
    slug: "abdeckplane",
    name: "Allwetter-Abdeckplane",
    price: 129,
    image: "https://ebuddys.at/wp-content/uploads/2024/11/Gecotiroblau.jpg",
    description: "Atmungsaktiv, wasserdicht, UV-beständig.",
  },
  {
    id: "anhangerkupplung",
    slug: "anhangerkupplung",
    name: "Anhängerkupplung",
    price: 349,
    image: "https://ebuddys.at/wp-content/uploads/2024/11/Gecotiroblau.jpg",
    description: "Original-Anhängerkupplung für E-Transporter.",
  },
  {
    id: "smart-display",
    slug: "smart-display",
    name: "Smart Display Upgrade",
    price: 449,
    image: "https://ebuddys.at/wp-content/uploads/2024/11/Gecotiroblau.jpg",
    description: "Digitales Cockpit mit Navigation und Diagnose.",
  },
];

export const featuredProductId = "efo-em8";

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProduct(): Product {
  return products.find((p) => p.id === featuredProductId) ?? products[0];
}

export function getAccessoryById(id: string): Accessory | undefined {
  return accessoryCatalog.find((a) => a.id === id);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(price);
}

/** Grobe Finanzierungsrate für Verkaufs-UI (48 Monate, unverbindlich) */
export function formatFinancingHint(price: number): string {
  const monthly = Math.round(price / 48);
  return `ab ${new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(monthly)}/Monat`;
}

export const trendingSearches = [
  "EFO EM8 Chopper",
  "E-GO eK4",
  "E-Truck 45",
  "E-Quad",
  "Ladegerät",
];

export const compareSpecKeys = [
  { key: "rangeKm", label: "Reichweite", format: (p: Product) => p.specs.range },
  { key: "powerKw", label: "Leistung", format: (p: Product) => p.specs.power },
  { key: "batteryKwh", label: "Batterie", format: (p: Product) => p.specs.battery },
  { key: "topSpeedKmh", label: "Höchstgeschw.", format: (p: Product) => p.specs.topSpeed },
  { key: "weightKg", label: "Gewicht", format: (p: Product) => p.specs.weight },
  { key: "payloadKg", label: "Zuladung", format: (p: Product) => p.specs.payload },
  { key: "seats", label: "Sitze", format: (p: Product) => String(p.specs.seats) },
  { key: "charging", label: "Ladezeit", format: (p: Product) => p.specs.charging },
  { key: "motor", label: "Motor", format: (p: Product) => p.specs.motor },
] as const;
