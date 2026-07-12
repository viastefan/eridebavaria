"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products, compareSpecKeys, formatPrice } from "@/lib/products";
import { useStore } from "@/lib/store";
import { labels } from "@/lib/labels";

gsap.registerPlugin(ScrollTrigger);

export function CompareTable() {
  const ref = useRef<HTMLDivElement>(null);
  const { compare, toggleCompare, clearCompare } = useStore();

  const compareProducts = products.filter((p) => compare.includes(p.id));

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".compare-col", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 80%" },
      });
    }, ref);
    return () => ctx.revert();
  }, [compareProducts.length]);

  if (compareProducts.length === 0) {
    return (
      <div className="py-32 text-center">
        <h2 className="heading-xl text-gradient">Fahrzeuge vergleichen</h2>
        <p className="mx-auto mt-4 max-w-md text-foreground-secondary">
          Wähle bis zu 4 Fahrzeuge für den direkten Vergleich.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((p) => (
            <button
              key={p.id}
              onClick={() => toggleCompare(p.id)}
              className="rounded-2xl border border-border p-6 text-left transition-colors hover:bg-card"
              data-cursor="pointer"
            >
              <span className="font-medium">{p.name}</span>
              <span className="mt-1 block text-sm text-foreground-secondary">
                {formatPrice(p.price)}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref}>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="heading-xl">{labels.compare}</h2>
        <button
          onClick={clearCompare}
          className="text-sm text-accent hover:underline"
          data-cursor="pointer"
        >
          {labels.clearAll}
        </button>
      </div>

      <div className="overflow-x-auto hide-scrollbar">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr className="sticky top-28 z-10 bg-background">
              <th className="p-4 text-left text-xs uppercase tracking-[0.2em] text-foreground-secondary">
                {labels.specification}
              </th>
              {compareProducts.map((p) => (
                <th key={p.id} className="compare-col p-4 text-left">
                  <Link href={`/product/${p.slug}`} className="group" data-cursor="pointer">
                    <div className="relative mb-3 aspect-[16/10] w-40 overflow-hidden rounded-xl bg-card">
                      <Image src={p.images[0]} alt={p.name} fill className="object-contain p-2" sizes="160px" />
                    </div>
                    <span className="font-medium group-hover:text-accent">{p.name}</span>
                    <span className="mt-1 block text-sm text-foreground-secondary">
                      {formatPrice(p.price)}
                    </span>
                  </Link>
                  <button
                    onClick={() => toggleCompare(p.id)}
                    className="mt-2 text-xs text-foreground-secondary hover:text-foreground"
                    data-cursor="pointer"
                  >
                    {labels.remove}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compareSpecKeys.map(({ key, label, format }) => (
              <tr key={key} className="border-t border-border">
                <td className="p-4 text-sm text-foreground-secondary">{label}</td>
                {compareProducts.map((p) => {
                  const rawValue = p.specs[key as keyof typeof p.specs];
                  const display = format(p);
                  const numericKeys = ["rangeKm", "powerKw", "batteryKwh", "topSpeedKmh", "weightKg", "payloadKg", "seats"];
                  const isBest =
                    numericKeys.includes(key) &&
                    typeof rawValue === "number" &&
                    rawValue === Math.max(
                      ...compareProducts.map((cp) => {
                        const v = cp.specs[key as keyof typeof cp.specs];
                        return typeof v === "number" ? v : 0;
                      })
                    );

                  return (
                    <td
                      key={p.id}
                      className={`compare-col p-4 text-sm font-medium ${
                        isBest ? "text-accent" : ""
                      }`}
                    >
                      {display}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
