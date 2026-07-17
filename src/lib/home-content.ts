import { images } from "./images";
import { products } from "./products";

/** Porsche-style Promo-Kacheln (3er-Reihe unter Hero) */
export const homePromoCards = [
  {
    id: "ek4",
    title: "E-GO eK4",
    subtitle: "4 Sitze — ideal für Familie & Alltag.",
    href: "/product/ego-ek4-moped-auto",
    image: images.ek4[0],
  },
  {
    id: "em8",
    title: "EFO EM8 Chopper",
    subtitle: "120 km/h — für alle, die Fahrspaß lieben.",
    href: "/product/efo-em8-elektro-chopper",
    image: images.em8[0],
  },
  {
    id: "etruck",
    title: "E-Truck 45",
    subtitle: "Robust, wirtschaftlich — perfekt fürs Gewerbe.",
    href: "/product/e-truck-45-transporter",
    image: images.etruck[0],
  },
] as const;

/** Porsche-style Modellreihe (2-Spalten-Grid) */
export const homeModelCards = [
  {
    id: "kleinwagen",
    badges: ["Elektro"],
    title: "Elektro Kleinwagen",
    description: "Kompakte Stadtform mit bis zu 120 km Reichweite — ideal für Alltag und Kurzstrecke.",
    cta: "Kleinwagen entdecken",
    href: "/shop?category=kleinwagen",
    image: images.category.kleinwagen,
  },
  {
    id: "mopedauto",
    badges: ["Elektro", "45 km/h"],
    title: "Mopedauto",
    description: "4 Sitze, wetterfest und zulassungsfreundlich — für Familie, Senioren und Gewerbe.",
    cta: "Mopedautos entdecken",
    href: "/shop?category=mopedauto",
    image: images.category.mopedauto,
  },
  {
    id: "transporter",
    badges: ["Elektro"],
    title: "Elektro-Transporter",
    description: "Robuste Nutzfahrzeuge mit großzügigem Laderaum — emissionsfrei für Betrieb und Logistik.",
    cta: "Transporter entdecken",
    href: "/shop?category=transporter",
    image: images.category.transporter,
  },
  {
    id: "quads",
    badges: ["Elektro"],
    title: "E-Quads",
    description: "Geländetauglich mit kraftvollem Antrieb — für Hof, Freizeit und unbefestigtes Terrain.",
    cta: "Quads entdecken",
    href: "/shop?category=quads",
    image: images.category.quads,
  },
  {
    id: "motorraeder",
    badges: ["Elektro"],
    title: "Elektro-Motorräder",
    description: "Chopper und Cruiser mit bis zu 120 km/h — sportlich, leise und emissionsfrei.",
    cta: "Motorräder entdecken",
    href: "/shop?category=motorraeder",
    image: images.category.motorraeder,
  },
  {
    id: "roller",
    badges: ["Elektro", "45 km/h"],
    title: "Roller & Scooter",
    description: "Wendige Stadtflitzer mit integrierter Batterie — perfekt für urbane Mobilität.",
    cta: "Roller entdecken",
    href: "/shop?category=roller",
    image: images.category.roller,
  },
] as const;

/** Highlights — 3er Shop-Reihe */
export const homeHighlightCards = [
  {
    id: "fleet",
    title: "Gewerbe & Flotten",
    subtitle: "Mehrere Fahrzeuge für Ihren Betrieb — mit persönlicher Beratung aus Simbach.",
    cta: "Flotten anfragen",
    href: "/fleet",
    image: images.etruck[1] ?? images.etruck[0],
  },
  {
    id: "shop",
    title: "Fahrzeugkatalog",
    subtitle: "Alle Modelle mit Preis, Verfügbarkeit und digitalem Showroom.",
    cta: "Zum Katalog",
    href: "/shop",
    image: images.star[0],
  },
  {
    id: "accessories",
    title: "Zubehör & Ersatzteile",
    subtitle: "Ladegeräte, Helme, Abdeckplanen — passend zu Ihrem Fahrzeug.",
    cta: "Zum Shop",
    href: "/shop?tab=accessories",
    image: images.category.zubehoer,
  },
] as const;

export const homeLegalNote =
  "Alle Preise inkl. MwSt. · Reichweitenangaben bei idealen Bedingungen · Verfügbarkeit und Lieferzeit auf Anfrage · Persönliche Beratung aus Simbach am Inn.";

export const homeFeaturedProducts = products.slice(0, 3);
