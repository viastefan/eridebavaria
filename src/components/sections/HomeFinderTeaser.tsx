import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function HomeFinderTeaser() {
  return (
    <section className="porsche-section porsche-section--finder bg-background">
      <Container>
        <Link href="/shop" className="porsche-finder">
          <div className="porsche-finder__content">
            <h2 className="porsche-finder__title">
              Noch unsicher? Wir finden gemeinsam das passende Modell.
            </h2>
            <p className="porsche-finder__text">
              Im Katalog können Sie Preise sehen, Modelle vergleichen und Favoriten merken.
              Danach melden wir uns persönlich bei Ihnen — ganz ohne Verkaufsdruck.
            </p>
            <span className="porsche-finder__cta">Jetzt Katalog entdecken</span>
          </div>
          <span className="porsche-finder__arrow" aria-hidden>
            <ArrowUpRight className="h-5 w-5" strokeWidth={2} />
          </span>
        </Link>
      </Container>
    </section>
  );
}
