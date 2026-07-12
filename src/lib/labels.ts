import type { Availability, ProductBadge } from "./types";

export const labels = {
  home: "Startseite",
  collection: "Kollektion",
  shop: "Katalog",
  search: "Suche",
  cart: "Warenkorb",
  account: "Konto",
  compare: "Vergleich",
  checkout: "Zur Kasse",
  wishlist: "Merkliste",
  scroll: "Scrollen",
  remove: "Entfernen",
  add: "Hinzufügen",
  addToCart: "In den Warenkorb",
  back: "Zurück",
  continue: "Weiter",
  clearAll: "Alle löschen",
  clearFilters: "Filter zurücksetzen",
  filters: "Filter",
  noResults: "Keine Ergebnisse für",
  emptyCart: "Dein Warenkorb ist leer",
  exploreCollection: "Kollektion entdecken",
  subtotal: "Zwischensumme",
  total: "Gesamt",
  quantity: "Menge",
  specification: "Spezifikation",
  specifications: "Spezifikationen",
  configuredPrice: "Konfigurierter Preis",
  story: "Die Geschichte",
  accessories: "Zubehör",
  completeSetup: "Ausstattung vervollständigen",
  vehicleSupport: "Fahrzeughilfe",
  supportDesc: "Handbücher, Videos, Garantie & Ersatzteile",
  warranty2y: "2 Jahre Garantie inklusive",
  warranty2yFull: "2 Jahre Vollgarantie",
  freeShipping: "Kostenloser EU-Versand",
  inStock: "Auf Lager",
  preOrder: "Vorbestellung",
  soldOut: "Ausverkauft",
  vehicles: "Fahrzeuge",
  vehicle: "Fahrzeug",
  noMatchFilters: "Keine Fahrzeuge entsprechen deinen Filtern.",
  welcomeFuture: "Willkommen in der Zukunft",
  orderConfirmed:
    "Deine Bestellung ist bestätigt. Du erhältst Handbuch, digitale Garantie und Tutorial-Videos per E-Mail.",
  viewAccount: "Im Konto ansehen",
  contactInfo: "Kontaktdaten",
  shippingAddress: "Lieferadresse",
  paymentMethod: "Zahlungsmethode",
  reviewOrder: "Bestellung prüfen",
  completePurchase: "Kauf abschließen",
  orderSummary: "Bestellübersicht",
  securePayment: "Deine Zahlung ist mit 256-Bit-Verschlüsselung gesichert",
  recent: "Zuletzt gesucht",
  trending: "Beliebt",
  searchPlaceholder: "Fahrzeuge, Zubehör suchen…",
  readStory: "Geschichte lesen",
  newsletterSuccess: "Willkommen in der Zukunft. Prüfe dein Postfach.",
  subscribe: "Abonnieren",
  probefahrt: "Probefahrt buchen",
  firstName: "Vorname",
  lastName: "Nachname",
  email: "E-Mail",
  phone: "Telefon",
  address: "Adresse",
  city: "Stadt",
  postalCode: "PLZ",
  country: "Land",
  cardNumber: "Kartennummer",
  securityCode: "Prüfnummer",
  reviewHint: "Bitte prüfe deine Bestellung vor dem Kaufabschluss.",
  needHelp: "Brauchst du Hilfe?",
  supportHours:
    "Unser bayerisches Service-Team ist Mo–Fr, 9:00–18:00 Uhr für dich erreichbar.",
  contactSupport: "Hilfe kontaktieren",
  compareAll: "Alle Fahrzeuge vergleichen",
  privacy: "Datenschutz",
  terms: "AGB",
  imprint: "Impressum",
  toggleMenu: "Menü öffnen",
  view360: "360° Ansicht",
  designedToMove: "Gemacht, um zu bewegen",
  everyDetail: "Jedes Detail",
  menu: "Menü",
  lightMode: "Hellmodus aktivieren",
  darkMode: "Dunkelmodus aktivieren",
  help: "Hilfe",
} as const;

export const specLabels = {
  battery: "Batterie",
  power: "Leistung",
  charging: "Ladezeit",
  range: "Reichweite",
  topSpeed: "Höchstgeschw.",
  payload: "Zuladung",
  seats: "Sitze",
  dimensions: "Abmessungen",
  weight: "Gewicht",
  motor: "Motor",
} as const;

export const badgeLabels: Record<ProductBadge, string> = {
  new: "Neu",
  popular: "Beliebt",
  limited: "Limitiert",
  premium: "Exklusiv",
};

export const availabilityLabels: Record<Availability, string> = {
  "in-stock": "Auf Lager",
  "pre-order": "Vorbestellung",
  "sold-out": "Ausverkauft",
};

export const paymentMethodLabels: Record<string, string> = {
  apple: "Apple Pay",
  google: "Google Pay",
  paypal: "PayPal",
  card: "Kreditkarte",
  invoice: "Rechnung",
  bank: "Banküberweisung",
};

export const checkoutSteps = ["Kontakt", "Lieferung", "Zahlung", "Prüfung"] as const;

export const accountTabs = [
  { id: "orders", label: "Bestellungen" },
  { id: "invoices", label: "Rechnungen" },
  { id: "warranty", label: "Garantie" },
  { id: "downloads", label: "Downloads" },
  { id: "wishlist", label: "Merkliste" },
  { id: "parts", label: "Ersatzteile" },
  { id: "vehicles", label: "Meine Fahrzeuge" },
  { id: "support", label: "Hilfe" },
] as const;

export const supportSections = [
  { title: "Bedienungsanleitung", description: "Vollständiger Leitfaden" },
  { title: "Tutorial-Videos", description: "Schritt-für-Schritt Anleitungen" },
  { title: "Häufige Fragen", description: "Antworten auf deine Fragen" },
  { title: "Ersatzteile", description: "Original-Komponenten" },
  { title: "Downloads", description: "Software & Dokumente" },
  { title: "Garantie", description: "Abdeckung & Reklamationen" },
  { title: "Service-Anfrage", description: "Werkstatttermin buchen" },
] as const;

export const megaMenuSections = {
  categories: "Kategorien",
  featured: "Im Fokus",
  discover: "Entdecken",
  vehicleFinder: "Fahrzeug-Finder",
  compareVehicles: "Fahrzeuge vergleichen",
  support: "Hilfe",
} as const;

export const configLabels = {
  color: "Farbe",
  wheels: "Räder",
  battery: "Batterie",
  roof: "Dach",
  cargo: "Ladefläche",
} as const;

export const filterLabels = {
  vehicleType: "Fahrzeugtyp",
  priceRange: "Preisbereich",
  upTo: "bis",
  minRange: "Min. Reichweite",
  availability: "Verfügbarkeit",
} as const;
