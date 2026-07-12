"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/types";

interface VehicleCompareBarProps {
  products: Product[];
  onOpenCompare: () => void;
}

export function VehicleCompareBar({ products, onOpenCompare }: VehicleCompareBarProps) {
  const { compare, toggleCompare, clearCompare } = useStore();
  const compareProducts = products.filter((p) => compare.includes(p.id));

  return (
    <AnimatePresence>
      {compareProducts.length > 0 && (
        <motion.div
          className="compare-bar"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="compare-bar__inner">
            <div className="compare-bar__items">
              {compareProducts.map((p) => (
                <div key={p.id} className="compare-bar__item">
                  <div className="compare-bar__thumb">
                    <Image src={p.images[0]} alt="" fill className="object-contain p-1" sizes="48px" />
                  </div>
                  <span className="compare-bar__name">{p.name}</span>
                  <button
                    type="button"
                    className="compare-bar__remove"
                    onClick={() => toggleCompare(p.id)}
                    aria-label="Entfernen"
                  >
                    <X className="h-3 w-3" strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
            <div className="compare-bar__actions">
              <button type="button" className="compare-bar__clear" onClick={clearCompare}>
                Leeren
              </button>
              <button
                type="button"
                className="compare-bar__compare"
                onClick={onOpenCompare}
                disabled={compareProducts.length < 2}
              >
                Vergleichen
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
