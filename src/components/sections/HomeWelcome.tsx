import { Container } from "@/components/ui/Container";
import { regional } from "@/lib/regional";

export function HomeWelcome() {
  return (
    <section className="porsche-section porsche-section--welcome bg-background">
      <Container>
        <p className="porsche-eyebrow">{regional.brand.city} · Inn-Salzach-Region</p>
        <h2 className="porsche-headline">Schön, dass Sie da sind.</h2>
        <p className="porsche-subline porsche-subline--welcome">
          Ob Privat, Gewerbe oder Flotte — wir beraten Sie persönlich, ehrlich und ohne Druck.
          Stöbern Sie in Ruhe durch unsere Modelle. Wenn Sie Fragen haben, sind wir für Sie da.
        </p>
      </Container>
    </section>
  );
}
