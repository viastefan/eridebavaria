import { regional } from "./regional";
import { images } from "./images";

export const platform = {
  brand: {
    tagline: "Willkommen in der Welt der E-Fahrzeuge.",
    manifesto: regional.intro,
    orderPromise: regional.orderPromise,
  },
  regional,
  nav: {
    vehicles: "Fahrzeuge",
    technology: "Technologie",
    upgrades: "Upgrades",
    journal: "Journal",
    fleet: "Fleet",
    garage: "Garage",
    compare: "Vergleich",
  },
  hero: {
    eyebrow: "eRide Bavaria · Simbach am Inn",
    headline: "Elektromobilität mit Service.",
    subline: regional.intro,
    ctaExplore: "Fahrzeuge entdecken",
    ctaTechnology: "Beratung anfragen",
  },
  ecosystem: regional.servicePillars,
  garage: {
    title: "Meine Garage",
    subtitle: "Ihr Fahrzeug. Unser Service.",
    tabs: {
      vehicle: "Mein Fahrzeug",
      upgrades: "Meine Upgrades",
      service: "Mein Service",
      documents: "Dokumente",
      warranty: "Garantie",
    },
    batteryHealth: "Batteriegesundheit",
    nextService: "Nächster Service",
    timeline: "Service-Verlauf",
  },
  fleet: {
    title: "Gewerbe & Flotten",
    subtitle: "Elektro-Transporter und Nutzfahrzeuge für Betriebe in der Inn-Salzach-Region.",
    audiences: ["Landwirtschaft", "Handwerk", "Hotels", "Gemeinden", "Facility Management"],
  },
  journal: {
    title: "Ratgeber & Wissen",
    subtitle: "Praxiswissen zur E-Mobilität — verständlich, regional, ehrlich.",
  },
  upgrades: {
    title: "Zubehör & Upgrades",
    subtitle: "Batterie-Pakete, Cargo, Winterausstattung — passend zu Ihrem Fahrzeug.",
    philosophy:
      "Vom erweiterten Akku bis zur Werkstattbox: Erweiterungen, die Ihren Einsatz wirklich unterstützen.",
  },
} as const;

export interface VehicleScenario {
  id: string;
  title: string;
  headline: string;
  description: string;
  packageName: string;
  accessories: string[];
  image?: string;
}

export interface VehicleDNA {
  slug: string;
  essence: string;
  scenarios: VehicleScenario[];
}

export const vehicleDNA: VehicleDNA[] = [
  {
    slug: "efo-em8-elektro-chopper",
    essence: "Freiheit auf zwei Rädern. Leise. Kraftvoll.",
    scenarios: [
      {
        id: "urban",
        title: "Für die Stadt",
        headline: "Leise durch die Metropole.",
        description:
          "Kompakte Reichweite, LED-Beleuchtung, digitales Cockpit — urbaner Cruiser ohne Emissionen.",
        packageName: "Urban Cruiser Paket",
        accessories: ["acc-lights", "acc-storage"],
      },
      {
        id: "tour",
        title: "Für die Tour",
        headline: "Alpenvorland. Weite Straßen.",
        description:
          "Erweitertes Batteriepaket, Speichenräder, Wetterschutz — für Ausfahrten in der Region.",
        packageName: "Grand Tour Paket",
        accessories: ["acc-cargo", "acc-winter"],
      },
      {
        id: "style",
        title: "Für den Stil",
        headline: "Statement auf Asphalt.",
        description:
          "Chrom-Akzente, Custom-Speichen, Ambiente-Licht — wenn Design die Priorität ist.",
        packageName: "Signature Paket",
        accessories: ["acc-lights"],
      },
    ],
  },
  {
    slug: "e-truck-45-transporter",
    essence: "Arbeit elektrisch. Für Hof und Gewerbe.",
    scenarios: [
      {
        id: "farm",
        title: "Für den Hof",
        headline: "Designed for farms.",
        description:
          "Zuladung, Anhängerkupplung, Werkzeugbox — der stille Helfer auf dem Land.",
        packageName: "Farm Utility Paket",
        accessories: ["acc-hitch", "acc-storage", "acc-winch"],
      },
      {
        id: "craft",
        title: "Für das Handwerk",
        headline: "Designed for craftsmen.",
        description:
          "Ladefläche, Dachbox, Zusatzbeleuchtung — Ihr mobiler Werkstattbegleiter.",
        packageName: "Pro Work Paket",
        accessories: ["acc-rack", "acc-cargo", "acc-lights"],
      },
      {
        id: "resort",
        title: "Für Hotels & Gastronomie",
        headline: "Designed for hospitality.",
        description:
          "Leiser Betrieb, Premium-Finish, Wetterpaket — Gäste erleben Nachhaltigkeit.",
        packageName: "Hospitality Paket",
        accessories: ["acc-winter", "acc-mudguards"],
      },
    ],
  },
  {
    slug: "ego-ek4-moped-auto",
    essence: "Familie. Stadt. Alltag.",
    scenarios: [
      {
        id: "family",
        title: "Für Familien",
        headline: "Vier Sitze. Ein Fahrzeug.",
        description:
          "60V/125Ah Batterieoptionen, bis zu 120 km Reichweite — der Alltagsheld für Simbach und Umgebung.",
        packageName: "Family Paket",
        accessories: ["acc-winter", "acc-storage"],
      },
      {
        id: "city",
        title: "Für die Stadt",
        headline: "Parkplatz? Kein Problem.",
        description: "Kompakt, wendig, emissionsfrei — die smarte Alternative zum Zweitwagen.",
        packageName: "City Paket",
        accessories: ["acc-mudguards"],
      },
    ],
  },
];

export const journalArticles = [
  {
    slug: "elektro-chopper-guide",
    category: "Leitfaden",
    title: "Der ultimative E-Chopper Leitfaden",
    excerpt:
      "Reichweite, Zulassung, Wartung — alles, was Sie vor dem Kauf wissen sollten. Von unseren Experten in Simbach am Inn.",
    readTime: "12 Min.",
    date: "März 2026",
    image: images.em8[0],
    featured: true,
  },
  {
    slug: "fleet-elektrifizierung",
    category: "Gewerbe",
    title: "Elektro-Transporter für Betriebe in der Region",
    excerpt:
      "Wie Handwerks- und Hofbetriebe zwischen Simbach und Braunau Emissionen senken und den letzten Kilometer elektrisch fahren.",
    readTime: "8 Min.",
    date: "Februar 2026",
    image: images.etruck[0],
    featured: false,
  },
  {
    slug: "batterie-gesundheit",
    category: "Service",
    title: "Batteriegesundheit verstehen",
    excerpt:
      "Was Ihr Fahrzeug über den Akku mitteilt — und wie unsere Werkstatt in Simbach die Lebensdauer schützt.",
    readTime: "6 Min.",
    date: "Februar 2026",
    image: images.ek4[0],
    featured: false,
  },
  {
    slug: "winter-mobilitaet",
    category: "Ratgeber",
    title: "E-Mobilität im Winter",
    excerpt:
      "Reichweite, Pflege und das richtige Zubehör — sicher unterwegs in der Inn-Salzach-Region.",
    readTime: "7 Min.",
    date: "Januar 2026",
    image: "https://ebuddys.at/wp-content/uploads/2024/11/29_0.jpg",
    featured: false,
  },
] as const;

export const upgradeStories = [
  {
    id: "workspace",
    title: "Mobiles Arbeitsstudio",
    narrative:
      "Verwandeln Sie Ihren Transporter in einen professionellen mobilen Arbeitsplatz — mit Dachbox, LED-Bar und abschließbarem Stauraum.",
    items: ["Dachgepäckträger", "Dachbox", "Zusatzscheinwerfer", "Stauraumbox"],
    priceFrom: 1347,
  },
  {
    id: "adventure",
    title: "Abenteuer-Paket",
    narrative:
      "Für Gelände und lange Touren. Winde, Schutz, Winterreifen — bereit für jedes Terrain.",
    items: ["Seilwinde", "Schmutzfänger", "Winterpaket"],
    priceFrom: 1409,
  },
  {
    id: "hospitality",
    title: "Gastronomie & Resort",
    narrative:
      "Leiser, sauberer, zuverlässig. Das Fahrzeug, das Ihre Gäste überzeugt — ohne Lärm.",
    items: ["Winterpaket", "Anhängerkupplung", "Ambiente-Upgrade"],
    priceFrom: 1279,
  },
];

export function getVehicleDNA(slug: string): VehicleDNA | undefined {
  return vehicleDNA.find((v) => v.slug === slug);
}
