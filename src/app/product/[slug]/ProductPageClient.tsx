"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, GitCompare, Shield, Truck } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, getAccessoryById } from "@/lib/products";
import { useStore } from "@/lib/store";
import { ProductGallery } from "@/components/commerce/ProductGallery";
import { Configurator } from "@/components/commerce/Configurator";
import { SpecGrid } from "@/components/commerce/SpecGrid";
import { ProductStory } from "@/components/commerce/ProductStory";
import { Button } from "@/components/ui/Button";
import { badgeLabels, availabilityLabels, labels } from "@/lib/labels";

export function ProductPageClient({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, toggleCompare, wishlist, compare } =
    useStore();
  const [configuredPrice, setConfiguredPrice] = useState(product.price);
  const [configuration, setConfiguration] = useState<Record<string, string>>({});

  const handlePriceChange = useCallback(
    (total: number, config: Record<string, string>) => {
      setConfiguredPrice(total);
      setConfiguration(config);
    },
    []
  );

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: configuredPrice,
      image: product.images[0],
      configuration,
    });
  };

  const relatedAccessories = product.relatedAccessoryIds
    .map(getAccessoryById)
    .filter(Boolean);

  return (
    <main className="min-h-screen">
      {/* Breadcrumb */}
      <nav className="section-padding pt-28 pb-4">
        <ol className="flex items-center gap-2 text-xs text-foreground-secondary">
          <li>
            <Link href="/" className="hover:text-foreground">
              {labels.home}
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/shop" className="hover:text-foreground">
              {labels.collection}
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground">{product.name}</li>
        </ol>
      </nav>

      {/* Hero buy section */}
      <section className="section-padding pb-24">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <ProductGallery product={product} />

          <div className="lg:sticky lg:top-32 lg:self-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {product.badge && (
                <span className="mb-4 inline-block rounded-full bg-accent/20 px-3 py-1 text-xs uppercase tracking-wider text-accent">
                  {badgeLabels[product.badge]}
                </span>
              )}
              <h1 className="heading-xl">{product.name}</h1>
              <p className="mt-2 text-lg text-foreground-secondary">
                {product.tagline}
              </p>
              <p className="mt-6 text-3xl font-medium">
                {formatPrice(configuredPrice)}
              </p>
              <p className="mt-2 text-sm text-foreground-secondary">
                {availabilityLabels[product.availability]}
              </p>

              <div className="mt-8">
                <Configurator product={product} onPriceChange={handlePriceChange} />
              </div>

              <div className="mt-8 flex gap-3">
                <Button onClick={handleAddToCart} className="flex-1">
                  {labels.addToCart}
                </Button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`rounded-full border border-border p-3.5 transition-colors ${
                    wishlist.includes(product.id) ? "bg-accent text-background" : "hover:bg-card"
                  }`}
                  data-cursor="pointer"
                >
                  <Heart
                    className={`h-5 w-5 ${wishlist.includes(product.id) ? "fill-current" : ""}`}
                  />
                </button>
                <button
                  onClick={() => toggleCompare(product.id)}
                  className={`rounded-full border border-border p-3.5 transition-colors ${
                    compare.includes(product.id) ? "bg-accent text-background" : "hover:bg-card"
                  }`}
                  data-cursor="pointer"
                >
                  <GitCompare className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-8 space-y-3 border-t border-border pt-8">
                <div className="flex items-center gap-3 text-sm text-foreground-secondary">
                  <Shield className="h-4 w-4" />
                  <span>{labels.warranty2yFull}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground-secondary">
                  <Truck className="h-4 w-4" />
                  <span>{labels.freeShipping}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding py-24 md:py-32">
        <div className="mb-16 text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-accent">
            {labels.story}
          </span>
          <h2 className="heading-xl mt-4 text-gradient">{labels.designedToMove}</h2>
        </div>
        <ProductStory product={product} />
      </section>

      {/* Specs */}
      <section className="section-padding py-24 md:py-32">
        <div className="mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-accent">
            {labels.specifications}
          </span>
          <h2 className="heading-xl mt-4">{labels.everyDetail}</h2>
        </div>
        <SpecGrid product={product} />
      </section>

      {/* Accessories */}
      {relatedAccessories.length > 0 && (
        <section className="section-padding py-24 md:py-32">
          <div className="mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-accent">
              {labels.accessories}
            </span>
            <h2 className="heading-lg mt-4">{labels.completeSetup}</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {relatedAccessories.map((acc) =>
              acc ? (
                <div key={acc.id} className="group">
                  <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-card">
                    <Image
                      src={acc.image}
                      alt={acc.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="25vw"
                    />
                  </div>
                  <h3 className="font-medium">{acc.name}</h3>
                  <p className="mt-1 text-sm text-foreground-secondary">
                    {formatPrice(acc.price)}
                  </p>
                </div>
              ) : null
            )}
          </div>
        </section>
      )}

      {/* Support link */}
      <section className="section-padding pb-24">
        <Link
          href={`/support/${product.slug}`}
          className="flex items-center justify-between rounded-2xl border border-border p-8 transition-colors hover:bg-card"
          data-cursor="pointer"
        >
          <div>
            <h3 className="text-lg font-medium">{labels.vehicleSupport}</h3>
            <p className="mt-1 text-sm text-foreground-secondary">
              {labels.supportDesc}
            </p>
          </div>
          <span className="text-accent">→</span>
        </Link>
      </section>
    </main>
  );
}
