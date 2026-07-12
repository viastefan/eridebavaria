export interface HeroChapter {
  start: number;
  end: number;
  label: string;
  headline: string[];
  index: string;
  bottomLine: string;
}

export const HERO_VIDEO_DARK = "/hitenrgrund_ganz_leer_lassn_ke.mp4";
export const HERO_VIDEO_LIGHT = "/erstelle_mir_das_video_jetzt_i.mp4";
/** @deprecated use HERO_VIDEO_DARK */
export const HERO_VIDEO_SRC = HERO_VIDEO_DARK;
export const HERO_VIDEO_FALLBACK = HERO_VIDEO_LIGHT;
export const HERO_POSTER_SRC = "/media/veo-hero-poster.png";
export const HERO_VIDEO_DURATION = 10;

/** Scroll distance — longer = slower, more cinematic scrub */
export const HERO_SCROLL_VH = 920;
export const HERO_SCROLL_VH_MOBILE = 540;

export const heroChapters: HeroChapter[] = [
  {
    start: 0,
    end: 0.2,
    label: "ERIDE BAVARIA — SIMBACH AM INN",
    headline: ["Scrollen, um", "Ihre Mobilität", "zu entdecken."],
    index: "01 — E-Fahrzeuge",
    bottomLine: "Quads. Mopedautos. Transporter.",
  },
  {
    start: 0.2,
    end: 0.4,
    label: "ERIDE BAVARIA — SIMBACH AM INN",
    headline: ["Persönliche", "Beratung", "vor Ort."],
    index: "02 — Service",
    bottomLine: "Anfrage. Rückruf. Lösung.",
  },
  {
    start: 0.4,
    end: 0.6,
    label: "ERIDE BAVARIA — SIMBACH AM INN",
    headline: ["Werkstatt", "& Ersatzteile", "in der Region."],
    index: "03 — Betreuung",
    bottomLine: "Wartung. Teile. Garantie.",
  },
  {
    start: 0.6,
    end: 0.8,
    label: "ERIDE BAVARIA — SIMBACH AM INN",
    headline: ["Passend", "für Ihren", "Alltag."],
    index: "04 — Konfiguration",
    bottomLine: "Batterie. Zubehör. Cargo.",
  },
  {
    start: 0.8,
    end: 1,
    label: "ERIDE BAVARIA — SIMBACH AM INN",
    headline: ["Bereit", "für die", "Zukunft."],
    index: "05 — eRide Bavaria",
    bottomLine: "Entdecken. Beraten lassen. — und losfahren.",
  },
];

export function getActiveChapter(progress: number): HeroChapter {
  return (
    heroChapters.find((c) => progress >= c.start && progress < c.end) ??
    heroChapters[heroChapters.length - 1]
  );
}

export function segmentOpacity(
  progress: number,
  start: number,
  end: number,
  fade = 0.04
): number {
  if (progress < start || progress > end) return 0;
  const fadeIn = Math.min(fade, (end - start) * 0.3);
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

/** Card → fullscreen: 0–25% scroll */
export function containerTransform(progress: number) {
  const t = Math.min(progress / 0.25, 1);
  const eased = 1 - Math.pow(1 - t, 2.2);
  const inset = 8 * (1 - eased);
  return {
    margin: `${inset}px`,
    borderRadius: `${12 * (1 - eased)}px`,
  };
}
