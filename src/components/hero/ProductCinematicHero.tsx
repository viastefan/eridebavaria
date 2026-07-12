"use client";

import type { Product } from "@/lib/types";
import { CinematicScrollHero } from "@/components/hero/CinematicScrollHero";
import { buildProductCinematicFrames } from "@/lib/cinematic-frames";

interface ProductCinematicHeroProps {
  product: Product;
}

export function ProductCinematicHero({ product }: ProductCinematicHeroProps) {
  const frames = buildProductCinematicFrames(product);

  return (
    <CinematicScrollHero
      id="product-hero"
      markHeroActive={false}
      config={{
        frames,
        posterSrc: product.images[0],
        imageSequence: product.images,
        scrollVh: 550,
      }}
    />
  );
}
