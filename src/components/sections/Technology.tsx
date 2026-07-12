"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { techFeatures } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

function BlueprintAnimation({ activeId }: { activeId: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <svg
        viewBox="0 0 400 400"
        className="h-full max-h-[400px] w-full max-w-[400px]"
        fill="none"
      >
        {/* Grid */}
        {Array.from({ length: 20 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={i * 20}
            x2="400"
            y2={i * 20}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.5"
          />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={i * 20}
            y1="0"
            x2={i * 20}
            y2="400"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.5"
          />
        ))}

        {/* Battery */}
        <g
          className={`transition-opacity duration-700 ${activeId === "battery" ? "opacity-100" : "opacity-20"}`}
        >
          <rect
            x="120"
            y="140"
            width="160"
            height="120"
            rx="8"
            stroke="#3b9eff"
            strokeWidth="1.5"
            fill="rgba(59,158,255,0.05)"
          />
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={130 + i * 38}
              y="155"
              width="30"
              height="90"
              rx="2"
              fill="rgba(59,158,255,0.15)"
              stroke="#3b9eff"
              strokeWidth="0.5"
              className="animate-pulse-glow"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
          <text
            x="200"
            y="290"
            textAnchor="middle"
            fill="rgba(255,255,255,0.4)"
            fontSize="10"
            letterSpacing="2"
          >
            BATTERY MODULE
          </text>
        </g>

        {/* Charging */}
        <g
          className={`transition-opacity duration-700 ${activeId === "charging" ? "opacity-100" : "opacity-20"}`}
        >
          <path
            d="M200 60 L200 130"
            stroke="#4ade80"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <polygon
            points="200,50 210,70 190,70"
            fill="#4ade80"
            className="animate-float"
          />
          <circle
            cx="200"
            cy="100"
            r="20"
            stroke="#4ade80"
            strokeWidth="1"
            fill="rgba(74,222,128,0.1)"
          />
          <text
            x="200"
            y="105"
            textAnchor="middle"
            fill="#4ade80"
            fontSize="14"
          >
            ⚡
          </text>
        </g>

        {/* Motor */}
        <g
          className={`transition-opacity duration-700 ${activeId === "motor" ? "opacity-100" : "opacity-20"}`}
        >
          <g style={{ transformOrigin: "200px 200px", animation: "spin-slow 8s linear infinite" }}>
          <circle
            cx="200"
            cy="200"
            r="50"
            stroke="#3b9eff"
            strokeWidth="1.5"
            fill="rgba(59,158,255,0.05)"
          />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line
              key={i}
              x1="200"
              y1="200"
              x2={200 + 45 * Math.cos((i * Math.PI) / 3)}
              y2={200 + 45 * Math.sin((i * Math.PI) / 3)}
              stroke="#3b9eff"
              strokeWidth="1"
            />
          ))}
          <circle cx="200" cy="200" r="12" fill="#3b9eff" opacity="0.5" />
          </g>
          <text
            x="200"
            y="270"
            textAnchor="middle"
            fill="rgba(255,255,255,0.4)"
            fontSize="10"
            letterSpacing="2"
          >
            DUAL MOTOR
          </text>
        </g>
      </svg>
    </div>
  );
}

export function Technology() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeFeature, setActiveFeature] = useState("battery");

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".tech-content", {
        x: -60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".tech-visual", {
        x: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => {
        const ids = techFeatures.map((f) => f.id);
        const idx = ids.indexOf(prev);
        return ids[(idx + 1) % ids.length];
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="technology"
      className="relative overflow-hidden py-32 md:py-48"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-accent/5 blur-[150px]" />
      </div>

      <div className="section-padding relative">
        <SectionHeading
          label="Technology"
          title="Engineering the Future"
          description="Bavarian precision meets electric innovation."
          className="mb-20"
        />

        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="tech-content space-y-4">
            {techFeatures.map((feature) => (
              <button
                key={feature.id}
                className={`w-full rounded-2xl border p-6 text-left transition-all duration-500 ${
                  activeFeature === feature.id
                    ? "border-accent/30 bg-card glow-accent"
                    : "border-border bg-transparent hover:border-border hover:bg-card/50"
                }`}
                onClick={() => setActiveFeature(feature.id)}
                data-cursor="pointer"
              >
                <h3 className="text-xl font-medium">{feature.title}</h3>
                <p
                  className={`mt-2 text-sm leading-relaxed text-foreground-secondary transition-all duration-500 ${
                    activeFeature === feature.id
                      ? "max-h-20 opacity-100"
                      : "max-h-0 overflow-hidden opacity-0"
                  }`}
                >
                  {feature.description}
                </p>
              </button>
            ))}
          </div>

          <div className="tech-visual relative aspect-square overflow-hidden rounded-3xl border border-border bg-card">
            <BlueprintAnimation activeId={activeFeature} />
          </div>
        </div>
      </div>
    </section>
  );
}
