import { MessageCircle, Package, Wrench, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { regional } from "@/lib/regional";

const metricIcons = [MessageCircle, Package, Wrench, MapPin];

export function HomeMetrics() {
  return (
    <section className="home-metrics border-y border-border bg-background">
      <Container>
        <ul className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-2 sm:gap-5 md:grid-cols-4 md:gap-8 md:py-12">
          {regional.metrics.map((item, index) => {
            const Icon = metricIcons[index] ?? MapPin;
            return (
              <li key={item.label}>
                <div className="home-metric">
                  <div className="home-metric__icon">
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="heading-lg text-foreground">{item.value}</p>
                    <p className="text-small mt-1.5 text-muted">{item.label}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
