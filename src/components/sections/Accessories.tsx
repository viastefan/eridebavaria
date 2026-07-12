"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { accessories } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { labels } from "@/lib/labels";

gsap.registerPlugin(ScrollTrigger);

export function Accessories() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const items = gridRef.current.querySelectorAll(".accessory-item");

    const ctx = gsap.context(() => {
      gsap.from(items, {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="accessories"
      className="relative py-32 md:py-48"
    >
      <div className="section-padding">
        <SectionHeading
          label={labels.accessories}
          title="Das volle Erlebnis"
          description="Perfekt abgestimmt. Für maximale Leistung."
          align="center"
          className="mb-20"
        />

        <div
          ref={gridRef}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {accessories.map((item) => (
            <article
              key={item.name}
              className="accessory-item group cursor-pointer"
              data-cursor="pointer"
            >
              <div className="relative mb-6 aspect-square overflow-hidden rounded-2xl border border-border bg-card">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
              <h3 className="text-lg font-medium">{item.name}</h3>
              <p className="mt-1 text-sm text-foreground-secondary">
                {item.price}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
