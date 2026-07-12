import { Container } from "@/components/ui/Container";
import { HomeImageCard } from "@/components/sections/porsche/HomeImageCard";
import { homeLegalNote, homePromoCards } from "@/lib/home-content";

export function HomePromoGrid() {
  return (
    <section className="porsche-section porsche-section--promo bg-background">
      <Container>
        <div className="porsche-grid porsche-grid--promo">
          {homePromoCards.map((card) => (
            <HomeImageCard
              key={card.id}
              href={card.href}
              image={card.image}
              imageAlt={card.title}
              title={card.title}
              subtitle={card.subtitle}
              variant="promo"
            />
          ))}
        </div>
        <p className="porsche-legal">{homeLegalNote}</p>
      </Container>
    </section>
  );
}
