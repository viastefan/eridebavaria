"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Product } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

interface SpecGridProps {
  product: Product;
}

const specItems = [
  { key: "battery", label: "Battery" },
  { key: "power", label: "Power" },
  { key: "charging", label: "Charging" },
  { key: "range", label: "Range" },
  { key: "topSpeed", label: "Top Speed" },
  { key: "payload", label: "Payload" },
  { key: "seats", label: "Seats" },
  { key: "dimensions", label: "Dimensions" },
  { key: "weight", label: "Weight" },
  { key: "motor", label: "Motor" },
] as const;

export function SpecGrid({ product }: SpecGridProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".spec-card", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 75%",
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {specItems.map(({ key, label }) => {
        const value =
          key === "seats"
            ? product.specs.seats
            : product.specs[key as keyof typeof product.specs];
        return (
          <div
            key={key}
            className="spec-card rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm"
          >
            <span className="text-xs uppercase tracking-[0.15em] text-foreground-secondary">
              {label}
            </span>
            <p className="mt-2 text-2xl font-medium tracking-tight">{value}</p>
          </div>
        );
      })}
    </div>
  );
}
