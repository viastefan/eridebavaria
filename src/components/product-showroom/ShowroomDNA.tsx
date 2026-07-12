"use client";

import { useShowroom } from "./ShowroomProvider";
import { getVehicleDNA } from "@/lib/platform";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function ShowroomDNA() {
  const { product, config, updateConfig } = useShowroom();
  const dna = getVehicleDNA(product.slug);
  const [active, setActive] = useState(0);

  if (!dna) return null;

  const scenario = dna.scenarios[active];

  const applyPackage = () => {
    if (!scenario) return;
    updateConfig({ accessories: scenario.accessories });
  };

  return (
    <section className="section-padding border-t border-border py-24 md:py-32">
      <div className="mb-12">
        <span className="text-[10px] uppercase tracking-[0.35em] text-accent">
          Vehicle DNA
        </span>
        <h2 className="heading-xl mt-4">{dna.essence}</h2>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {dna.scenarios.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(i)}
              className={`shrink-0 rounded-2xl border px-5 py-4 text-left transition-all duration-700 lg:w-full ${
                active === i
                  ? "border-accent/40 bg-accent/5"
                  : "border-border hover:border-foreground/10"
              }`}
            >
              <span className="text-[10px] uppercase tracking-[0.15em] text-foreground-secondary">
                {s.title}
              </span>
              <p className="mt-1 text-sm font-medium">{s.headline}</p>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {scenario && (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl border border-border bg-card/50 p-10"
            >
              <h3 className="text-2xl font-medium">{scenario.packageName}</h3>
              <p className="mt-4 max-w-xl leading-relaxed text-foreground-secondary">
                {scenario.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button onClick={applyPackage}>Paket am Fahrzeug montieren</Button>
                <Link href="/upgrades">
                  <Button variant="secondary">Upgrade-Welt</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
