import { Container } from "@/components/ui/Container";
import { HomeImageCard } from "@/components/sections/porsche/HomeImageCard";
import { homeHighlightCards } from "@/lib/home-content";

export function HomeHighlights() {
  return (
    <section className="porsche-section porsche-section--highlights bg-background">
      <Container>
        <p className="porsche-eyebrow">Service & Shop</p>
        <h2 className="porsche-headline porsche-headline--sm">
          Das könnte auch für Sie interessant sein
        </h2>
        <p className="porsche-subline porsche-subline--section">
          Katalog, Gewerbe oder Zubehör — alles aus einer Hand, mit persönlicher Beratung
          aus Simbach.
        </p>
        <div className="porsche-grid porsche-grid--highlights">
          {homeHighlightCards.map((card) => (
            <HomeImageCard
              key={card.id}
              href={card.href}
              image={card.image}
              imageAlt={card.title}
              title={card.title}
              description={card.subtitle}
              cta={card.cta}
              variant="highlight"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
