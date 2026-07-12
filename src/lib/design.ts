/** Design system tokens — single source of truth */
export const design = {
  colors: {
    background: "#FFFFFF",
    surface: "#F7F8FA",
    text: "#111111",
    muted: "#667085",
    accent: "#4B7BEC",
    border: "rgba(17, 17, 17, 0.08)",
  },
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    full: "9999px",
  },
  maxWidth: "1280px",
  grid: 8,
} as const;

export const mainNav = [
  { label: "Entdecken", href: "/discover" },
  { label: "Fahrzeuge", href: "/shop" },
  { label: "Konfigurator", href: "/shop?configure=1" },
  { label: "Vergleich", href: "/compare" },
  { label: "Zubehör", href: "/shop?tab=accessories" },
  { label: "Ersatzteile", href: "/parts" },
  { label: "Service", href: "/service" },
  { label: "Business", href: "/fleet" },
  { label: "Journal", href: "/journal" },
] as const;

export const accountNav = { label: "Garage", href: "/garage" } as const;
