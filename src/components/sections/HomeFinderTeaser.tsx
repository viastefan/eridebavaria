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
              Finden Sie Ihr E-Fahrzeug.
            </h2>
            <p className="porsche-finder__text">
              Stöbern Sie im Katalog, vergleichen Sie Modelle und legen Sie Ihre
              Favoriten in den Warenkorb — wir melden uns persönlich bei Ihnen.
            </p>
            <span className="porsche-finder__cta">Zum Fahrzeugkatalog</span>
          </div>
          <span className="porsche-finder__arrow" aria-hidden>
            <ArrowUpRight className="h-5 w-5" strokeWidth={2} />
          </span>
        </Link>
      </Container>
    </section>
  );
}
