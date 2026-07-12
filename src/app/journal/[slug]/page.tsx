import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { JournalCard } from "@/components/journal/JournalCard";
import { journalArticles } from "@/lib/platform";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return journalArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = journalArticles.find((a) => a.slug === slug);
  if (!article) return { title: "Nicht gefunden" };
  return { title: article.title, description: article.excerpt };
}

export default async function JournalArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = journalArticles.find((a) => a.slug === slug);
  if (!article) notFound();

  const related = journalArticles.filter((a) => a.slug !== slug).slice(0, 2);

  return (
    <main className="journal-article">
      <div className="journal-article__hero">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="journal-article__hero-overlay" />
      </div>

      <Container>
        <article className="journal-article__content">
          <Link href="/journal" className="journal-article__back">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            Zurück zum Ratgeber
          </Link>

          <span className="journal-card__category mt-8">{article.category}</span>
          <h1 className="heading-xl mt-4 text-foreground">{article.title}</h1>

          <div className="journal-article__meta mt-5 flex flex-wrap items-center gap-4 text-small text-muted">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" strokeWidth={1.5} />
              {article.readTime}
            </span>
            <span>{article.date}</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" strokeWidth={1.5} />
              eRide Bavaria
            </span>
          </div>

          <div className="journal-article__prose mt-12">
            <p className="journal-article__lead">{article.excerpt}</p>
            <p>
              Elektromobilität wirkt auf den ersten Blick komplex — Zulassung, Reichweite,
              Wartung, Zubehör. In der Praxis lässt sich vieles mit der richtigen Beratung
              verständlich lösen. Dieser Artikel fasst zusammen, worauf Kunden in Bayern und
              Österreich besonders achten sollten.
            </p>
            <h2>Was Sie mitnehmen sollten</h2>
            <ul>
              <li>Reichweite hängt von Fahrprofil, Batterie und Jahreszeit ab.</li>
              <li>Zulassung und Versicherung unterscheiden sich je nach Fahrzeugklasse.</li>
              <li>Original-Ersatzteile und Service sichern langfristigen Wert.</li>
              <li>Persönliche Beratung spart Zeit — besonders beim ersten E-Fahrzeug.</li>
            </ul>
            <p>
              Unser Team in Braunau am Inn begleitet Sie von der ersten Frage bis zur
              Auslieferung. Wenn Sie ein konkretes Modell im Blick haben, vergleichen Sie
              direkt in unserem Shop oder vereinbaren Sie eine unverbindliche Beratung.
            </p>
          </div>

          <div className="journal-article__actions mt-12 flex flex-wrap gap-3">
            <Link href="/shop" className="btn btn--primary">
              Fahrzeuge entdecken
            </Link>
            <Link href="/journal" className="btn btn--secondary">
              Weitere Artikel
            </Link>
          </div>
        </article>

        {related.length > 0 && (
          <section className="journal-article__related pb-16">
            <h2 className="heading-lg mb-8">Das könnte Sie auch interessieren</h2>
            <div className="journal-grid journal-grid--two">
              {related.map((a) => (
                <JournalCard key={a.slug} article={a} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </main>
  );
}
