import { images } from "./images";
import { products, formatPrice } from "./products";

export const categories = [
  {
    id: "kleinwagen",
    title: "Elektro Kleinwagen",
    subtitle: "AMY, Star & mehr",
    image: images.category.kleinwagen,
  },
  {
    id: "transporter",
    title: "Elektro-Transporter",
    subtitle: "E-Truck & Nutzfahrzeuge",
    image: images.category.transporter,
  },
  {
    id: "quads",
    title: "Quads",
    subtitle: "Gelände & Freizeit",
    image: images.category.quads,
  },
  {
    id: "motorraeder",
    title: "Motorräder",
    subtitle: "Chopper & Cruiser",
    image: images.category.motorraeder,
  },
  {
    id: "mopedauto",
    title: "Mopedauto 45 km/h",
    subtitle: "E-GO eK4 & 4-Sitzer",
    image: images.category.mopedauto,
  },
  {
    id: "utv",
    title: "UTVs",
    subtitle: "Utility & Gelände",
    image: images.equad[0],
  },
  {
    id: "roller",
    title: "Roller & Moped",
    subtitle: "Stadt & Alltag",
    image: images.category.roller,
  },
  {
    id: "kabinenroller",
    title: "Kabinenroller",
    subtitle: "TukTuk & mehr",
    image: images.ek4[0],
  },
  {
    id: "kinder",
    title: "Kinder Fahrzeuge",
    subtitle: "Sicher & spaßig",
    image: images.category.kinder,
  },
  {
    id: "zubehoer",
    title: "Zubehör",
    subtitle: "Ladegeräte & mehr",
    image: images.category.zubehoer,
  },
];

export const whyChooseUs = [
  {
    title: "Persönliche Beratung",
    description:
      "Jede Bestellung wird geprüft. Wir kontaktieren Sie persönlich, besprechen Ihre Anforderungen und klären alle Details — erst danach erfolgt die Bestellung.",
    image: images.em8[0],
  },
  {
    title: "Service in Simbach",
    description:
      "Werkstatt, Übergabe und Einweisung vor Ort in Simbach am Inn — plus Partner in der gesamten Inn-Salzach-Region.",
    image: images.etruck[0],
  },
  {
    title: "Geprüfte Fahrzeuge",
    description:
      "EU-konforme E-Fahrzeuge von E-GO, EEC, EFO und weiteren Marken — inspiziert und dokumentiert.",
    image: images.star[0],
  },
  {
    title: "Ersatzteile",
    description:
      "Original-Ersatzteile ab Lager. Versand innerhalb von 48 Stunden — auch für ältere Modelle.",
    image: images.equad[0],
  },
  {
    title: "Gewährleistung",
    description:
      "Transparente Garantie auf Fahrzeuge und Komponenten. Betreuung über unsere Werkstatt in Simbach.",
    image: images.ek4[0],
  },
  {
    title: "Flexible Zahlung",
    description:
      "Zahlungsmethode wird nach persönlicher Rücksprache vereinbart — Überweisung, Rechnung oder Finanzierung.",
    image: images.ev3000[0],
  },
];

export const featuredSpecs = [
  { label: "Höchstgeschw.", value: "120", unit: "km/h", position: { top: "15%", left: "10%" } },
  { label: "Reichweite", value: "150", unit: "km", position: { top: "30%", right: "8%" } },
  { label: "Batterie", value: "72V 117Ah", unit: "", position: { top: "52%", left: "5%" } },
  { label: "Motor", value: "8000", unit: "W", position: { top: "45%", right: "12%" } },
  { label: "Gewicht", value: "95", unit: "kg", position: { bottom: "30%", left: "15%" } },
  { label: "Zuladung", value: "150", unit: "kg", position: { bottom: "22%", right: "10%" } },
];

export const showcaseProducts = products.map((p) => ({
  id: p.id,
  name: p.name,
  tagline: p.tagline,
  price: formatPrice(p.price),
  range: p.specs.range,
  image: p.images[0],
  slug: p.slug,
}));

export const accessories = [
  {
    name: "Schnellladegerät 72V",
    price: "€289,00",
    image: images.category.zubehoer,
  },
  {
    name: "Carbon Integralhelm",
    price: "€189,00",
    image: images.em8[0],
  },
  {
    name: "Allwetter-Abdeckplane",
    price: "€129,00",
    image: images.etruck[0],
  },
  {
    name: "Anhängerkupplung",
    price: "€349,00",
    image: images.category.transporter,
  },
];

export const stories = [
  {
    title: "E-GO eK4 im Alltag in Simbach",
    excerpt:
      "Wie eine Familie aus der Inn-Salzach-Region mit dem Mopedauto leise und günstig mobil bleibt.",
    image: images.ek4[0],
    readTime: "6 Min.",
  },
  {
    title: "E-Truck auf dem Hof",
    excerpt:
      "Ein Betrieb zwischen Simbach und Braunau setzt auf den E-Truck 45 — emissionsfrei im Last-Mile-Einsatz.",
    image: images.etruck[0],
    readTime: "8 Min.",
  },
  {
    title: "Chopper-Tour im Alpenvorland",
    excerpt:
      "Mit dem EFO EM8 durch die Region — ohne Lärm, ohne Abgase, mit Werkstatt-Support vor Ort.",
    image: images.em8[4],
    readTime: "5 Min.",
  },
];

export const techFeatures = [
  {
    id: "battery",
    title: "Lithium-Architektur",
    description:
      "LiFePO4 und Lithium-Ionen Zellen mit intelligentem Batteriemanagement und Thermalschutz.",
  },
  {
    id: "charging",
    title: "Flexibles Laden",
    description:
      "Standard- und Schnellladegeräte für 60V und 72V Systeme. Zuhause oder unterwegs.",
  },
  {
    id: "motor",
    title: "Brushless-Leistung",
    description:
      "Wartungsarme Brushless-Motoren mit sofortigem Drehmoment und Rekuperation.",
  },
];
