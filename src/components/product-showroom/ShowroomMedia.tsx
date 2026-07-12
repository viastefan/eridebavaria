"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play } from "lucide-react";
import { useShowroom } from "./ShowroomProvider";
import { showroomLabels } from "@/lib/showroom-labels";

gsap.registerPlugin(ScrollTrigger);

const typeLabels: Record<string, string> = {
  studio: showroomLabels.studio,
  lifestyle: showroomLabels.lifestyle,
  detail: showroomLabels.detail,
  macro: showroomLabels.macro,
  material: showroomLabels.material,
  video: showroomLabels.video,
  animation: showroomLabels.animation,
};

export function ShowroomMedia() {
  const { data } = useShowroom();
  const [active, setActive] = useState(0);
  const [filter, setFilter] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const items = filter
    ? data.media.filter((m) => m.type === filter)
    : data.media;

  useEffect(() => {
    if (!gridRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".media-tile", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: gridRef.current, start: "top 75%" },
      });
    }, gridRef);
    return () => ctx.revert();
  }, [filter]);

  const activeItem = items[active] ?? data.media[0];

  return (
    <section className="section-padding border-t border-border py-24 md:py-48">
      <div className="mb-16 text-center">
        <span className="text-[10px] uppercase tracking-[0.3em] text-accent">
          {showroomLabels.media}
        </span>
        <h2 className="heading-xl mt-4">Visuell inszeniert</h2>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setFilter(null)}
          className={`rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.18em] transition-all duration-700 ${
            !filter ? "bg-foreground text-background" : "text-foreground-secondary hover:text-foreground"
          }`}
        >
          Alle
        </button>
        {Object.entries(typeLabels).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.18em] transition-all duration-700 ${
              filter === key ? "bg-foreground text-background" : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeItem?.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto mb-16 aspect-[21/9] max-h-[70vh] overflow-hidden rounded-3xl border border-border bg-card"
      >
        {activeItem && (
          <Image
            src={activeItem.src}
            alt={activeItem.title}
            fill
            className="object-contain p-8"
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        <div className="absolute right-0 bottom-0 left-0 p-10">
          <span className="text-[10px] uppercase tracking-[0.2em] text-accent">
            {activeItem && typeLabels[activeItem.type]}
          </span>
          <h3 className="mt-2 text-3xl font-medium">{activeItem?.title}</h3>
          <p className="mt-2 text-foreground-secondary">{activeItem?.subtitle}</p>
        </div>
        {(activeItem?.type === "video" || activeItem?.type === "animation") && (
          <button
            type="button"
            className="absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-foreground/90 text-background backdrop-blur-xl"
          >
            <Play className="h-6 w-6 fill-current" />
          </button>
        )}
      </motion.div>

      <div ref={gridRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(i)}
            className={`media-tile group relative aspect-[4/3] overflow-hidden rounded-2xl border transition-all duration-700 ${
              active === i ? "border-accent/40" : "border-border hover:border-foreground/10"
            }`}
            data-cursor="pointer"
          >
            <Image
              src={item.src}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              sizes="25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
            <div className="absolute right-0 bottom-0 left-0 p-4 text-left">
              <p className="text-xs text-foreground-secondary">{typeLabels[item.type]}</p>
              <p className="text-sm font-medium">{item.title}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
