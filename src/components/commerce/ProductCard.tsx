"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, GitCompare, Eye } from "lucide-react";
import { formatPrice } from "@/lib/products";
import type { Product } from "@/lib/types";
import { useStore } from "@/lib/store";

import { badgeLabels, availabilityLabels } from "@/lib/labels";

const badgeStyles = {
  new: "bg-accent/20 text-accent",
  popular: "bg-accent-secondary/20 text-accent-secondary",
  limited: "bg-orange-500/20 text-orange-400",
  premium: "bg-white/10 text-foreground",
};

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { wishlist, compare, toggleWishlist, toggleCompare } = useStore();
  const isWishlisted = wishlist.includes(product.id);
  const isComparing = compare.includes(product.id);

  return (
    <motion.article
      className="group relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/product/${product.slug}`} data-cursor="pointer">
        <div className="card-reflection relative aspect-[4/5] overflow-hidden rounded-2xl bg-card">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />

          {product.badge && (
            <span
              className={`absolute top-4 left-4 rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wider ${badgeStyles[product.badge]}`}
            >
              {badgeLabels[product.badge]}
            </span>
          )}

          {/* Hover actions */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(product.id);
              }}
              className={`rounded-full p-2.5 backdrop-blur-xl transition-colors ${
                isWishlisted ? "bg-accent text-background" : "bg-background/60 hover:bg-background/80"
              }`}
              data-cursor="pointer"
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleCompare(product.id);
              }}
              className={`rounded-full p-2.5 backdrop-blur-xl transition-colors ${
                isComparing ? "bg-accent text-background" : "bg-background/60 hover:bg-background/80"
              }`}
              data-cursor="pointer"
            >
              <GitCompare className="h-4 w-4" />
            </button>
            <Link
              href={`/product/${product.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="rounded-full bg-background/60 p-2.5 backdrop-blur-xl transition-colors hover:bg-background/80"
              data-cursor="pointer"
            >
              <Eye className="h-4 w-4" />
            </Link>
          </div>

          <div className="absolute right-0 bottom-0 left-0 p-6 transition-transform duration-500 group-hover:-translate-y-1">
            <span className="text-xs uppercase tracking-[0.15em] text-foreground-secondary">
              {product.category}
            </span>
            <h3 className="mt-1 text-xl font-medium md:text-2xl">{product.name}</h3>
            <p className="mt-1 text-sm text-foreground-secondary">{product.tagline}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-medium">{formatPrice(product.price)}</span>
              <div className="flex gap-4 text-xs text-foreground-secondary">
                <span>{product.specs.range}</span>
                <span>{product.specs.power}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
