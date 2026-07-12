"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { upgradeStories, platform } from "@/lib/platform";
import { formatPrice } from "@/lib/products";

gsap.registerPlugin(ScrollTrigger);

export function UpgradeWorld() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".upgrade-card", {
        y: 70,
        opacity: 0,
        duration: 1.2,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="upgrades" className="section-padding border-t border-border py-32 md:py-48">
      <div className="mb-20 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <span className="text-[10px] uppercase tracking-[0.35em] text-accent">
            {platform.upgrades.title}
          </span>
          <h2 className="heading-xl mt-4">{platform.upgrades.subtitle}</h2>
          <p className="mt-4 text-foreground-secondary">{platform.upgrades.philosophy}</p>
        </div>
        <Link
          href="/upgrades"
          className="text-sm text-foreground-secondary transition-colors hover:text-foreground"
        >
          Alle Upgrades →
        </Link>
      </div>

      <div className="space-y-6">
        {upgradeStories.map((story) => (
          <article
            key={story.id}
            className="upgrade-card group rounded-3xl border border-border bg-card p-10 transition-colors duration-700 hover:border-foreground/10 md:p-14"
          >
            <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <div>
                <h3 className="heading-lg">{story.title}</h3>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-foreground-secondary">
                  {story.narrative}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card-elevated p-8">
                <p className="text-[10px] uppercase tracking-[0.2em] text-foreground-secondary">
                  Enthält
                </p>
                <ul className="mt-4 space-y-2">
                  {story.items.map((item) => (
                    <li key={item} className="text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-8 text-sm text-foreground-secondary">
                  ab {formatPrice(story.priceFrom)}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
