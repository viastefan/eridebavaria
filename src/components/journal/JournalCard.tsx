import Image from "next/image";
import Link from "next/link";
import { journalArticles } from "@/lib/platform";

type Article = (typeof journalArticles)[number];

interface JournalCardProps {
  article: Article;
  variant?: "default" | "featured";
}

export function JournalCard({ article, variant = "default" }: JournalCardProps) {
  if (variant === "featured") {
    return (
      <Link href={`/journal/${article.slug}`} className="journal-card journal-card--featured group">
        <div className="journal-card__media journal-card__media--featured">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 1280px"
            priority
          />
        </div>
        <div className="journal-card__body journal-card__body--featured">
          <span className="journal-card__category">{article.category}</span>
          <h2 className="journal-card__title journal-card__title--featured">{article.title}</h2>
          <p className="journal-card__excerpt">{article.excerpt}</p>
          <p className="journal-card__meta">
            {article.readTime} · {article.date}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/journal/${article.slug}`} className="journal-card group">
      <div className="journal-card__media">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-600 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="journal-card__body">
        <span className="journal-card__category">{article.category}</span>
        <h3 className="journal-card__title">{article.title}</h3>
        <p className="journal-card__excerpt">{article.excerpt}</p>
        <p className="journal-card__meta">
          {article.readTime} · {article.date}
        </p>
      </div>
    </Link>
  );
}
