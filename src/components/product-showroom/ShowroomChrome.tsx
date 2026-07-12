"use client";

import Link from "next/link";
import { ArrowLeft, Heart, MessageCircle, ShoppingBag } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/products";
import { useShowroom } from "./ShowroomProvider";
import { showroomLabels } from "@/lib/showroom-labels";

export function ShowroomChrome() {
  const { product, specs, config, saveCurrentConfig } = useShowroom();
  const store = useStore();

  const configRecord = Object.fromEntries(
    Object.entries(config).filter(([k]) => k !== "accessories").map(([k, v]) => [k, String(v)])
  );

  const addToCart = () => {
    store.addToCart({
      productId: product.id,
      name: product.name,
      price: specs.price,
      image: product.images[0],
      configuration: configRecord,
    });
  };

  return (
    <header className="showroom-chrome fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-6 py-5 md:px-10">
      <Link
        href="/shop"
        className="flex items-center gap-2 text-sm text-foreground-secondary transition-colors duration-500 hover:text-foreground"
        data-cursor="pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">{showroomLabels.back}</span>
      </Link>

      <div className="absolute left-1/2 -translate-x-1/2 text-center">
        <p className="text-[10px] uppercase tracking-[0.35em] text-foreground-secondary">
          {showroomLabels.intro}
        </p>
        <p className="mt-1 text-sm font-medium tracking-tight">{product.name}</p>
      </div>

      <div className="flex items-center gap-2">
        <span className="mr-2 hidden text-sm font-medium md:inline">
          {formatPrice(specs.price)}
        </span>
        <ThemeToggle variant="footer" />
        <button
          type="button"
          onClick={() => store.toggleWishlist(product.id)}
          className={`rounded-full p-2.5 transition-colors duration-500 ${
            store.wishlist.includes(product.id)
              ? "bg-accent text-background"
              : "text-foreground-secondary hover:bg-foreground/5 hover:text-foreground"
          }`}
          data-cursor="pointer"
        >
          <Heart
            className={`h-4 w-4 ${store.wishlist.includes(product.id) ? "fill-current" : ""}`}
          />
        </button>
        <button
          type="button"
          onClick={addToCart}
          className="rounded-full p-2.5 text-foreground-secondary transition-colors duration-500 hover:bg-foreground/5 hover:text-foreground"
          aria-label="In den Warenkorb"
          data-cursor="pointer"
        >
          <ShoppingBag className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => saveCurrentConfig()}
          className="hidden rounded-full border border-border px-4 py-2 text-xs uppercase tracking-[0.15em] text-foreground-secondary transition-colors hover:text-foreground sm:inline-block"
          data-cursor="pointer"
        >
          Speichern
        </button>
        <Link
          href="#beratung"
          className="flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-background transition-all duration-500 hover:shadow-[0_0_30px_var(--button-glow)]"
          data-cursor="pointer"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Beratung</span>
        </Link>
      </div>
    </header>
  );
}
