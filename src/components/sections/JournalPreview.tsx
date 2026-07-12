import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { JournalCard } from "@/components/journal/JournalCard";
import { journalArticles, platform } from "@/lib/platform";

export function JournalPreview() {
  const featured = journalArticles[0];
  const more = journalArticles.slice(1, 3);

  return (
    <section className="porsche-section porsche-section--journal bg-background">
      <Container>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 md:mb-12">
          <h2 className="porsche-headline porsche-headline--sm mb-0">
            {platform.journal.subtitle}
          </h2>
          <Link href="/journal" className="porsche-text-link inline-flex items-center gap-1.5">
            Alle Artikel
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
          <JournalCard article={featured} variant="featured" />
          <div className="flex flex-col gap-5 lg:gap-6">
            {more.map((article) => (
              <JournalCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
