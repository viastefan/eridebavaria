"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Product } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

export function ProductStory({ product }: { product: Product }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".story-block").forEach((block) => {
        gsap.from(block.querySelector(".story-text"), {
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: block,
            start: "top 70%",
          },
        });
        gsap.from(block.querySelector(".story-image"), {
          scale: 1.1,
          opacity: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: block,
            start: "top 75%",
          },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="space-y-32 md:space-y-48">
      {product.story.map((block, i) => (
        <div
          key={i}
          className={`story-block grid items-center gap-12 lg:grid-cols-2 ${
            i % 2 === 1 ? "lg:[direction:rtl]" : ""
          }`}
        >
          <div className={`story-text ${i % 2 === 1 ? "lg:[direction:ltr]" : ""}`}>
            <h3 className="heading-lg text-gradient">{block.title}</h3>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-foreground-secondary">
              {block.text}
            </p>
          </div>
          <div
            className={`story-image relative aspect-[4/3] overflow-hidden rounded-3xl ${
              i % 2 === 1 ? "lg:[direction:ltr]" : ""
            }`}
          >
            <Image
              src={block.image}
              alt={block.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
