"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  label,
  title,
  description,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.from(ref.current!.children, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className={`${align === "center" ? "text-center mx-auto max-w-3xl" : ""} ${className}`}
    >
      {label && (
        <span className="mb-4 block text-xs font-medium uppercase tracking-[0.25em] text-accent">
          {label}
        </span>
      )}
      <h2 className="heading-xl text-gradient">{title}</h2>
      {description && (
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground-secondary">
          {description}
        </p>
      )}
    </div>
  );
}
