"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useShowroom } from "./ShowroomProvider";
import { showroomLabels } from "@/lib/showroom-labels";

gsap.registerPlugin(ScrollTrigger);

function BlueprintVisual({ activeId }: { activeId: string }) {
  return (
    <div className="relative flex h-full min-h-[360px] w-full items-center justify-center">
      <svg viewBox="0 0 400 400" className="h-full max-h-[400px] w-full" fill="none">
        {Array.from({ length: 16 }).map((_, i) => (
          <line
            key={`g-${i}`}
            x1={i * 25}
            y1="0"
            x2={i * 25}
            y2="400"
            stroke="var(--border)"
            strokeWidth="0.5"
          />
        ))}
        <g className={`transition-opacity duration-1000 ${activeId === "battery" ? "opacity-100" : "opacity-15"}`}>
          <rect x="130" y="150" width="140" height="100" rx="6" stroke="var(--accent)" strokeWidth="1.5" fill="color-mix(in srgb, var(--accent) 8%, transparent)" />
          <text x="200" y="280" textAnchor="middle" fill="var(--foreground-secondary)" fontSize="9" letterSpacing="2">BATTERIE</text>
        </g>
        <g className={`transition-opacity duration-1000 ${activeId === "motor" ? "opacity-100" : "opacity-15"}`}>
          <circle cx="200" cy="200" r="45" stroke="var(--accent)" strokeWidth="1.5" fill="color-mix(in srgb, var(--accent) 6%, transparent)" />
          <text x="200" y="270" textAnchor="middle" fill="var(--foreground-secondary)" fontSize="9" letterSpacing="2">MOTOR</text>
        </g>
        <g className={`transition-opacity duration-1000 ${activeId === "charging" ? "opacity-100" : "opacity-15"}`}>
          <path d="M200 80 L200 140" stroke="var(--accent-secondary)" strokeWidth="1.5" strokeDasharray="4 4" />
          <polygon points="200,70 210,90 190,90" fill="var(--accent-secondary)" />
        </g>
        <g className={`transition-opacity duration-1000 ${activeId === "frame" ? "opacity-100" : "opacity-15"}`}>
          <rect x="100" y="120" width="200" height="60" rx="4" stroke="var(--accent-warm)" strokeWidth="1" fill="transparent" />
        </g>
      </svg>
    </div>
  );
}

export function ShowroomTechnology() {
  const { data } = useShowroom();
  const [active, setActive] = useState(data.technology[0]?.id ?? "battery");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".tech-block", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const topic = data.technology.find((t) => t.id === active);

  return (
    <section ref={sectionRef} id="technology" className="section-padding border-t border-border py-24 md:py-48">
      <div className="mb-20 text-center">
        <span className="text-[10px] uppercase tracking-[0.3em] text-accent">
          {showroomLabels.technology}
        </span>
        <h2 className="heading-xl mt-4">Ingenieurskunst im Detail</h2>
      </div>

      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div className="space-y-2">
          {data.technology.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              className={`tech-block w-full rounded-2xl border p-6 text-left transition-all duration-700 ${
                active === t.id
                  ? "border-accent/30 bg-card glow-accent"
                  : "border-border bg-transparent hover:bg-card/40"
              }`}
              data-cursor="pointer"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-xl font-medium">{t.title}</h3>
                <span className="text-sm text-accent">{t.metric}</span>
              </div>
              <p
                className={`mt-2 text-sm leading-relaxed text-foreground-secondary transition-all duration-700 ${
                  active === t.id ? "max-h-24 opacity-100" : "max-h-0 overflow-hidden opacity-0"
                }`}
              >
                {t.description}
              </p>
            </button>
          ))}
        </div>

        <div className="tech-block overflow-hidden rounded-3xl border border-border bg-card/50 p-8">
          <BlueprintVisual activeId={active} />
          {topic && (
            <div className="mt-6 text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-foreground-secondary">
                {topic.metricLabel}
              </p>
              <p className="mt-2 text-3xl font-medium">{topic.metric}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
