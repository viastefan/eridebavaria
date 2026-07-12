"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { whyChooseUs } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

export function WhyChooseUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) return;

    const cards = cardsRef.current.querySelectorAll(".reason-card");

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        gsap.from(card, {
          y: 100,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          delay: (i % 3) * 0.1,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 md:py-48">
      <div className="section-padding">
        <SectionHeading
          label="Warum eRide"
          title="Anders gebaut"
          description="Jedes Detail durchdacht. Jedes Versprechen gehalten."
          className="mb-20"
        />

        <div
          ref={cardsRef}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {whyChooseUs.map((item) => (
            <article
              key={item.title}
              className="reason-card card-reflection group relative aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-card"
              data-cursor="pointer"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

              <div className="absolute right-0 bottom-0 left-0 p-8 transition-transform duration-500 group-hover:-translate-y-1">
                <h3 className="text-xl font-medium md:text-2xl">{item.title}</h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-foreground-secondary opacity-0 transition-all duration-500 group-hover:opacity-100">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
