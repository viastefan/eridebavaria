"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Settings2, X, Zap } from "lucide-react";
import { formatFinancingHint, formatPrice } from "@/lib/products";
import type { Product } from "@/lib/types";
import { ShowroomProvider } from "@/components/product-showroom/ShowroomProvider";
import { Vehicle360Preview } from "./Vehicle360Preview";

const ShowroomCanvas = dynamic(
  () =>
    import("@/components/product-showroom/viewer/ShowroomCanvas").then(
      (m) => m.ShowroomCanvas
    ),
  {
    ssr: false,
    loading: () => (
      <div className="quick-view__canvas-loading">
        <div className="quick-view__canvas-spinner" />
      </div>
    ),
  }
);

interface VehicleQuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export function VehicleQuickView({ product, onClose }: VehicleQuickViewProps) {
  useEffect(() => {
    if (!product) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [product, onClose]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="quick-view"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <motion.button
            type="button"
            className="quick-view__backdrop"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Schließen"
          />

          <motion.div
            className="quick-view__panel"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              className="quick-view__close"
              onClick={onClose}
              aria-label="Schließen"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>

            <div className="quick-view__layout">
              <div className="quick-view__viewer">
                <Vehicle360Preview
                  images={product.images}
                  alt={product.name}
                  className="quick-view__fallback"
                />
                <ShowroomProvider product={product}>
                  <div className="quick-view__canvas">
                    <ShowroomCanvas />
                  </div>
                </ShowroomProvider>
              </div>

              <div className="quick-view__content">
                <p className="quick-view__eyebrow">{product.brand}</p>
                <h2 className="quick-view__title">{product.name}</h2>
                <p className="quick-view__tagline">{product.tagline}</p>
                <p className="quick-view__description">{product.description}</p>

                <div className="quick-view__specs">
                  <div className="quick-view__spec">
                    <Zap className="h-4 w-4 text-accent" strokeWidth={1.5} />
                    <span>{product.specs.range}</span>
                  </div>
                  <div className="quick-view__spec">{product.specs.power}</div>
                  <div className="quick-view__spec">{product.specs.topSpeed}</div>
                  <div className="quick-view__spec">{product.specs.seats} Sitze</div>
                </div>

                <div className="quick-view__pricing">
                  <p className="quick-view__price">{formatPrice(product.price)}</p>
                  <p className="quick-view__finance">{formatFinancingHint(product.price)}</p>
                </div>

                <div className="quick-view__actions">
                  <Link
                    href={`/product/${product.slug}`}
                    className="quick-view__btn quick-view__btn--primary"
                  >
                    Showroom öffnen
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                  </Link>
                  <Link
                    href={`/product/${product.slug}?configure=1`}
                    className="quick-view__btn quick-view__btn--secondary"
                  >
                    <Settings2 className="h-4 w-4" strokeWidth={1.5} />
                    Fahrzeug anpassen
                  </Link>
                  <Link
                    href={`/product/${product.slug}#beratung`}
                    className="quick-view__btn quick-view__btn--ghost"
                  >
                    Individuelle Beratung
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
