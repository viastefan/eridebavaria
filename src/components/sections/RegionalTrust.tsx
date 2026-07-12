"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Users, Award } from "lucide-react";
import { images } from "@/lib/images";
import { regional } from "@/lib/regional";
import { Container } from "@/components/ui/Container";

gsap.registerPlugin(ScrollTrigger);

const trustIcons = [MapPin, Users, Award];

export function RegionalTrust() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".trust-content", {
        x: -40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
      gsap.from(".trust-visual", {
        x: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="porsche-section bg-background">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="trust-content">
            <h2 className="porsche-headline porsche-headline--sm">{regional.tagline}</h2>
            <p className="porsche-subline mt-4 max-w-lg">
              Von der Probefahrt bis zur Wartung — wir sind in Simbach am Inn für Sie da und
              betreuen Kunden in der gesamten Inn-Salzach-Region.
            </p>

          <ul className="space-y-8">
            {regional.trustPoints.map((point, i) => {
              const Icon = trustIcons[i] ?? MapPin;
              return (
                <li key={point.title} className="flex gap-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border">
                    <Icon className="h-4 w-4 text-foreground-secondary" />
                  </div>
                  <div>
                    <h3 className="heading-md text-foreground">{point.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
                      {point.text}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-10">
            <p className="text-small font-medium text-foreground">Einzugsgebiet</p>
            <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">
              {regional.serviceArea.join(" · ")}
            </p>
          </div>

          <Link
            href="/shop"
            className="mt-10 inline-flex rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Beratung anfragen
          </Link>
        </div>

        <div className="trust-visual relative aspect-[4/5] overflow-hidden rounded-[28px]">
          <Image
            src={images.ek4[0]}
            alt="E-GO eK4 — Elektro Mopedauto"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <p className="text-xs uppercase tracking-[0.25em] text-white/70">Standort</p>
            <p className="mt-2 text-lg font-medium text-white">
              {regional.brand.city} · {regional.brand.region}
            </p>
            <p className="mt-1 text-sm text-white/75">{regional.brand.postal}</p>
          </div>
        </div>
        </div>
      </Container>
    </section>
  );
}
