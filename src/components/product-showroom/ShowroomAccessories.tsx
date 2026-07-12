"use client";

import { motion } from "framer-motion";
import { formatPrice } from "@/lib/products";
import { useShowroom } from "./ShowroomProvider";
import { showroomLabels } from "@/lib/showroom-labels";

export function ShowroomAccessories() {
  const { data, config, toggleAccessory } = useShowroom();

  return (
    <section className="section-padding border-t border-border py-24 md:py-32">
      <div className="mb-16 max-w-xl">
        <span className="text-[10px] uppercase tracking-[0.3em] text-accent">
          {showroomLabels.accessories}
        </span>
        <h2 className="heading-xl mt-4">Montiert. Sichtbar. Sofort.</h2>
        <p className="mt-4 text-foreground-secondary">
          Jedes Zubehörteil wird live am 3D-Modell platziert — du siehst sofort,
          wie es wirkt.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.accessories.map((acc, i) => {
          const active = config.accessories.includes(acc.id);
          return (
            <motion.button
              key={acc.id}
              type="button"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => toggleAccessory(acc.id)}
              className={`rounded-2xl border p-6 text-left transition-all duration-700 ${
                active
                  ? "border-accent/40 bg-accent/5 shadow-[0_0_40px_var(--accent-glow)]"
                  : "border-border bg-card/30 hover:border-foreground/10"
              }`}
              data-cursor="pointer"
            >
              <div
                className={`mb-6 flex h-16 w-16 items-center justify-center rounded-xl border transition-colors duration-700 ${
                  active ? "border-accent/30 bg-accent/10" : "border-border bg-card"
                }`}
              >
                <div className={`h-8 w-8 rounded ${active ? "bg-accent/40" : "bg-foreground/10"}`} />
              </div>
              <h3 className="font-medium">{acc.name}</h3>
              <p className="mt-2 text-sm text-foreground-secondary">{acc.description}</p>
              <p className="mt-4 text-sm font-medium">
                {active ? "Montiert ✓" : `+${formatPrice(acc.price)}`}
              </p>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
