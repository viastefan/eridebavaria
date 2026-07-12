"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function Newsletter() {
  const ref = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(ref.current!.children, {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section-padding py-32 md:py-48">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-accent">
          Bleib informiert
        </span>
        <h2 className="heading-xl mt-4 text-gradient">
          Die Zukunft, geliefert
        </h2>
        <p className="mt-4 text-foreground-secondary">
          Erfahre als Erster von neuen Fahrzeugen, exklusiven Events und
          Einblicken in die E-Mobilität.
        </p>

        {submitted ? (
          <motion.p
            className="mt-8 text-accent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Willkommen in der Zukunft. Prüfe dein Postfach.
          </motion.p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-0"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.com"
              required
              className="flex-1 rounded-full border border-border bg-card px-6 py-4 outline-none transition-colors focus:border-accent/50 sm:rounded-r-none"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-medium text-background transition-all hover:shadow-[0_0_30px_var(--button-glow)] sm:rounded-l-none"
              data-cursor="pointer"
            >
              Abonnieren
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
