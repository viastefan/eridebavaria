"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { X } from "lucide-react";
import { formatPrice } from "@/lib/products";
import { compareMetrics, getProductUsageTags, usageTags } from "@/lib/showroom-filters";
import type { Product } from "@/lib/types";
import { useStore } from "@/lib/store";

interface VehicleComparePanelProps {
  products: Product[];
  open: boolean;
  onClose: () => void;
}

export function VehicleComparePanel({ products, open, onClose }: VehicleComparePanelProps) {
  const { compare, toggleCompare } = useStore();
  const ref = useRef<HTMLDivElement>(null);
  const compareProducts = products.filter((p) => compare.includes(p.id));

  useEffect(() => {
    if (!open || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".compare-metric", {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: "power3.out",
      });
    }, ref);
    return () => ctx.revert();
  }, [open, compareProducts.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && compareProducts.length >= 2 && (
        <motion.div
          className="compare-panel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button type="button" className="compare-panel__backdrop" onClick={onClose} aria-label="Schließen" />
          <motion.div
            ref={ref}
            className="compare-panel__sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="compare-panel__head">
              <div>
                <p className="compare-panel__eyebrow">Vergleich</p>
                <h2 className="compare-panel__title">Mobilitätslösungen im Direktvergleich</h2>
              </div>
              <button type="button" onClick={onClose} aria-label="Schließen">
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <div
              className="compare-panel__vehicles"
              style={{ gridTemplateColumns: `repeat(${compareProducts.length}, minmax(0, 1fr))` }}
            >
              {compareProducts.map((p) => (
                <div key={p.id} className="compare-panel__vehicle">
                  <div className="compare-panel__vehicle-image">
                    <Image src={p.images[0]} alt={p.name} fill className="object-contain p-4" sizes="200px" />
                  </div>
                  <h3>{p.name}</h3>
                  <p className="compare-panel__vehicle-price">{formatPrice(p.price)}</p>
                  <div className="compare-panel__use-cases">
                    {getProductUsageTags(p).map((tag) => {
                      const label = usageTags.find((t) => t.id === tag)?.label ?? tag;
                      return <span key={tag}>{label}</span>;
                    })}
                  </div>
                  <Link href={`/product/${p.slug}`} className="compare-panel__link">
                    Showroom
                  </Link>
                  <button
                    type="button"
                    className="compare-panel__remove"
                    onClick={() => toggleCompare(p.id)}
                  >
                    Entfernen
                  </button>
                </div>
              ))}
            </div>

            <div className="compare-panel__metrics">
              {compareMetrics.map((metric) => {
                const values = compareProducts.map((p) => metric.format(p));
                const max = Math.max(...values);
                return (
                  <div key={metric.key} className="compare-metric">
                    <p className="compare-metric__label">{metric.label}</p>
                    <div
                      className="compare-metric__bars"
                      style={{ gridTemplateColumns: `repeat(${compareProducts.length}, minmax(0, 1fr))` }}
                    >
                      {compareProducts.map((p) => {
                        const value = metric.format(p);
                        const pct = max > 0 ? (value / max) * 100 : 0;
                        const isBest = value === max && max > 0;
                        return (
                          <div key={p.id} className="compare-metric__col">
                            <div className="compare-metric__bar-track">
                              <motion.div
                                className={`compare-metric__bar ${isBest ? "compare-metric__bar--best" : ""}`}
                                initial={{ height: 0 }}
                                animate={{ height: `${pct}%` }}
                                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                              />
                            </div>
                            <span className={`compare-metric__value ${isBest ? "compare-metric__value--best" : ""}`}>
                              {metric.display(p)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
