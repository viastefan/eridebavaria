"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/commerce/ProductCard";
import type { Product } from "@/lib/types";

export function FeaturedMarketplace({
  products,
  totalCount,
}: {
  products: Product[];
  totalCount: number;
}) {
  return (
    <section className="section section--surface">
      <Container>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            label="Katalog"
            title="Beliebte Modelle — direkt anfragen"
            description="Preise sehen, in den Warenkorb legen oder im Showroom konfigurieren. Für Privat, Gewerbe und Flotten."
            className="mb-0 max-w-2xl"
          />
          <Link href="/shop" className="section-action shrink-0">
            Alle {totalCount} Modelle
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/shop" className="btn btn--primary">
            Zum Fahrzeugkatalog
          </Link>
        </div>
      </Container>
    </section>
  );
}
