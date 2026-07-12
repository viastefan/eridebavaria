import type { Product } from "./types";
import {
  HERO_VIDEO_DARK,
  HERO_VIDEO_LIGHT,
  HERO_VIDEO_FALLBACK,
  HERO_POSTER_SRC,
  HERO_SCROLL_VH,
} from "./hero-journey";
import { segmentOpacity } from "./hero-journey";
import { images } from "./images";

export type FrameLayout =
  | "intro-left"
  | "t1-left"
  | "t1-hotspots"
  | "showroom-left";

export interface HeadlineWord {
  text: string;
  muted?: boolean;
}

export interface HotspotCard {
  label: string;
  image: string;
  top: string;
  left?: string;
  right?: string;
}

export interface GlassStat {
  label: string;
  value: string;
  image?: string;
}

export interface ShowroomSpec {
  label: string;
  value: string;
}

export interface ShowroomProductCard {
  href: string;
  model: string;
  image: string;
  /** Preis in EUR — stärkerer Verkaufsimpuls in der Hero-Karte */
  price?: number;
  availability?: "in-stock" | "pre-order" | "sold-out";
  /** Produkt-ID für Schnell-Warenkorb */
  productId?: string;
  prompt: string;
  ctaLabel: string;
  ctaHref?: string;
}

export interface CinematicFrame {
  id: string;
  layout: FrameLayout;
  chapter: string;
  headline: string[];
  /** Per-line word tones for t1 / showroom frames */
  headlineWords?: HeadlineWord[][];
  /** Hide chapter + vehicle type above headline (e.g. opening frame) */
  hideHeaderMeta?: boolean;
  /** Small category line above headline */
  vehicleType?: string;
  description?: string;
  stat?: GlassStat;
  productCard?: ShowroomProductCard;
  specs?: ShowroomSpec[];
  hotspots?: HotspotCard[];
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** Scroll timeline segment (0–1), synced to video */
  segmentStart?: number;
  segmentEnd?: number;
}

export interface CinematicHeroConfig {
  frames: CinematicFrame[];
  videoSrc?: string;
  /** Light-mode scroll video (separate from dark `videoSrc`) */
  videoSrcLight?: string;
  videoFallback?: string;
  posterSrc: string;
  imageSequence?: string[];
  scrollVh?: number;
  /** Full-bleed showroom — no card inset animation */
  fullscreen?: boolean;
}

/** Showroom journey — scroll segments match video camera beats */
export const HOME_CINEMATIC_FRAMES: CinematicFrame[] = [
  {
    id: "opening",
    layout: "showroom-left",
    chapter: "01",
    hideHeaderMeta: true,
    segmentStart: 0,
    segmentEnd: 0.2,
    headline: ["Die Zukunft", "der Mobilität"],
    headlineWords: [
      [{ text: "Die", muted: true }, { text: "Zukunft", muted: false }],
      [{ text: "der", muted: true }, { text: "Mobilität", muted: false }],
    ],
    description:
      "Fünf elektrische Fahrzeuge. Ein Raum. Eine Kollektion — entdecken Sie jedes Modell durch Bewegung.",
    specs: [
      { label: "Fahrzeuge", value: "5" },
      { label: "Reichweite bis", value: "150 km" },
      { label: "Service", value: "Simbach" },
    ],
    primaryCta: { label: "Kollektion entdecken", href: "/shop" },
  },
  {
    id: "city",
    layout: "showroom-left",
    chapter: "02",
    vehicleType: "Elektro Kleinwagen",
    segmentStart: 0.2,
    segmentEnd: 0.35,
    headline: ["Urban", "Eleganz"],
    headlineWords: [
      [{ text: "Urban", muted: false }],
      [{ text: "Eleganz", muted: true }],
    ],
    description:
      "Kompakte Stadtform, klare Proportionen, leise Elektroantriebe — für Alltag und Kurzstrecke im urbanen Raum.",
    specs: [
      { label: "Modell", value: "EEC Star 60" },
      { label: "Tempo", value: "60 km/h" },
      { label: "Reichweite", value: "120 km" },
    ],
    primaryCta: { label: "Fahrzeug ansehen", href: "/product/eec-star-60" },
    productCard: {
      href: "/product/eec-star-60",
      model: "EEC Star 6.0",
      image: images.star[0],
      price: 12990,
      availability: "in-stock",
      productId: "eec-star-60",
      prompt: "Wir beraten Sie persönlich — unverbindlich und schnell.",
      ctaLabel: "Beratung anfragen",
      ctaHref: "/#beratung",
    },
  },
  {
    id: "cargo",
    layout: "showroom-left",
    chapter: "03",
    vehicleType: "Elektro-Transporter",
    segmentStart: 0.35,
    segmentEnd: 0.5,
    headline: ["Gebaut für", "Last"],
    headlineWords: [
      [{ text: "Gebaut", muted: false }, { text: "für", muted: true }],
      [{ text: "Last", muted: false }],
    ],
    description:
      "Großzügiger Laderaum, robuste Konstruktion, emissionsfreie Logistik — professionelle Mobilität für Betrieb und Gewerbe.",
    specs: [
      { label: "Modell", value: "E-Truck 4.5" },
      { label: "Zuladung", value: "500 kg" },
      { label: "Reichweite", value: "100 km" },
    ],
    primaryCta: { label: "Fahrzeug ansehen", href: "/product/e-truck-45-transporter" },
    productCard: {
      href: "/product/e-truck-45-transporter",
      model: "E-Truck 4.5",
      image: images.etruck[0],
      price: 6790,
      availability: "in-stock",
      productId: "e-truck-45",
      prompt: "Ideal für Betrieb & Logistik — wir finden die passende Lösung.",
      ctaLabel: "Gewerbe anfragen",
      ctaHref: "/#beratung",
    },
  },
  {
    id: "quad",
    layout: "showroom-left",
    chapter: "04",
    vehicleType: "Elektro Quad",
    segmentStart: 0.5,
    segmentEnd: 0.65,
    headline: ["Kraft", "im Gelände"],
    headlineWords: [
      [{ text: "Kraft", muted: false }],
      [{ text: "im", muted: true }, { text: "Gelände", muted: false }],
    ],
    description:
      "Breite Reifen, starke Federung, kraftvoller Antrieb — für Abenteuer, Hof und unbefestigtes Terrain.",
    specs: [
      { label: "Modell", value: "E8 Series" },
      { label: "Leistung", value: "4000 W" },
      { label: "Antrieb", value: "4×4" },
    ],
    primaryCta: { label: "Fahrzeug ansehen", href: "/product/e8-series-e-quad" },
    productCard: {
      href: "/product/e8-series-e-quad",
      model: "E8 Series E-Quad",
      image: images.equad[0],
      price: 8490,
      availability: "in-stock",
      productId: "e8-quad",
      prompt: "Probefahrt oder Beratung — ganz ohne Druck.",
      ctaLabel: "Beratung anfragen",
      ctaHref: "/#beratung",
    },
  },
  {
    id: "light",
    layout: "showroom-left",
    chapter: "05",
    vehicleType: "Elektro Roller",
    segmentStart: 0.65,
    segmentEnd: 0.8,
    headline: ["Leicht", "Präzise"],
    headlineWords: [
      [{ text: "Leicht", muted: false }],
      [{ text: "Präzise", muted: true }],
    ],
    description:
      "Minimalistisches Design, integrierte Batterie, premium Verarbeitung — agile Mobilität für Stadt und Kurzstrecke.",
    specs: [
      { label: "Modell", value: "EFO EV3000" },
      { label: "Tempo", value: "45 km/h" },
      { label: "Gewicht", value: "95 kg" },
    ],
    primaryCta: { label: "Fahrzeug ansehen", href: "/product/efo-ev3000-roller" },
    productCard: {
      href: "/product/efo-ev3000-roller",
      model: "EFO EV3000",
      image: images.ev3000[0],
      price: 3290,
      availability: "in-stock",
      productId: "efo-ev3000",
      prompt: "Perfekt für die Stadt — wir helfen bei der Auswahl.",
      ctaLabel: "Persönlich beraten lassen",
      ctaHref: "/#beratung",
    },
  },
  {
    id: "ecosystem",
    layout: "showroom-left",
    chapter: "06",
    vehicleType: "Komplette Kollektion",
    segmentStart: 0.8,
    segmentEnd: 1,
    headline: ["Ein", "Ökosystem"],
    headlineWords: [
      [{ text: "Ein", muted: true }],
      [{ text: "Ökosystem", muted: false }],
    ],
    description:
      "Von der Stadt bis ins Gelände — fünf Fahrzeuge, ein Ansprechpartner in Simbach am Inn. Beratung, Service, Ersatzteile.",
    specs: [
      { label: "Beratung", value: "Persönlich" },
      { label: "Region", value: "Inn-Salzach" },
      { label: "Rückmeldung", value: "24h" },
    ],
    primaryCta: { label: "Alle Fahrzeuge", href: "/shop" },
    secondaryCta: { label: "Beratung anfragen", href: "/shop" },
  },
];

export const HOME_CINEMATIC_CONFIG: CinematicHeroConfig = {
  frames: HOME_CINEMATIC_FRAMES,
  videoSrc: HERO_VIDEO_DARK,
  videoSrcLight: HERO_VIDEO_LIGHT,
  videoFallback: HERO_VIDEO_FALLBACK,
  posterSrc: HERO_POSTER_SRC,
  scrollVh: HERO_SCROLL_VH,
  fullscreen: true,
};

/** Card → fullscreen during first ~20% of scroll (product pages) */
export function containerTransform(progress: number) {
  const t = Math.min(progress / 0.2, 1);
  const eased = 1 - Math.pow(1 - t, 2.2);
  const inset = 8 * (1 - eased);
  return {
    margin: `${inset}px`,
    borderRadius: `${12 * (1 - eased)}px`,
  };
}

export function wordsFromHeadline(frame: CinematicFrame): HeadlineWord[][] {
  if (frame.headlineWords) return frame.headlineWords;
  return frame.headline.map((line) =>
    line.split(" ").map((text, i) => ({ text, muted: i % 2 === 1 }))
  );
}

export function usesSegmentTiming(frames: CinematicFrame[]): boolean {
  return frames.some((f) => f.segmentStart !== undefined);
}

export function getActiveFrameIndex(progress: number, frames: CinematicFrame[]): number {
  if (!usesSegmentTiming(frames)) {
    return getFrameIndex(progress, frames.length);
  }

  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    const start = frame.segmentStart ?? 0;
    const end = frame.segmentEnd ?? 1;
    const isLast = i === frames.length - 1;
    if (progress >= start && (isLast ? progress <= end : progress < end)) {
      return i;
    }
  }

  return frames.length - 1;
}

export function getFrameOpacity(
  progress: number,
  frame: CinematicFrame,
  index: number,
  frameCount: number,
  fade = 0.03
): number {
  if (frame.segmentStart !== undefined && frame.segmentEnd !== undefined) {
    const start = frame.segmentStart;
    const end = frame.segmentEnd;
    if (progress < start || progress > end) return 0;

    const span = end - start;
    const fadeOut = Math.min(fade, span * 0.28);
    const fadeIn =
      frame.layout === "showroom-left" && start === 0
        ? 0
        : Math.min(fade, span * 0.28);

    if (fadeIn > 0 && progress < start + fadeIn) {
      const t = (progress - start) / fadeIn;
      return t * t * (3 - 2 * t);
    }
    if (progress > end - fadeOut) {
      const t = (end - progress) / fadeOut;
      return t * t * (3 - 2 * t);
    }
    return 1;
  }
  return frameOpacity(progress, index, frameCount, fade);
}

export function getLocalFrameProgress(
  progress: number,
  frame: CinematicFrame,
  index: number,
  frameCount: number
): number {
  if (frame.segmentStart !== undefined && frame.segmentEnd !== undefined) {
    const start = frame.segmentStart;
    const end = frame.segmentEnd;
    return Math.min(Math.max((progress - start) / (end - start), 0), 1);
  }
  return localFrameProgress(progress, index, frameCount);
}

export function buildProductCinematicFrames(product: Product): CinematicFrame[] {
  const imgs = product.images;
  const pick = (i: number) => imgs[i % imgs.length];

  return [
    {
      id: "name",
      layout: "intro-left",
      chapter: "01",
      headline: [product.brand.toUpperCase(), product.name.replace(new RegExp(product.brand, "i"), "").trim().toUpperCase() || product.tagline.toUpperCase()],
      description: product.description,
      stat: { label: "REICHWEITE", value: product.specs.range, image: pick(0) },
      primaryCta: { label: "Konfigurieren", href: "#configure" },
      secondaryCta: { label: "Beratung", href: "#consultation" },
    },
    {
      id: "glide",
      layout: "t1-hotspots",
      chapter: "02",
      headline: ["GEBAUT FÜR", product.tagline.toUpperCase()],
      headlineWords: [
        [{ text: "GEBAUT", muted: false }, { text: "FÜR", muted: true }],
        [{ text: product.tagline.toUpperCase(), muted: false }],
      ],
      description: `${product.specs.power} · ${product.specs.battery} · ${product.specs.topSpeed}`,
      hotspots: [
        { label: "MOTOR", image: pick(1), top: "28%", left: "8%" },
        { label: "AKKU", image: pick(2), top: "32%", right: "8%" },
        { label: "DESIGN", image: pick(0), top: "62%", left: "10%" },
        { label: "DETAIL", image: pick(3), top: "58%", right: "10%" },
      ],
    },
    {
      id: "power",
      layout: "t1-left",
      chapter: "03",
      headline: ["LEISTUNG", "& REICHWEITE"],
      headlineWords: [
        [{ text: "LEISTUNG", muted: false }],
        [{ text: "&", muted: true }, { text: "REICHWEITE", muted: false }],
      ],
      description: `${product.specs.motor} — ${product.specs.charging} Ladezeit, ${product.specs.topSpeed} Höchstgeschwindigkeit.`,
      stat: { label: "LEISTUNG", value: product.specs.power, image: pick(1) },
      primaryCta: { label: "Spezifikationen", href: "#technology" },
    },
    {
      id: "craft",
      layout: "t1-hotspots",
      chapter: "04",
      headline: ["INGENIEURSKUNST", "IM DETAIL"],
      headlineWords: [
        [{ text: "INGENIEURSKUNST", muted: false }],
        [{ text: "IM", muted: true }, { text: "DETAIL", muted: false }],
      ],
      description: `Zuladung ${product.specs.payload} · ${product.specs.weight} · ${product.specs.dimensions}`,
      hotspots: [
        { label: "CHASSIS", image: pick(2), top: "30%", left: "7%" },
        { label: "COCKPIT", image: pick(3), top: "34%", right: "7%" },
        { label: "LADUNG", image: pick(4), top: "62%", left: "9%" },
        { label: "FINISH", image: pick(0), top: "58%", right: "9%" },
      ],
    },
    {
      id: "configure",
      layout: "t1-left",
      chapter: "05",
      headline: ["JETZT", "KONFIGURIEREN"],
      headlineWords: [
        [{ text: "JETZT", muted: false }],
        [{ text: "KONFIGURIEREN", muted: true }],
      ],
      description: product.tagline,
      primaryCta: { label: "Zum Konfigurator", href: "#configure" },
      secondaryCta: { label: "Angebot anfragen", href: "#consultation" },
    },
  ];
}

export function getFrameIndex(progress: number, frameCount: number): number {
  return Math.min(Math.floor(progress * frameCount), frameCount - 1);
}

export function frameOpacity(
  progress: number,
  index: number,
  frameCount: number,
  fade = 0.035
): number {
  const start = index / frameCount;
  const end = (index + 1) / frameCount;
  if (progress < start || progress > end) return 0;
  const span = end - start;
  const fadeIn = Math.min(fade, span * 0.35);
  const fadeOut = fadeIn;
  if (progress < start + fadeIn) {
    const t = (progress - start) / fadeIn;
    return t * t * (3 - 2 * t);
  }
  if (progress > end - fadeOut) {
    const t = (end - progress) / fadeOut;
    return t * t * (3 - 2 * t);
  }
  return 1;
}

export function localFrameProgress(progress: number, index: number, frameCount: number): number {
  const start = index / frameCount;
  const end = (index + 1) / frameCount;
  return Math.min(Math.max((progress - start) / (end - start), 0), 1);
}
