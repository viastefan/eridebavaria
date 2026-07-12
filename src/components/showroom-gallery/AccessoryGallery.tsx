"use client";

import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/products";
import type { Accessory } from "@/lib/types";
import { useStore } from "@/lib/store";
import { labels } from "@/lib/labels";

interface AccessoryGalleryProps {
  accessories: Accessory[];
}

export function AccessoryGallery({ accessories }: AccessoryGalleryProps) {
  const { addToCart, wishlist, toggleWishlist } = useStore();

  return (
    <div className="accessory-gallery">
      <h2 className="accessory-gallery__heading">
        {accessories.length} {accessories.length === 1 ? "Produkt" : "Produkte"}
      </h2>
      <div className="accessory-gallery__grid">
        {accessories.map((item, i) => {
          const wished = wishlist.includes(item.id);
          return (
            <motion.article
              key={item.id}
              className="accessory-gallery__card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="accessory-gallery__media">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="accessory-gallery__image"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <button
                  type="button"
                  className={`accessory-gallery__wish ${wished ? "accessory-gallery__wish--active" : ""}`}
                  onClick={() => toggleWishlist(item.id)}
                  aria-label="Merken"
                >
                  <Heart className="h-4 w-4" strokeWidth={1.25} fill={wished ? "currentColor" : "none"} />
                </button>
              </div>
              <div className="accessory-gallery__body">
                <h3 className="accessory-gallery__name">{item.name}</h3>
                <p className="accessory-gallery__price">{formatPrice(item.price)}</p>
                <button
                  type="button"
                  className="accessory-gallery__cart"
                  onClick={() =>
                    addToCart({
                      productId: item.id,
                      name: item.name,
                      price: item.price,
                      image: item.image,
                    })
                  }
                >
                  <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {labels.addToCart}
                </button>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
