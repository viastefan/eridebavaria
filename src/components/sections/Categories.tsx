import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Categories() {
  return (
    <section id="collection" className="section bg-background">
      <Container>
        <SectionHeading
          label="Sortiment"
          title="E-Fahrzeuge für jeden Einsatz"
          description="Kleinwagen, Transporter, Quads, Mopedautos und Zubehör — beraten und geliefert aus Simbach am Inn."
          className="mb-12"
        />

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.id}`}
              className="category-card group"
            >
              <div className="category-card__media">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="category-card__image"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                />
                <div className="category-card__overlay" />
                <span className="category-card__arrow" aria-hidden>
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
              </div>
              <div className="category-card__body">
                <p className="text-small text-muted">{category.subtitle}</p>
                <h3 className="mt-1.5 text-base font-medium tracking-tight text-foreground">
                  {category.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center md:mt-12">
          <Link href="/shop" className="btn btn--secondary">
            Alle Kategorien im Shop
          </Link>
        </div>
      </Container>
    </section>
  );
}
