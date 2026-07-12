"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GitCompare, Heart } from "lucide-react";
import { formatPrice } from "@/lib/products";
import type { Product } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Vehicle360Preview } from "./Vehicle360Preview";

interface VehicleGalleryCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  layoutId?: string;
}

export function VehicleGalleryCard({
  product,
  onQuickView,
  layoutId,
}: VehicleGalleryCardProps) {
  const { compare, toggleCompare, wishlist, toggleWishlist } = useStore();
  const isComparing = compare.includes(product.id);
  const isWished = wishlist.includes(product.id);

  return (
    <motion.article
      layout
      layoutId={layoutId}
      className="vehicle-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="vehicle-card__surface">
        <div className="vehicle-card__tools">
          <button
            type="button"
            className={`vehicle-card__tool ${isWished ? "vehicle-card__tool--active" : ""}`}
            onClick={() => toggleWishlist(product.id)}
            aria-label="Merken"
          >
            <Heart className="h-4 w-4" strokeWidth={1.25} fill={isWished ? "currentColor" : "none"} />
          </button>
          <button
            type="button"
            className={`vehicle-card__tool ${isComparing ? "vehicle-card__tool--compare" : ""}`}
            onClick={() => toggleCompare(product.id)}
            aria-label="Vergleichen"
          >
            <GitCompare className="h-4 w-4" strokeWidth={1.25} />
          </button>
        </div>

        <button
          type="button"
          className="vehicle-card__media-btn"
          onClick={() => onQuickView(product)}
          aria-label={`${product.name} ansehen`}
        >
          <Vehicle360Preview
            images={product.images}
            alt={product.name}
            className="vehicle-card__preview"
          />
        </button>

        <div className="vehicle-card__hover-panel">
          <button type="button" className="vehicle-card__hover-btn" onClick={() => onQuickView(product)}>
            Fahrzeug ansehen
          </button>
          <Link href={`/product/${product.slug}?configure=1`} className="vehicle-card__hover-btn vehicle-card__hover-btn--solid">
            Konfigurieren
          </Link>
        </div>
      </div>

      <button type="button" className="vehicle-card__info" onClick={() => onQuickView(product)}>
        <h3 className="vehicle-card__name">{product.name}</h3>
        <p className="vehicle-card__price">{formatPrice(product.price)}</p>
      </button>
    </motion.article>
  );
}
