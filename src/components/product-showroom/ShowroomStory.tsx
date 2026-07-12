"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useShowroom } from "./ShowroomProvider";
import { showroomLabels } from "@/lib/showroom-labels";

gsap.registerPlugin(ScrollTrigger);

export function ShowroomStory() {
  const { product } = useShowroom();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".story-block").forEach((block) => {
        gsap.from(block, {
          y: 80,
          opacity: 0,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: { trigger: block, start: "top 80%" },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section-padding border-t border-border py-24 md:py-48">
      <div className="mb-24 text-center">
        <span className="text-[10px] uppercase tracking-[0.3em] text-accent">
          {showroomLabels.story}
        </span>
        <h2 className="heading-display mt-6 text-gradient">{product.tagline}</h2>
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-foreground-secondary">
          {product.description}
        </p>
      </div>

      <div className="space-y-32 md:space-y-48">
        {product.story.map((block, i) => (
          <article
            key={block.title}
            className={`story-block grid items-center gap-12 md:grid-cols-2 md:gap-20 ${
              i % 2 === 1 ? "md:[direction:rtl]" : ""
            }`}
          >
            <div className={`relative aspect-[4/3] overflow-hidden rounded-3xl ${i % 2 === 1 ? "md:[direction:ltr]" : ""}`}>
              <Image
                src={block.image}
                alt={block.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </div>
            <div className={i % 2 === 1 ? "md:[direction:ltr]" : ""}>
              <h3 className="heading-lg">{block.title}</h3>
              <p className="mt-6 text-lg leading-relaxed text-foreground-secondary">
                {block.text}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
