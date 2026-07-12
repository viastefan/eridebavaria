"use client";

import { useRef, useEffect } from "react";
import { Leaf, Volume2, Coins, Zap } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { regional } from "@/lib/regional";

gsap.registerPlugin(ScrollTrigger);

const benefitIcons = [Leaf, Volume2, Coins, Zap];

export function HomeMobilityBenefits() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".mobility-benefit", {
        y: 28,
        opacity: 0,
        duration: 0.75,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section bg-background">
      <Container>
        <SectionHeading
          label="Vorteile"
          title="Kraftvoll, leise und nachhaltig"
          description="Für Hof, Gewerbe und Freizeit in der Inn-Salzach-Region — mit E-Fahrzeugen, die zum Alltag passen."
          className="mb-12 max-w-2xl"
        />

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {regional.mobilityBenefits.map((item, index) => {
            const Icon = benefitIcons[index] ?? Zap;
            return (
              <div key={item.label} className="benefit-card mobility-benefit">
                <div className="benefit-card__icon">
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </div>
                <p className="mt-5 font-medium text-foreground">{item.label}</p>
                <p className="mt-2.5 text-sm leading-relaxed text-foreground-secondary">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
