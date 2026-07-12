"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

export function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(contentRef.current!.children, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-32 md:py-48"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <div className="section-padding relative">
        <div ref={contentRef} className="mx-auto max-w-4xl text-center">
          <span className="mb-6 block text-xs font-medium uppercase tracking-[0.3em] text-accent">
            The Future Awaits
          </span>
          <h2 className="heading-display text-gradient">
            Become Part of
            <br />
            the Future.
          </h2>
          <p className="mx-auto mt-8 max-w-lg text-lg text-foreground-secondary">
            Join thousands across Europe who have already chosen electric
            mobility without compromise.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link href="/shop">
              <Button>Explore Collection</Button>
            </Link>
            <Button variant="secondary">Book a Test Drive</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
