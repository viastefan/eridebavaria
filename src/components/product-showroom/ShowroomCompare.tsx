"use client";

import { motion } from "framer-motion";
import { formatPrice } from "@/lib/products";
import { useShowroom } from "./ShowroomProvider";
import { showroomLabels } from "@/lib/showroom-labels";
import { getConfigDiff, createSnapshot } from "@/lib/showroom-utils";

export function ShowroomCompare() {
  const { product, config, specs, savedConfigs, compareConfig, setCompareConfig } =
    useShowroom();

  const current = createSnapshot(product, config, showroomLabels.configA);
  const compare = compareConfig ?? savedConfigs[0] ?? null;
  const diffs = compare ? getConfigDiff(current, compare) : [];

  if (!compare) {
    return (
      <section className="section-padding border-t border-border py-24 text-center md:py-32">
        <h2 className="heading-lg">{showroomLabels.compareConfigs}</h2>
        <p className="mt-4 text-foreground-secondary">
          Speichere eine Konfiguration, um sie mit der aktuellen zu vergleichen.
        </p>
      </section>
    );
  }

  return (
    <section className="section-padding border-t border-border py-24 md:py-32">
      <span className="text-[10px] uppercase tracking-[0.3em] text-accent">
        {showroomLabels.compareConfigs}
      </span>
      <h2 className="heading-xl mt-4">{showroomLabels.diff}</h2>

      <div className="mt-16 grid gap-8 lg:grid-cols-2">
        {[current, compare].map((snap, i) => (
          <motion.div
            key={snap.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl border border-border bg-card/40 p-8 md:p-10"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-foreground-secondary">
              {snap.label}
            </p>
            <p className="mt-4 text-3xl font-medium">{formatPrice(snap.price)}</p>
            <div className="mt-8 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground-secondary">{showroomLabels.range}</span>
                <span>{snap.rangeKm} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-secondary">{showroomLabels.weight}</span>
                <span>{snap.weightKg} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-secondary">{showroomLabels.payload}</span>
                <span>{snap.payloadKg} kg</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {diffs.length > 0 && (
        <div className="mt-12 space-y-3">
          {diffs.map((d, i) => (
            <motion.div
              key={d.key}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="flex items-center justify-between rounded-2xl border border-border bg-card/30 px-6 py-4"
            >
              <span className="text-sm text-foreground-secondary">{d.key}</span>
              <div className="flex items-center gap-4 text-sm font-medium">
                <span>{d.a}</span>
                <span className="text-accent">→</span>
                <span>{d.b}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {savedConfigs.length > 1 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {savedConfigs.map((cfg) => (
            <button
              key={cfg.id}
              type="button"
              onClick={() => setCompareConfig(cfg)}
              className={`rounded-full px-4 py-2 text-xs transition-colors ${
                compareConfig?.id === cfg.id
                  ? "bg-foreground text-background"
                  : "border border-border text-foreground-secondary hover:text-foreground"
              }`}
            >
              {cfg.label}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
