"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Shield, FileText } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/products";
import type { Accessory } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { labels } from "@/lib/labels";
import { commerceCopy } from "@/lib/commerce-copy";

export function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
    toggleRequestOffer,
    cartTotal,
    addToCart,
  } = useStore();

  const [recommendations, setRecommendations] = useState<Accessory[]>([]);

  useEffect(() => {
    fetch("/api/products?type=accessories")
      .then((r) => r.json())
      .then((d) => setRecommendations((d.accessories ?? []).slice(0, 2)))
      .catch(() => {});
  }, []);

  const hasOfferItems = cart.some((i) => i.requestOffer);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[55] bg-background/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />
          <motion.aside
            className="fixed top-0 right-0 z-[56] flex h-full w-full max-w-md flex-col border-l border-border bg-background"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between border-b border-border p-6">
              <h2 className="text-lg font-medium">{labels.cart}</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="rounded-full p-2 transition-colors hover:bg-card"
                data-cursor="pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="text-foreground-secondary">{labels.emptyCart}</p>
                  <Link
                    href="/shop"
                    className="mt-4 text-sm text-accent hover:underline"
                    onClick={() => setCartOpen(false)}
                  >
                    {labels.exploreCollection}
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item, i) => (
                    <motion.div
                      key={item.id}
                      className="flex gap-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-card">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                          sizes="96px"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="mt-1 text-sm text-foreground-secondary">
                          {formatPrice(item.price)}
                        </p>
                        {item.requestOffer && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-accent">
                            <FileText className="h-3 w-3" />
                            Individuelles Angebot
                          </p>
                        )}
                        <div className="mt-3 flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="rounded-full border border-border p-1 transition-colors hover:bg-card"
                            data-cursor="pointer"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="rounded-full border border-border p-1 transition-colors hover:bg-card"
                            data-cursor="pointer"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto text-xs text-foreground-secondary hover:text-foreground"
                            data-cursor="pointer"
                          >
                            {labels.remove}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleRequestOffer(item.id, !item.requestOffer)}
                          className="mt-2 text-xs text-accent hover:underline"
                        >
                          {item.requestOffer
                            ? "Direktbestellung"
                            : "Individuelles Angebot anfragen"}
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  {recommendations.length > 0 && (
                    <div className="mt-8 border-t border-border pt-8">
                      <span className="text-xs uppercase tracking-[0.2em] text-foreground-secondary">
                        {labels.completeSetup}
                      </span>
                      <div className="mt-4 space-y-3">
                        {recommendations.map((acc) => (
                          <div key={acc.id} className="flex items-center gap-3">
                            <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                              <Image
                                src={acc.image}
                                alt={acc.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                            <div className="flex-1">
                              <span className="text-sm">{acc.name}</span>
                              <span className="block text-xs text-foreground-secondary">
                                {formatPrice(acc.price)}
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                addToCart({
                                  productId: acc.id,
                                  name: acc.name,
                                  price: acc.price,
                                  image: acc.image,
                                })
                              }
                              className="text-xs text-accent hover:underline"
                              data-cursor="pointer"
                            >
                              {labels.add}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-border p-6">
                <p className="mb-4 text-sm leading-relaxed text-foreground-secondary">
                  {commerceCopy.cart.b2bNote}
                </p>
                <div className="mb-4 flex items-center gap-2 text-sm text-foreground-secondary">
                  <Shield className="h-4 w-4" />
                  <span>{labels.warranty2y}</span>
                </div>
                <p className="mb-4 text-xs text-foreground-secondary">
                  {hasOfferItems
                    ? "Positionen mit Angebotsanfrage werden von unserem Team geprüft."
                    : commerceCopy.cart.quoteHint}
                </p>
                <div className="mb-6 flex justify-between">
                  <span className="text-foreground-secondary">{labels.subtotal}</span>
                  <span className="text-xl font-medium">{formatPrice(cartTotal)}</span>
                </div>
                {hasOfferItems ? (
                  <Link href="/#beratung" onClick={() => setCartOpen(false)}>
                    <Button className="w-full">Beratung für Angebot starten</Button>
                  </Link>
                ) : (
                  <Link href="/checkout" onClick={() => setCartOpen(false)}>
                    <Button className="w-full">{labels.checkout}</Button>
                  </Link>
                )}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
