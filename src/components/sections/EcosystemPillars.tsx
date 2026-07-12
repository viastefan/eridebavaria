"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { platform } from "@/lib/platform";

gsap.registerPlugin(ScrollTrigger);

export function EcosystemPillars() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".ecosystem-card", {
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section-padding border-t border-border py-32 md:py-48">
      <div className="mb-20 max-w-xl">
        <span className="text-[10px] uppercase tracking-[0.35em] text-foreground-secondary">
          Ökosystem
        </span>
        <h2 className="heading-xl mt-4">Dein Fahrzeug. Dein Ökosystem.</h2>
      </div>

      <div className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2">
        {platform.ecosystem.map((item, i) => (
          <article
            key={item.title}
            className="ecosystem-card bg-card p-10 md:p-14 lg:p-16"
          >
            <span className="text-[10px] text-foreground-secondary">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-6 text-2xl font-medium tracking-tight">{item.title}</h3>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground-secondary">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
