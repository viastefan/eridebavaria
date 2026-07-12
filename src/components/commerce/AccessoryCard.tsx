"use client";

import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/products";
import type { Accessory } from "@/lib/types";
import { useStore } from "@/lib/store";
import { labels } from "@/lib/labels";

interface AccessoryCardProps {
  accessory: Accessory;
}

export function AccessoryCard({ accessory }: AccessoryCardProps) {
  const { addToCart } = useStore();

  return (
    <article className="accessory-card group">
      <div className="accessory-card__media">
        <Image
          src={accessory.image}
          alt={accessory.name}
          fill
          className="accessory-card__image object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <span className="accessory-card__badge">Sofort verfügbar</span>
      </div>
      <div className="accessory-card__body">
        <h3 className="accessory-card__title">{accessory.name}</h3>
        <p className="accessory-card__desc">{accessory.description}</p>
        <div className="accessory-card__footer">
          <div>
            <p className="accessory-card__price">{formatPrice(accessory.price)}</p>
            <p className="accessory-card__price-note">inkl. MwSt.</p>
          </div>
          <button
            type="button"
            className="accessory-card__btn"
            onClick={() =>
              addToCart({
                productId: accessory.id,
                name: accessory.name,
                price: accessory.price,
                image: accessory.image,
              })
            }
          >
            <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.5} />
            {labels.addToCart}
          </button>
        </div>
      </div>
    </article>
  );
}
