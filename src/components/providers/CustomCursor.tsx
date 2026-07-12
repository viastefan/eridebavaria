"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 28, stiffness: 280, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [data-cursor='pointer']");
      if (cursorRef.current) {
        cursorRef.current.style.transform = interactive
          ? "translate(-50%, -50%) scale(2.5)"
          : "translate(-50%, -50%) scale(1)";
        cursorRef.current.style.opacity = interactive ? "0.5" : "0.3";
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", handleHover);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", handleHover);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      <motion.div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden h-8 w-8 rounded-full border border-accent/40 mix-blend-difference md:block"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        ref={cursorDotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden h-1 w-1 rounded-full bg-accent md:block"
        style={{ x: mouseX, y: mouseY, translateX: "-50%", translateY: "-50%" }}
      />
    </>
  );
}
