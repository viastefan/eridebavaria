"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { showcaseProducts } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

export function ProductShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current || !wrapperRef.current) return;

    const track = trackRef.current;
    const totalWidth = track.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${totalWidth}`,
          pin: wrapperRef.current,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative">
      <div ref={wrapperRef} className="h-screen overflow-hidden">
        <div className="flex h-full flex-col justify-center section-padding">
          <SectionHeading
            label="Kollektion"
            title="Das Lineup"
            className="mb-12 shrink-0"
          />

          <div
            ref={trackRef}
            className="flex gap-8 will-change-transform"
            style={{ width: "max-content" }}
          >
            {showcaseProducts.map((product, index) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group relative h-[60vh] w-[70vw] shrink-0 overflow-hidden rounded-3xl border border-border bg-card md:w-[45vw] lg:w-[32vw]"
                data-cursor="pointer"
                style={{
                  transform: `perspective(1000px) rotateY(${index % 2 === 0 ? -1.5 : 1.5}deg)`,
                }}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-6 transition-all duration-700 group-hover:scale-105"
                  sizes="45vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end bg-background/70 p-8 opacity-0 backdrop-blur-md transition-all duration-500 group-hover:opacity-100">
                  <div className="translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                    <span className="text-xs uppercase tracking-[0.2em] text-accent">
                      {product.tagline}
                    </span>
                    <h3 className="mt-2 text-2xl font-medium">{product.name}</h3>
                    <div className="mt-4 flex gap-6 text-sm text-foreground-secondary">
                      <span>{product.price}</span>
                      <span>{product.range}</span>
                    </div>
                  </div>
                </div>

                <div className="absolute right-0 bottom-0 left-0 p-8 transition-opacity duration-500 group-hover:opacity-0">
                  <h3 className="text-xl font-medium">{product.name}</h3>
                  <p className="mt-1 text-sm text-foreground-secondary">
                    {product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
