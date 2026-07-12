import { Container } from "@/components/ui/Container";
import { HomeImageCard } from "@/components/sections/porsche/HomeImageCard";
import { homeHighlightCards } from "@/lib/home-content";

export function HomeHighlights() {
  return (
    <section className="porsche-section porsche-section--highlights bg-background">
      <Container>
        <h2 className="porsche-headline porsche-headline--sm">
          eRide Highlights
        </h2>
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
