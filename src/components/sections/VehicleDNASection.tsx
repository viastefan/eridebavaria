"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { vehicleDNA } from "@/lib/platform";
import { getProductBySlug } from "@/lib/products";
import { Button } from "@/components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

export function VehicleDNASection() {
  const ref = useRef<HTMLElement>(null);
  const [activeVehicle, setActiveVehicle] = useState(0);
  const [activeScenario, setActiveScenario] = useState(0);

  const dna = vehicleDNA[activeVehicle];
  const product = dna ? getProductBySlug(dna.slug) : null;
  const scenario = dna?.scenarios[activeScenario];

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".dna-content", {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    setActiveScenario(0);
  }, [activeVehicle]);

  if (!dna || !product) return null;

  return (
    <section ref={ref} id="vehicle-dna" className="section-padding border-t border-border py-32 md:py-48">
      <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.35em] text-accent">
            Vehicle DNA
          </span>
          <h2 className="heading-xl mt-4">{product.name}</h2>
          <p className="mt-4 max-w-lg text-foreground-secondary">{dna.essence}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {vehicleDNA.map((v, i) => {
            const p = getProductBySlug(v.slug);
            return p ? (
              <button
                key={v.slug}
                type="button"
                onClick={() => setActiveVehicle(i)}
                className={`rounded-full px-4 py-2 text-xs transition-all duration-700 ${
                  activeVehicle === i
                    ? "bg-foreground text-background"
                    : "border border-border text-foreground-secondary hover:text-foreground"
                }`}
              >
                {p.name.split(" ").slice(0, 2).join(" ")}
              </button>
            ) : null;
          })}
        </div>
      </div>

      <div className="dna-content grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col gap-2">
          {dna.scenarios.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveScenario(i)}
              className={`rounded-2xl border p-6 text-left transition-all duration-700 ${
                activeScenario === i
                  ? "border-accent/30 bg-card-elevated"
                  : "border-transparent hover:border-border hover:bg-card/50"
              }`}
              data-cursor="pointer"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-foreground-secondary">
                {s.title}
              </span>
              <h3 className="mt-2 text-xl font-medium">{s.headline}</h3>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {scenario && (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl border border-border bg-card p-10 md:p-12"
            >
              <p className="text-lg leading-relaxed text-foreground-secondary">
                {scenario.description}
              </p>
              <div className="mt-10 border-t border-border pt-8">
                <p className="text-[10px] uppercase tracking-[0.2em] text-accent">
                  {scenario.packageName}
                </p>
                <ul className="mt-4 space-y-2">
                  {scenario.accessories.map((a) => (
                    <li key={a} className="text-sm text-foreground-secondary">
                      · {a.replace("acc-", "").replace("-", " ")}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href={`/product/${dna.slug}`} className="mt-10 inline-block">
                <Button variant="secondary">Showroom öffnen</Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
