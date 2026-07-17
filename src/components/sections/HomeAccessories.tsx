import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { HomeImageCard } from "@/components/sections/porsche/HomeImageCard";
import { accessoryCatalog, formatPrice } from "@/lib/products";

const featuredAccessories = accessoryCatalog.slice(0, 3);

export function HomeAccessories() {
  return (
    <section className="porsche-section bg-background">
      <Container>
        <p className="porsche-eyebrow">Shop</p>
        <h2 className="porsche-headline porsche-headline--sm">
          Passendes Zubehör — gleich mitbestellen
        </h2>
        <p className="porsche-subline porsche-subline--section">
          Ladegeräte, Helme und mehr — direkt in den Warenkorb oder als Ergänzung zu
          Ihrer Fahrzeuganfrage.
        </p>

        <div className="porsche-grid porsche-grid--highlights">
          {featuredAccessories.map((item) => (
            <HomeImageCard
              key={item.id}
              href="/shop?tab=accessories"
              image={item.image}
              imageAlt={item.name}
              title={item.name}
              description={`${item.description} · ${formatPrice(item.price)}`}
              cta="Im Katalog ansehen"
              variant="highlight"
            />
          ))}
        </div>

        <div className="porsche-section__footer">
          <Link href="/shop?tab=accessories" className="porsche-text-link">
            Alle Zubehörteile entdecken
          </Link>
        </div>
      </Container>
    </section>
  );
}
