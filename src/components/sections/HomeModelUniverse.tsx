import { Container } from "@/components/ui/Container";
import { HomeImageCard } from "@/components/sections/porsche/HomeImageCard";
import { homeLegalNote, homeModelCards } from "@/lib/home-content";

export function HomeModelUniverse() {
  return (
    <section className="porsche-section bg-background" id="collection">
      <Container>
        <h2 className="porsche-headline">
          Ihre E-Mobilität — persönlich beraten aus Simbach.
        </h2>
        <p className="porsche-subline porsche-subline--section">
          Wählen Sie die Kategorie, die zu Ihrem Alltag passt. Wir helfen Ihnen gern bei der
          Entscheidung — unverbindlich und auf Augenhöhe.
        </p>

        <div className="porsche-grid porsche-grid--models">
          {homeModelCards.map((card) => (
            <HomeImageCard
              key={card.id}
              href={card.href}
              image={card.image}
              imageAlt={card.title}
              title={card.title}
              description={card.description}
              cta={card.cta}
              badges={card.badges}
              variant="model"
            />
          ))}
        </div>

        <p className="porsche-legal">{homeLegalNote}</p>
      </Container>
    </section>
  );
}
