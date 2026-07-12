import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { JournalCard } from "@/components/journal/JournalCard";
import { platform, journalArticles } from "@/lib/platform";

export const metadata: Metadata = {
  title: "Ratgeber & Wissen",
  description:
    "Praxiswissen zur Elektromobilität — Leitfäden, Tipps und regionale Expertise aus Bayern.",
};

const categories = ["Alle", "Leitfaden", "Gewerbe", "Technologie", "Ratgeber"] as const;

export default function JournalPage() {
  const featured = journalArticles.find((a) => a.featured) ?? journalArticles[0];
  const rest = journalArticles.filter((a) => a.slug !== featured.slug);

  return (
    <main className="journal-page">
      {/* Hero */}
      <section className="journal-hero">
        <Container>
          <div className="journal-hero__inner">
            <div className="journal-hero__content">
              <p className="eyebrow">{platform.journal.title}</p>
              <h1 className="heading-display text-foreground">{platform.journal.subtitle}</h1>
              <p className="body-muted mt-5 max-w-xl">
                Ob E-Chopper, Mopedauto oder Gewerbeflotte — hier finden Sie verständliche
                Antworten von Menschen, die Elektromobilität in Bayern täglich begleiten.
              </p>
              <div className="journal-hero__trust mt-6 flex items-center gap-2 text-small text-muted">
                <MapPin className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                <span>Redaktion eRide Bavaria · Braunau am Inn</span>
              </div>
            </div>
            <div className="journal-hero__cta">
              <p className="text-small font-medium text-foreground">Persönliche Frage?</p>
              <p className="mt-1 text-small text-muted">Wir beraten Sie direkt — ohne Warteschleife.</p>
              <Link href="/shop" className="btn btn--primary mt-4 inline-flex gap-2">
                Beratung anfragen
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Categories */}
      <section className="journal-categories">
        <Container>
          <div className="journal-categories__list">
            {categories.map((cat) => (
              <span
                key={cat}
                className={`journal-categories__pill ${cat === "Alle" ? "is-active" : ""}`}
              >
                {cat}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured */}
      <section className="section pt-0">
        <Container>
          <p className="eyebrow mb-6">Empfohlen</p>
          <JournalCard article={featured} variant="featured" />
        </Container>
      </section>

      {/* Grid */}
      <section className="section section--surface">
        <Container>
          <h2 className="heading-lg mb-8">Weitere Artikel</h2>
          <div className="journal-grid">
            {rest.map((article) => (
              <JournalCard key={article.slug} article={article} />
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="section">
        <Container>
          <div className="journal-bottom-cta">
            <div>
              <h2 className="heading-lg">Noch Fragen offen?</h2>
              <p className="body-muted mt-3 max-w-md">
                Unser Team in Bayern hilft bei Zulassung, Auswahl und Zubehör — persönlich und
                unverbindlich.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn--primary">
                Fahrzeuge ansehen
              </Link>
              <Link href="/parts" className="btn btn--secondary">
                Ersatzteile finden
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
