"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { featuredSpecs } from "@/lib/data";
import { getFeaturedProduct, formatPrice } from "@/lib/products";

gsap.registerPlugin(ScrollTrigger);

export function FeaturedVehicle() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const product = getFeaturedProduct();

  useEffect(() => {
    if (!sectionRef.current || !imageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(imageRef.current, {
        scale: 1.15,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.utils.toArray<HTMLElement>(".spec-hotspot").forEach((el, i) => {
        gsap.from(el, {
          scale: 0,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 50%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen py-32">
      <div className="section-padding">
        <div className="mb-16 text-center">
          <span className="mb-4 block text-xs font-medium uppercase tracking-[0.25em] text-accent">
            Im Fokus
          </span>
          <h2 className="heading-display text-gradient">{product.name}</h2>
          <p className="mx-auto mt-6 max-w-lg text-foreground-secondary">
            {product.tagline}. {formatPrice(product.price)} · {product.specs.range} Reichweite
          </p>
        </div>

        <Link href={`/product/${product.slug}`} data-cursor="pointer">
          <div className="relative mx-auto aspect-[16/9] max-h-[70vh] w-full max-w-6xl overflow-hidden rounded-3xl border border-border bg-card">
            <div ref={imageRef} className="relative h-full w-full">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-contain p-8"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            </div>

            {featuredSpecs.map((spec) => (
              <div
                key={spec.label}
                className="spec-hotspot group absolute z-10 pointer-events-none"
                style={spec.position}
              >
                <span className="relative flex h-4 w-4 items-center justify-center">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-accent/40" />
                  <span className="relative h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_rgba(45,156,255,0.8)]" />
                </span>
                <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-border bg-card/90 px-4 py-3 opacity-0 backdrop-blur-xl transition-all duration-300 group-hover:opacity-100">
                  <span className="block text-[10px] uppercase tracking-[0.15em] text-foreground-secondary">
                    {spec.label}
                  </span>
                  <span className="text-lg font-medium">
                    {spec.value}
                    {spec.unit && (
                      <span className="ml-1 text-sm text-foreground-secondary">
                        {spec.unit}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Link>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {featuredSpecs.map((spec) => (
            <div key={spec.label} className="text-center">
              <span className="text-xl font-medium md:text-2xl">{spec.value}</span>
              {spec.unit && (
                <span className="ml-1 text-sm text-foreground-secondary">{spec.unit}</span>
              )}
              <p className="mt-1 text-xs uppercase tracking-[0.15em] text-foreground-secondary">
                {spec.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
