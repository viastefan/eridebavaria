"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Building2, Tractor, Hotel, Landmark } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const solutions = [
  {
    id: "private",
    icon: Building2,
    title: "Privatkunden",
    description: "Fahrzeuge für Stadt, Region und Freizeit — persönlich beraten, sicher geliefert.",
    href: "/shop",
  },
  {
    id: "business",
    icon: Building2,
    title: "Gewerbe & Handwerk",
    description: "Transporter und Utility-Fahrzeuge für den letzten Kilometer und den Werkstattalltag.",
    href: "/fleet",
  },
  {
    id: "agriculture",
    icon: Tractor,
    title: "Landwirtschaft",
    description: "Robuste Elektrofahrzeuge für Hof, Feld und alpine Betriebe in Bayern.",
    href: "/fleet",
  },
  {
    id: "hospitality",
    icon: Hotel,
    title: "Hotels & Resorts",
    description: "Leise Shuttle-Lösungen für Gäste — emissionsfrei durch Ihr Gelände.",
    href: "/fleet",
  },
  {
    id: "municipal",
    icon: Landmark,
    title: "Kommunen",
    description: "Flotten für Grünflächenpflege, innerstädtische Logistik und kommunale Dienste.",
    href: "/fleet",
  },
];

export function SolutionsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const items = gridRef.current.querySelectorAll(".solution-card");

    const ctx = gsap.context(() => {
      gsap.from(items, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: { trigger: gridRef.current, start: "top 82%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 md:py-36">
      <div className="section-padding mx-auto max-w-7xl">
        <SectionHeading
          label="Lösungen"
          title="Mobilität für jede Anforderung"
          description="Vom Privatfahrzeug bis zur kommunale Flotte — eine Plattform, viele Einsatzbereiche."
          className="mb-16"
        />

        <div ref={gridRef} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="solution-card group rounded-2xl border border-border bg-card p-8 transition-all duration-500 hover:border-foreground/12 hover:bg-card-elevated"
            >
              <item.icon className="h-5 w-5 text-foreground-secondary transition-colors group-hover:text-foreground" />
              <h3 className="mt-6 text-lg font-medium tracking-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">
                {item.description}
              </p>
              <span className="mt-6 inline-block text-sm text-foreground-secondary transition-colors group-hover:text-foreground">
                Mehr erfahren →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
