"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { VehicleGalleryCard } from "./VehicleGalleryCard";

interface VehicleGalleryProps {
  products: Product[];
  onQuickView: (product: Product) => void;
}

export function VehicleGallery({ products, onQuickView }: VehicleGalleryProps) {
  return (
    <LayoutGroup>
      <AnimatePresence mode="popLayout">
        {products.length === 0 ? (
          <motion.div
            key="empty"
            className="vehicle-gallery__empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p>Keine Fahrzeuge entsprechen Ihrer Auswahl.</p>
            <p className="vehicle-gallery__empty-hint">
              Passen Sie die Filter an oder wählen Sie eine andere Kategorie.
            </p>
          </motion.div>
        ) : (
          <div className="vehicle-gallery__grid">
            {products.map((product) => (
              <VehicleGalleryCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
                layoutId={`vehicle-card-${product.id}`}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
