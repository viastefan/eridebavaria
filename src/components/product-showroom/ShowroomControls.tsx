"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useShowroom } from "./ShowroomProvider";
import { showroomLabels } from "@/lib/showroom-labels";
import type { ShowroomMode, CameraView } from "@/lib/showroom-types";

const modes: ShowroomMode[] = ["showroom", "exploded", "parts", "compare"];
const views: CameraView[] = [
  "exterior",
  "interior",
  "cargo",
  "underside",
  "battery",
  "lighting",
];

export function ShowroomControls() {
  const { mode, setMode, cameraView, setCameraView, specs } = useShowroom();

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex flex-col gap-4 p-6 md:p-10">
      <div className="pointer-events-auto mx-auto flex flex-wrap justify-center gap-2">
        {modes.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-full px-5 py-2.5 text-xs uppercase tracking-[0.2em] transition-all duration-700 ${
              mode === m
                ? "bg-foreground text-background shadow-[0_0_30px_var(--button-glow)]"
                : "border border-border bg-card/80 text-foreground-secondary backdrop-blur-xl hover:text-foreground"
            }`}
            data-cursor="pointer"
          >
            {showroomLabels.modes[m]}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === "showroom" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto mx-auto flex flex-wrap justify-center gap-2"
          >
            {views.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setCameraView(v)}
                className={`rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.18em] transition-all duration-700 ${
                  cameraView === v
                    ? "border border-accent/50 bg-accent/10 text-foreground"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
                data-cursor="pointer"
              >
                {showroomLabels.views[v]}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-auto mx-auto flex gap-8 rounded-2xl border border-border bg-card/70 px-8 py-4 backdrop-blur-2xl">
        {[
          { label: showroomLabels.range, value: `${specs.rangeKm} km` },
          { label: showroomLabels.weight, value: `${specs.weightKg} kg` },
          { label: showroomLabels.payload, value: `${specs.payloadKg} kg` },
          {
            label: showroomLabels.delivery,
            value: `${specs.deliveryWeeks} ${showroomLabels.weeks}`,
          },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-foreground-secondary">
              {item.label}
            </p>
            <p className="mt-1 text-sm font-medium">{item.value}</p>
          </div>
        ))}
      </div>

      <p className="pointer-events-none text-center text-[10px] uppercase tracking-[0.25em] text-foreground-secondary/60">
        {showroomLabels.rotate} · {showroomLabels.zoom}
      </p>
    </div>
  );
}
