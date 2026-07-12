"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useShowroom } from "./ShowroomProvider";

export function HotspotCard() {
  const { data, selectedHotspot, setSelectedHotspot } = useShowroom();
  const hotspot = data.hotspots.find((h) => h.id === selectedHotspot);

  return (
    <AnimatePresence>
      {hotspot && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-28 right-6 z-40 w-[min(100%,380px)] md:right-10"
        >
          <div className="overflow-hidden rounded-3xl border border-border bg-card/95 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
            <div className="relative aspect-[16/10] bg-gradient-to-br from-accent/10 via-transparent to-accent-secondary/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-24 w-24 rounded-full border border-accent/20 bg-accent/5" />
                <div className="absolute h-16 w-16 animate-pulse-glow rounded-full bg-accent/20 blur-xl" />
              </div>
              <button
                type="button"
                onClick={() => setSelectedHotspot(null)}
                className="absolute top-4 right-4 rounded-full bg-background/60 p-2 backdrop-blur-xl transition-colors hover:bg-background"
                data-cursor="pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-8">
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent">
                {hotspot.label}
              </span>
              <h3 className="mt-3 text-2xl font-medium tracking-tight">{hotspot.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-foreground-secondary">
                {hotspot.description}
              </p>
              {hotspot.specs && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {hotspot.specs.map((spec) => (
                    <span
                      key={spec}
                      className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground-secondary"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
