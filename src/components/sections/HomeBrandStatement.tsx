"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/Container";
import { platform } from "@/lib/platform";
import { regional } from "@/lib/regional";

gsap.registerPlugin(ScrollTrigger);

export function HomeBrandStatement() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".brand-statement__line", {
        y: 48,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="home-brand bg-background">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-20">
          <div>
            <div className="brand-statement__line home-location">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span>{regional.brand.city}</span>
            </div>
            <h2 className="heading-display brand-statement__line mt-8 max-w-4xl text-foreground">
              {platform.brand.tagline}
            </h2>
            <p className="brand-statement__line body-editorial mt-8 max-w-2xl text-foreground-secondary">
              {platform.brand.manifesto}
            </p>
            <div className="brand-statement__line home-cta-row">
              <Link href="/shop" className="btn btn--primary">
                Zum Katalog
              </Link>
              <Link href="/fleet" className="btn btn--secondary">
                Gewerbe & Flotte
              </Link>
              <Link href="/#beratung" className="btn btn--ghost">
                Beratung anfragen
              </Link>
            </div>
          </div>

          <div className="brand-statement__line hidden lg:block">
            <div className="rounded-[16px] border border-border bg-card p-6">
              <p className="text-small font-medium text-foreground">Inn-Salzach-Region</p>
              <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">
                Beratung, Werkstatt und Ersatzteile aus einer Hand — für Simbach, Braunau und
                Umgebung.
              </p>
              <Link href="/garage" className="section-action mt-6">
                Zur Garage
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
