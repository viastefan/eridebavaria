"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useShowroom } from "./ShowroomProvider";
import { ShowroomControls } from "./ShowroomControls";
import { HotspotCard } from "./HotspotCard";
import { badgeLabels } from "@/lib/labels";
import { formatPrice } from "@/lib/products";
import { showroomLabels } from "@/lib/showroom-labels";

const ShowroomCanvas = dynamic(
  () => import("./viewer/ShowroomCanvas").then((m) => m.ShowroomCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <motion.div
          className="h-1 w-32 overflow-hidden rounded-full bg-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-full bg-accent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>
      </div>
    ),
  }
);

export function ShowroomHero() {
  const { product, specs } = useShowroom();

  return (
    <section className="showroom-hero relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--card)_0%,_var(--background)_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_color-mix(in_srgb,_var(--accent)_8%,_transparent)_0%,_transparent_50%)]" />

      <div className="absolute inset-0 pt-24">
        <ShowroomCanvas />
      </div>

      <HotspotCard />
      <ShowroomControls />

      <motion.div
        className="pointer-events-none absolute top-32 left-6 z-20 max-w-md md:left-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {product.badge && (
          <span className="mb-4 inline-block rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-accent">
            {badgeLabels[product.badge]}
          </span>
        )}
        <h1 className="heading-display text-gradient">{product.name}</h1>
        <p className="mt-4 text-lg text-foreground-secondary">{product.tagline}</p>
        <p className="mt-6 text-sm uppercase tracking-[0.2em] text-foreground-secondary">
          {showroomLabels.priceFrom} {formatPrice(specs.price)}
        </p>
      </motion.div>
    </section>
  );
}
