"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { stories } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { labels } from "@/lib/labels";

gsap.registerPlugin(ScrollTrigger);

export function CustomerStories() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".story-card").forEach((card, i) => {
        gsap.from(card, {
          y: 80,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          delay: i * 0.15,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="stories"
      className="relative py-32 md:py-48"
    >
      <div className="section-padding">
        <SectionHeading
          label="Geschichten"
          title="Neu erfundene Wege"
          description="Echte Menschen. Echter Wandel. Elektrische Freiheit."
          className="mb-20"
        />

        <div className="space-y-8">
          {stories.map((story, index) => (
            <article
              key={story.title}
              className="story-card group relative cursor-pointer overflow-hidden rounded-3xl border border-border"
              data-cursor="pointer"
            >
              <div
                className={`grid md:grid-cols-2 ${index % 2 === 1 ? "md:[direction:rtl]" : ""}`}
              >
                <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[400px]">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div
                  className={`flex flex-col justify-center p-10 md:p-16 ${index % 2 === 1 ? "md:[direction:ltr]" : ""}`}
                >
                  <span className="text-xs uppercase tracking-[0.2em] text-accent">
                    {story.readTime} Lesezeit
                  </span>
                  <h3 className="heading-lg mt-4 max-w-md">{story.title}</h3>
                  <p className="mt-4 max-w-sm text-foreground-secondary">
                    {story.excerpt}
                  </p>
                  <span className="mt-8 text-sm font-medium text-foreground transition-colors group-hover:text-accent">
                    {labels.readStory} →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
