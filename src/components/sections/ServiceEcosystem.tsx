"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Wrench, Package, Headphones, ShieldCheck, Truck } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { regional } from "@/lib/regional";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Headphones,
    title: "Persönliche Beratung",
    description:
      "Wir prüfen jede Anfrage und melden uns bei Ihnen — für Modellwahl, Batterie und Zubehör.",
    href: "/#beratung",
  },
  {
    icon: Wrench,
    title: "Werkstatt Simbach",
    description:
      "Inspektion, Reparatur und saisonale Checks vor Ort. Partnerwerkstätten in der Inn-Salzach-Region.",
    href: "/service",
  },
  {
    icon: Package,
    title: "Ersatzteile",
    description:
      "Originalteile für Quads, Mopedautos, Transporter und Motorräder — Versand in 48 Stunden.",
    href: "/parts",
  },
  {
    icon: Truck,
    title: "Lieferung & Abholung",
    description:
      "Abholung in Simbach, Anlieferung im Umkreis oder EU-Versand — inklusive Einweisung.",
    href: "/shop",
  },
  {
    icon: ShieldCheck,
    title: "Garantie & Gewährleistung",
    description:
      "Transparente Garantie auf Fahrzeuge und Komponenten — dokumentiert und servicefähig.",
    href: "/garage",
  },
];

export function ServiceEcosystem() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".service-item", {
        y: 36,
        opacity: 0,
        duration: 0.85,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="border-y border-border bg-background py-20 md:py-28">
      <Container>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
          <SectionHeading
            label="Vor Ort"
            title="Alles aus einer Hand in Simbach"
            description={`Werkstatt, Ersatzteile, Beratung und Lieferung für ${regional.brand.region}.`}
            className="mb-0 max-w-2xl"
          />
          <Link href="/garage" className="section-action shrink-0">
            Zur Garage
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {services.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="service-item benefit-card group block"
            >
              <div className="benefit-card__icon">
                <item.icon className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <h3 className="heading-md mt-5 text-foreground">{item.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-foreground-secondary">
                {item.description}
              </p>
              <span className="platform-card__cta mt-5">
                Details
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
