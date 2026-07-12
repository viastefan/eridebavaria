import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ConsultationField } from "@/components/commerce/ConsultationField";
import { HomeMobilityBenefits } from "@/components/sections/HomeMobilityBenefits";
import { Categories } from "@/components/sections/Categories";
import { heroChapters } from "@/lib/hero-journey";

export const metadata: Metadata = {
  title: "Entdecken — E-Mobilität individuell",
  description:
    "Entdecken Sie elektrische Mobilitätslösungen — konfigurieren, vergleichen und individuell beraten lassen.",
};

const journeySteps = [
  {
    step: "01",
    title: "Verstehen",
    description: "Welches Fahrzeug passt zu Ihrem Einsatz? Wir helfen bei der Modellwahl — nicht nur beim Preis.",
    href: "/shop",
  },
  {
    step: "02",
    title: "Konfigurieren",
    description: "Farbe, Batterie, Zubehör und Anpassungen — visuell im digitalen Showroom.",
    href: "/shop?configure=1",
  },
  {
    step: "03",
    title: "Vergleichen",
    description: "Bis zu vier Fahrzeuge nebeneinander — Reichweite, Nutzlast und Ausstattung im Überblick.",
    href: "/compare",
  },
  {
    step: "04",
    title: "Beraten lassen",
    description: "Individuelle Anfrage mit persönlicher Rückmeldung — kein Chatbot, kein Warteschleifen-Formular.",
    href: "#beratung",
  },
  {
    step: "05",
    title: "Betreuen",
    description: "Service, Ersatzteile und Garantie — Ihr Fahrzeug bleibt mit der Plattform verbunden.",
    href: "/service",
  },
];

export default function DiscoverPage() {
  return (
    <main className="min-h-screen pt-32 pb-24">
      <Container>
        <SectionHeading
          label="Entdecken"
          title="Ihre Mobilitätslösung beginnt hier."
          description="Nicht ein Produkt kaufen — eine Lösung gestalten, die zu Ihrem Einsatz passt."
        />
      </Container>

      <section className="section-padding py-16">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {heroChapters.map((chapter) => (
              <article
                key={chapter.index}
                className="rounded-2xl border border-border bg-card/40 p-8 transition-colors hover:border-accent/30"
              >
                <p className="text-[10px] uppercase tracking-[0.25em] text-accent">
                  {chapter.index}
                </p>
                <h3 className="heading-md mt-4">{chapter.headline.join(" ")}</h3>
                <p className="body-muted mt-3">{chapter.bottomLine}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-padding border-t border-border py-16">
        <Container>
          <h2 className="heading-lg mb-12">Der Weg zu Ihrer Lösung</h2>
          <div className="space-y-4">
            {journeySteps.map((item) => (
              <Link
                key={item.step}
                href={item.href}
                className="group flex items-center justify-between rounded-2xl border border-border p-6 transition-all hover:border-accent/30 hover:bg-card/40"
              >
                <div className="flex items-start gap-6">
                  <span className="text-2xl font-light text-muted">{item.step}</span>
                  <div>
                    <h3 className="text-lg font-medium">{item.title}</h3>
                    <p className="body-muted mt-1 max-w-xl">{item.description}</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent" />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <Categories />
      <HomeMobilityBenefits />
      <ConsultationField />
    </main>
  );
}
