/** Regionaler Service — Simbach am Inn & Inn-Salzach-Region */
export const regional = {
  brand: {
    city: "Simbach am Inn",
    postal: "84359",
    region: "Inn-Salzach-Region · Bayern",
    phone: "+49 8571 — auf Anfrage",
    email: "service@eridebavaria.de",
  },
  tagline: "Ihr Partner für E-Mobilität in Simbach und Umgebung.",
  intro:
    "Von Quads über Mopedautos bis zu Elektro-Transportern — wir beraten Sie persönlich, liefern zuverlässig und betreuen Sie langfristig mit Werkstatt, Ersatzteilen und Garantie.",
  orderPromise:
    "Jede Bestellung wird sorgfältig geprüft. Anschließend kontaktieren wir Sie persönlich, besprechen Ihre Anforderungen und klären alle Details — erst danach erfolgt die Bestellung.",
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
  serviceArea: [
    "Simbach am Inn",
    "Braunau am Inn",
    "Rottal-Inn",
    "Altötting",
    "Mühldorf am Inn",
    "Pfarrkirchen",
    "Eggenfelden",
    "Grenzregion Oberösterreich",
  ],
  metrics: [
    { value: "Persönlich", label: "Beratung nach jeder Anfrage" },
    { value: "48h", label: "Ersatzteile-Versand" },
    { value: "Vor Ort", label: "Werkstatt in Simbach" },
    { value: "50 km+", label: "Service-Radius Inn-Salzach" },
  ],
  servicePillars: [
    {
      title: "Persönliche Beratung",
      description:
        "Kein anonymer Checkout. Wir prüfen jede Anfrage, rufen Sie zurück und finden gemeinsam das passende Fahrzeug — inklusive Batterie- und Zubehöroptionen.",
      href: "/shop",
    },
    {
      title: "Werkstatt & Wartung",
      description:
        "Inspektion, Reparatur und saisonale Checks in Simbach am Inn. Partnerwerkstätten in der Region für schnelle Hilfe vor Ort.",
      href: "/garage",
    },
    {
      title: "Ersatzteile ab Lager",
      description:
        "Originalteile für Quads, Mopedautos, Transporter und Motorräder. Kompatibilitätsprüfung und Versand innerhalb von 48 Stunden.",
      href: "/parts",
    },
    {
      title: "Lieferung & Übergabe",
      description:
        "Abholung in Simbach, Anlieferung in der Inn-Salzach-Region oder EU-weiter Versand — inklusive Einweisung und Fahrzeugcheck.",
      href: "/shop",
    },
  ],
  trustPoints: [
    {
      title: "Regional verwurzelt",
      text: "Standort Simbach am Inn — kurze Wege, persönliche Ansprechpartner und Service für die gesamte Inn-Salzach-Region bis ins angrenzende Österreich.",
    },
    {
      title: "Betreuung nach dem Kauf",
      text: "Garantie, Wartungsintervalle, Ersatzteile und technische Fragen — wir bleiben Ihr Ansprechpartner, nicht nur bis zur Übergabe.",
    },
    {
      title: "Geprüfte E-Fahrzeuge",
      text: "EU-konforme Modelle von E-GO, EEC, EFO und weiteren Herstellern — transparent dokumentiert mit Gewährleistung und Original-Komponenten.",
    },
  ],
  mobilityBenefits: [
    { label: "Emissionsfrei", text: "Keine direkten Abgase — ideal für Hof, Gewerbe und Natur." },
    { label: "Leiser Betrieb", text: "Weniger Lärm für Nachbarschaft, Gäste und Tierhaltung." },
    { label: "Geringe Kosten", text: "Weniger Wartung, günstiger Betrieb gegenüber Verbrennern." },
    { label: "Sofort-Drehmoment", text: "Kraftvolle Beschleunigung für Alltag, Gelände und Transport." },
  ],
} as const;
