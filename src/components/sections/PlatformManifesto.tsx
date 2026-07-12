"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { platform } from "@/lib/platform";

gsap.registerPlugin(ScrollTrigger);

export function PlatformManifesto() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".manifesto-line", {
        y: 60,
        opacity: 0,
        duration: 1.4,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section-padding py-32 md:py-48">
      <div className="mx-auto max-w-4xl text-center">
        <p className="manifesto-line text-[10px] uppercase tracking-[0.4em] text-accent">
          {platform.brand.tagline}
        </p>
        <h2 className="manifesto-line heading-editorial mt-10 text-gradient">
          {platform.brand.manifesto}
        </h2>
      </div>
    </section>
  );
}
