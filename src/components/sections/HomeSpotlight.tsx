"use client";

import type { Product } from "@/lib/types";
import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/Container";
import { formatPrice } from "@/lib/products";
import { availabilityLabels } from "@/lib/labels";

gsap.registerPlugin(ScrollTrigger);

export function HomeSpotlight({ product }: { product: Product }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".spotlight__content", {
        x: -32,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });
      gsap.from(".spotlight__visual", {
        x: 32,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section home-spotlight bg-background">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-20">
          <div className="spotlight__content">
            <p className="eyebrow">Im Fokus</p>
            <p className="text-small mt-3 text-muted">{product.brand}</p>
            <h2 className="heading-xl mt-2 text-foreground">{product.name}</h2>
            <p className="body-editorial mt-5 max-w-md text-foreground-secondary">
              {product.tagline}
            </p>

            <dl className="mt-10 grid grid-cols-1 gap-0 sm:grid-cols-3 sm:gap-6 sm:border-t sm:border-border sm:pt-8">
              <div className="spotlight-spec">
                <dt className="spotlight-spec__label">Reichweite</dt>
                <dd className="spotlight-spec__value">{product.specs.range}</dd>
              </div>
              <div className="spotlight-spec">
                <dt className="spotlight-spec__label">Leistung</dt>
                <dd className="spotlight-spec__value">{product.specs.power}</dd>
              </div>
              <div className="spotlight-spec">
                <dt className="spotlight-spec__label">Preis ab</dt>
                <dd className="spotlight-spec__value">{formatPrice(product.price)}</dd>
              </div>
            </dl>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href={`/product/${product.slug}`} className="btn btn--primary">
                Fahrzeug ansehen
              </Link>
              <Link
                href={`/shop?configure=1&product=${product.slug}`}
                className="btn btn--secondary"
              >
                Konfigurieren
              </Link>
            </div>
          </div>

          <Link
            href={`/product/${product.slug}`}
            className="spotlight__visual relative block aspect-[4/5] overflow-hidden rounded-[16px] border border-border bg-surface"
          >
            <span className="spotlight-badge">{availabilityLabels[product.availability]}</span>
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02]"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-sm font-medium text-white">{product.name}</p>
              <p className="mt-1 text-xs text-white/70">ab {formatPrice(product.price)}</p>
            </div>
          </Link>
        </div>
      </Container>
    </section>
  );
}
