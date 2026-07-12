import { Container } from "@/components/ui/Container";
import { regional } from "@/lib/regional";

export function HomeOrderPromise() {
  return (
    <section className="home-process" aria-label="So bestellen Sie bei uns">
      <Container className="py-8 md:py-10">
        <p className="eyebrow mb-8">So funktioniert Ihr Einkauf</p>
        <div className="grid md:grid-cols-3">
          {regional.orderSteps.map((step) => (
            <div key={step.step} className="home-process__step">
              <p className="home-process__index">{step.step}</p>
              <h3 className="home-process__title">{step.title}</h3>
              <p className="home-process__text">{step.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
