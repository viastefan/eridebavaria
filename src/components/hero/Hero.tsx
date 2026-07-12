"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const VehicleScene = dynamic(
  () => import("./VehicleScene").then((m) => m.VehicleScene),
  { ssr: false, loading: () => <div className="h-full w-full bg-background" /> }
);

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current || !sceneRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(sceneRef.current, {
        scale: 1.15,
        y: -80,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      gsap.to(contentRef.current, {
        y: -120,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "60% top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[200vh]"
      id="hero"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Ambient gradients */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px] animate-pulse-glow" />
          <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-accent-secondary/5 blur-[100px] animate-pulse-glow" />
        </div>

        {/* 3D Scene */}
        <div ref={sceneRef} className="absolute inset-0 z-0">
          <VehicleScene />
        </div>

        {/* Gradient overlays */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-background via-transparent to-background/40" />
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-background/60 via-transparent to-background/60" />

        {/* Content */}
        <div
          ref={contentRef}
          className="relative z-20 flex h-full flex-col justify-end section-padding pb-24 md:pb-32"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 2.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="mb-6 block text-xs font-medium uppercase tracking-[0.3em] text-accent">
              Electric Mobility Reimagined
            </span>
            <h1 className="heading-display max-w-5xl text-gradient">
              Move Beyond
              <br />
              Roads.
            </h1>
            <p className="mt-8 max-w-md text-base leading-relaxed text-foreground-secondary md:text-lg">
              Premium European electric vehicles engineered in Bavaria.
              Experience movement without compromise.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/shop">
                <Button>Explore Collection</Button>
              </Link>
              <Button variant="secondary">Watch Experience</Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
        >
          <motion.div
            className="flex flex-col items-center gap-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-foreground-secondary">
              Scroll
            </span>
            <div className="h-8 w-px bg-gradient-to-b from-foreground-secondary to-transparent" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
