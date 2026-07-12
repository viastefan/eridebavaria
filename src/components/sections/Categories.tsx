"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { categories } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

export function Categories() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const cards = gridRef.current.querySelectorAll(".category-card");

    const ctx = gsap.context(() => {
      gsap.from(cards, {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
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
      id="collection"
      className="relative py-32 md:py-48"
    >
      <div className="section-padding">
        <SectionHeading
          label="Kollektion"
          title="Wähle deinen Weg"
          description="Acht Kategorien. Eine Vision elektrischer Freiheit."
          className="mb-20"
        />

        <div
          ref={gridRef}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.id}`}
              data-cursor="pointer"
            >
            <article
              className="category-card card-reflection group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl border border-border bg-card"
            >
              <Image
                src={category.image}
                alt={category.title}
                fill
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
                priority={index < 4}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-transparent to-accent-secondary/0 opacity-0 transition-opacity duration-500 group-hover:opacity-20" />

              <div className="absolute right-0 bottom-0 left-0 p-8 transition-transform duration-500 group-hover:-translate-y-2">
                <span className="text-xs uppercase tracking-[0.2em] text-foreground-secondary">
                  {category.subtitle}
                </span>
                <h3 className="mt-2 text-2xl font-medium tracking-tight md:text-3xl">
                  {category.title}
                </h3>
                <div className="mt-4 h-px w-0 bg-accent transition-all duration-500 group-hover:w-12" />
              </div>
            </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
