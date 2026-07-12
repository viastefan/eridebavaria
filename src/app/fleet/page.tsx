"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { platform, upgradeStories } from "@/lib/platform";
import { Button } from "@/components/ui/Button";

export default function FleetPage() {
  return (
    <main className="min-h-screen">
      <section className="section-padding flex min-h-[70vh] flex-col justify-end pb-20 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[10px] uppercase tracking-[0.35em] text-accent">Business</span>
          <h1 className="heading-display mt-6 max-w-4xl text-gradient">
            {platform.fleet.title}
          </h1>
          <p className="mt-8 max-w-xl text-lg text-foreground-secondary">
            {platform.fleet.subtitle}
          </p>
        </motion.div>
      </section>

      <section className="section-padding border-t border-border py-24">
        <div className="flex flex-wrap gap-3">
          {platform.fleet.audiences.map((a) => (
            <span
              key={a}
              className="rounded-full border border-border px-5 py-2.5 text-sm text-foreground-secondary"
            >
              {a}
            </span>
          ))}
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Flottenübersicht",
              desc: "Alle Fahrzeuge, Status, Reichweite — ein Dashboard.",
            },
            {
              title: "Service-Pakete",
              desc: "Wartung, Ersatzteile, Upgrades — gebündelt für Betriebe.",
            },
            {
              title: "Kosteneinsparung",
              desc: "Emissionen runter. Transparenz rauf. ROI messbar.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-card p-8">
              <h3 className="text-xl font-medium">{item.title}</h3>
              <p className="mt-3 text-sm text-foreground-secondary">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <Link href="/account">
            <Button>Fleet-Beratung anfragen</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
