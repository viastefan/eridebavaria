/** Freundliche B2B-Shop-Texte — persönlich, aber klar onlineshop-artig */
export const commerceCopy = {
  shop: {
    title: "Fahrzeugkatalog",
    subtitle:
      "Alle Modelle mit Preis, Verfügbarkeit und digitalem Showroom — für Privatkunden, Gewerbe und Flotten. Wir begleiten Sie persönlich durch jede Anfrage.",
    trust: [
      "Persönliche Rückmeldung innerhalb von 24h",
      "Rechnung & Finanzierung auf Anfrage",
      "Abholung in Simbach oder Lieferung in die Region",
      "Werkstatt & Ersatzteile aus einer Hand",
    ],
    configureBanner:
      "Wählen Sie ein Fahrzeug — im Showroom konfigurieren Sie Farbe, Batterie und Zubehör. Anschließend melden wir uns freundlich mit Ihrem Angebot.",
    fleetCta: "Flotten & Gewerbe",
    fleetHref: "/fleet",
    accessoriesTitle: "Zubehör & Ersatz",
    accessoriesSubtitle:
      "Passend zu Ihrem Fahrzeug — direkt in den Warenkorb oder als Ergänzung zur Fahrzeuganfrage.",
  },
  cart: {
    b2bNote:
      "Gute Wahl! Nach Ihrer Anfrage prüfen wir Verfügbarkeit, Konfiguration und Lieferung — und melden uns persönlich bei Ihnen.",
    quoteHint: "Für Firmenkunden: Rechnungskauf & Mengenrabatt auf Anfrage.",
  },
  checkout: {
    b2bIntro:
      "Fast geschafft — wir bestätigen Ihre Anfrage und melden uns mit dem finalen Angebot. Kein anonymes Bestellchaos, sondern echte Beratung aus Simbach.",
    company: "Firma / Betrieb (optional)",
    vatId: "USt-IdNr. (optional)",
  },
  home: {
    shopBar: {
      title: "Direkt im Katalog stöbern",
      text: "Preise sehen, konfigurieren, in den Warenkorb — wir kümmern uns um den Rest. Für Hof, Handwerk, Hotel oder Flotte.",
      cta: "Zum Katalog",
      secondary: "Gewerbe anfragen",
    },
  },
  orderSteps: [
    {
      step: "01",
      title: "Modell wählen",
      description: "Katalog durchstöbern, Showroom öffnen, Zubehör ergänzen — ganz in Ruhe online.",
    },
    {
      step: "02",
      title: "Anfrage senden",
      description: "Warenkorb oder Beratungsformular — wir prüfen alles und melden uns freundlich bei Ihnen.",
    },
    {
      step: "03",
      title: "Übergabe & Service",
      description: "Abholung in Simbach, Lieferung in die Region — mit Einweisung, Garantie und Werkstatt.",
    },
  ],
} as const;
