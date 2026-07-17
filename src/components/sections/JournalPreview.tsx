import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { HomeImageCard } from "@/components/sections/porsche/HomeImageCard";
import { journalArticles } from "@/lib/platform";

const previewArticles = journalArticles.slice(0, 3);

export function JournalPreview() {
  return (
    <section className="porsche-section porsche-section--journal bg-background">
      <Container>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10">
          <div className="max-w-2xl">
            <p className="porsche-eyebrow">Journal</p>
            <h2 className="porsche-headline porsche-headline--sm mb-0">
              Wissenswertes — verständlich erklärt
            </h2>
            <p className="porsche-subline mt-3 mb-0">
              Tipps, Ratgeber und Einblicke aus Simbach — für alle, die E-Mobilität
              entspannt angehen möchten.
            </p>
          </div>
          <Link href="/journal" className="porsche-text-link inline-flex items-center gap-1.5 shrink-0">
            Alle Artikel
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
        </div>

        <div className="porsche-grid porsche-grid--highlights">
          {previewArticles.map((article) => (
            <HomeImageCard
              key={article.slug}
              href={`/journal/${article.slug}`}
              image={article.image}
              imageAlt={article.title}
              title={article.title}
              description={article.excerpt}
              cta={`${article.readTime} · Artikel lesen`}
              badges={[article.category]}
              variant="highlight"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
