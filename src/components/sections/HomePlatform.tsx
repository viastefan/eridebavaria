"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Headphones, Wrench, Package, Truck } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { platform } from "@/lib/platform";

gsap.registerPlugin(ScrollTrigger);

const pillarIcons = [Headphones, Wrench, Package, Truck];

export function HomePlatform() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".platform-card", {
        y: 40,
        opacity: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section home-platform section--surface">
      <Container>
        <SectionHeading
          label="Service"
          title="Betreuung, die über den Kauf hinausgeht"
          description="Werkstatt in Simbach, Ersatzteile ab Lager und persönliche Beratung — für die gesamte Inn-Salzach-Region."
          className="mb-12 max-w-2xl md:mb-16"
        />

        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          {platform.ecosystem.map((item, i) => {
            const Icon = pillarIcons[i] ?? Headphones;
            return (
              <Link key={item.title} href={item.href} className="platform-card group">
                <div className="relative z-[1]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="platform-card__icon">
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    </div>
                    <span className="platform-card__index">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="heading-md mt-5 text-foreground">{item.title}</h3>
                  <p className="body-muted mt-3">{item.description}</p>
                  <span className="platform-card__cta">
                    Mehr erfahren
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
