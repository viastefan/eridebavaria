"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { platform, upgradeStories } from "@/lib/platform";
import { formatPrice } from "@/lib/products";
import { Button } from "@/components/ui/Button";

export default function UpgradesPage() {
  return (
    <main className="min-h-screen pt-32 pb-24">
      <div className="section-padding mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[10px] uppercase tracking-[0.35em] text-accent">
            {platform.upgrades.title}
          </span>
          <h1 className="heading-display mt-6 text-gradient">
            {platform.upgrades.subtitle}
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-foreground-secondary">
            {platform.upgrades.philosophy}
          </p>
        </motion.div>

        <div className="mt-20 space-y-8">
          {upgradeStories.map((story, i) => (
            <motion.article
              key={story.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.08 }}
              className="rounded-3xl border border-border bg-card p-10 md:p-14"
            >
              <h2 className="heading-lg">{story.title}</h2>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground-secondary">
                {story.narrative}
              </p>
              <ul className="mt-8 flex flex-wrap gap-2">
                {story.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-border px-4 py-2 text-sm"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex items-center justify-between">
                <span className="text-lg font-medium">
                  ab {formatPrice(story.priceFrom)}
                </span>
                <Link href="/shop">
                  <Button variant="secondary">Am Fahrzeug montieren</Button>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </main>
  );
}
