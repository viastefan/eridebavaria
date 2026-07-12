"use client";

import { Html } from "@react-three/drei";
import { useShowroom } from "../ShowroomProvider";

export function HotspotMarkers() {
  const { data, mode, selectedHotspot, setSelectedHotspot } = useShowroom();

  if (mode !== "showroom") return null;

  return (
    <>
      {data.hotspots.map((hotspot) => (
        <Html
          key={hotspot.id}
          position={hotspot.position}
          center
          distanceFactor={8}
          zIndexRange={[40, 0]}
        >
          <button
            type="button"
            onClick={() =>
              setSelectedHotspot(
                selectedHotspot === hotspot.id ? null : hotspot.id
              )
            }
            className={`group flex items-center gap-2 transition-all duration-700 ${
              selectedHotspot === hotspot.id ? "scale-110" : "hover:scale-105"
            }`}
            data-cursor="pointer"
          >
            <span className="relative flex h-5 w-5 items-center justify-center">
              <span
                className={`absolute h-full w-full rounded-full transition-opacity duration-700 ${
                  selectedHotspot === hotspot.id
                    ? "animate-ping bg-accent/50"
                    : "bg-accent/20 opacity-0 group-hover:opacity-100"
                }`}
              />
              <span
                className={`relative h-2.5 w-2.5 rounded-full border-2 transition-colors duration-500 ${
                  selectedHotspot === hotspot.id
                    ? "border-accent bg-accent shadow-[0_0_20px_var(--accent-glow)]"
                    : "border-foreground/40 bg-background/80 group-hover:border-accent"
                }`}
              />
            </span>
            <span
              className={`whitespace-nowrap rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em] backdrop-blur-xl transition-all duration-700 ${
                selectedHotspot === hotspot.id
                  ? "border-accent/40 bg-card/95 text-foreground opacity-100"
                  : "border-border bg-card/60 text-foreground-secondary opacity-0 group-hover:opacity-100"
              }`}
            >
              {hotspot.label}
            </span>
          </button>
        </Html>
      ))}
    </>
  );
}
