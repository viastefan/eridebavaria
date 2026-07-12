"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShoppingBag, Zap } from "lucide-react";
import { formatFinancingHint, formatPrice } from "@/lib/products";
import type { Product } from "@/lib/types";
import { availabilityLabels, labels } from "@/lib/labels";
import { useStore } from "@/lib/store";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useStore();

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
    });
  };

  return (
    <article className="product-card group">
      <div className="product-card__media">
        <Link href={`/product/${product.slug}`} className="product-card__media-link">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="product-card__image"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </Link>
        <span
          className={`product-card__badge product-card__badge--${product.availability}`}
        >
          {availabilityLabels[product.availability]}
        </span>
        <div className="product-card__quick-add">
          <button type="button" className="product-card__quick-add-btn" onClick={handleAddToCart}>
            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
            Schnell hinzufügen
          </button>
        </div>
      </div>

      <Link href={`/product/${product.slug}`} className="product-card__body-link">
        <div className="product-card__body">
          <p className="product-card__meta">
            {product.brand}
            <span aria-hidden>·</span>
            {product.category}
          </p>
          <h3 className="product-card__title">{product.name}</h3>
          <p className="product-card__tagline">{product.tagline}</p>
          <div className="product-card__specs">
            <span>
              <Zap className="h-3 w-3" strokeWidth={1.5} aria-hidden />
              {product.specs.range}
            </span>
            <span>{product.specs.power}</span>
          </div>
          <div className="product-card__pricing">
            <p className="product-card__price">
              {formatPrice(product.price)}
              <span className="product-card__price-note">inkl. MwSt.</span>
            </p>
            <p className="product-card__finance">
              {formatFinancingHint(product.price)} · Finanzierung möglich
            </p>
          </div>
        </div>
      </Link>

      <div className="product-card__actions">
        <button
          type="button"
          className="product-card__btn product-card__btn--primary"
          onClick={handleAddToCart}
        >
          <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.5} />
          {labels.addToCart}
        </button>
        <Link
          href={`/product/${product.slug}`}
          className="product-card__btn product-card__btn--secondary"
        >
          Showroom
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </Link>
      </div>
    </article>
  );
}
