"use client";

import type { Product } from "@/lib/types";
import { ProductShowroom } from "@/components/product-showroom/ProductShowroom";

export function ProductPageClient({ product }: { product: Product }) {
  return <ProductShowroom product={product} />;
}
