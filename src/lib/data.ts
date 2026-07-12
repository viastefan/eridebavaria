import { images } from "./images";
import { products, formatPrice } from "./products";

export const categories = [
  {
    id: "kleinwagen",
    title: "Elektro Kleinwagen",
    subtitle: "Zugelassen · Urban",
    image: images.category.kleinwagen,
  },
  {
    id: "transporter",
    title: "Elektro-Transporter",
    subtitle: "Gewerbe & Logistik",
    image: images.category.transporter,
  },
  {
    id: "quads",
    title: "Quads",
    subtitle: "Gelände & Abenteuer",
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
    subtitle: "4 Sitzer & mehr",
    image: images.category.mopedauto,
  },
  {
    id: "roller",
    title: "Roller & Scooter",
    subtitle: "Stadt & Alltag",
    image: images.category.roller,
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
    subtitle: "Alles dazu",
    image: images.category.zubehoer,
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

export const whyChooseUs = [
  {
    title: "Persönliche Beratung",
    description:
      "Jede Bestellung wird geprüft. Wir kontaktieren dich persönlich, besprechen deine Anforderungen und klären alle Details.",
    image: images.em8[0],
  },
  {
    title: "EU-weiter Versand",
    description:
      "Lieferung in ganz Europa. Sorgfältige Verpackung, Tracking und Premium-Handling auf Anfrage.",
    image: images.etruck[0],
  },
  {
    title: "Geprüfte Fahrzeuge",
    description:
      "Jedes Fahrzeug wird vor Auslieferung inspiziert und auf europäische Standards zertifiziert.",
    image: images.star[0],
  },
  {
    title: "Ersatzteile",
    description:
      "Original-Ersatzteile ab Lager. Versand innerhalb von 48 Stunden in ganz Europa.",
    image: images.equad[0],
  },
  {
    title: "Gewährleistung",
    description:
      "Umfassende Garantie auf alle Fahrzeuge. Transparent, fair und unkompliziert.",
    image: images.ek4[0],
  },
  {
    title: "Sichere Zahlung",
    description:
      "Flexible Zahlungsmethoden nach persönlicher Rücksprache. Apple Pay, Überweisung, Rechnung.",
    image: images.ev3000[0],
  },
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
    title: "Von Braunau in die Berge",
    excerpt:
      "Wie eine Familie mit dem E-GO eK4 zwei Autos ersetzte — leise, günstig, emissionsfrei.",
    image: images.ek4[0],
    readTime: "6 Min.",
  },
  {
    title: "Der letzte Kilometer",
    excerpt:
      "Ein Logistikunternehmen in Oberösterreich senkte Emissionen um 40% mit dem E-Truck 45.",
    image: images.etruck[0],
    readTime: "8 Min.",
  },
  {
    title: "Stille Horizonte",
    excerpt:
      "Mit dem EFO EM8 Chopper durch die Alpen — ohne Lärm, ohne Abgase, pure Freiheit.",
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
