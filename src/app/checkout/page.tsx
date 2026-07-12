"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Lock, CreditCard } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/products";
import { Button } from "@/components/ui/Button";
import { labels, paymentMethodLabels, checkoutSteps } from "@/lib/labels";

const paymentMethods = Object.entries(paymentMethodLabels).map(([id, label]) => ({
  id,
  label,
}));

export default function CheckoutPage() {
  const { cart, cartTotal } = useStore();
  const [step, setStep] = useState(0);
  const [payment, setPayment] = useState("card");
  const [submitted, setSubmitted] = useState(false);

  if (cart.length === 0 && !submitted) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center section-padding">
        <h1 className="heading-lg">{labels.emptyCart}</h1>
        <Link href="/shop" className="mt-6 text-accent hover:underline">
          {labels.exploreCollection}
        </Link>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center section-padding text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
            <span className="text-2xl">✓</span>
          </div>
          <h1 className="heading-xl text-gradient">{labels.welcomeFuture}</h1>
          <p className="mx-auto mt-4 max-w-md text-foreground-secondary">
            {labels.orderConfirmed}
          </p>
          <Link href="/account" className="mt-8 inline-block text-accent hover:underline">
            {labels.viewAccount} →
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-24">
      <div className="section-padding mx-auto max-w-6xl">
        <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
          {checkoutSteps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <button
                onClick={() => setStep(i)}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  i === step
                    ? "bg-foreground text-background"
                    : i < step
                      ? "text-accent"
                      : "text-foreground-secondary"
                }`}
                data-cursor="pointer"
              >
                {s}
              </button>
              {i < checkoutSteps.length - 1 && (
                <div className="h-px w-8 bg-border" />
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {step === 0 && (
              <>
                <h2 className="text-xl font-medium">{labels.contactInfo}</h2>
                {[labels.firstName, labels.lastName, labels.email, labels.phone].map((field) => (
                  <input
                    key={field}
                    placeholder={field}
                    className="w-full rounded-xl border border-border bg-card px-5 py-4 outline-none transition-colors focus:border-accent/50"
                  />
                ))}
              </>
            )}
            {step === 1 && (
              <>
                <h2 className="text-xl font-medium">{labels.shippingAddress}</h2>
                {[labels.address, labels.city, labels.postalCode, labels.country].map((field) => (
                  <input
                    key={field}
                    placeholder={field}
                    className="w-full rounded-xl border border-border bg-card px-5 py-4 outline-none focus:border-accent/50"
                  />
                ))}
              </>
            )}
            {step === 2 && (
              <>
                <h2 className="text-xl font-medium">{labels.paymentMethod}</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPayment(method.id)}
                      className={`rounded-xl border p-4 text-left text-sm transition-all ${
                        payment === method.id
                          ? "border-accent bg-accent/10"
                          : "border-border hover:border-foreground/20"
                      }`}
                      data-cursor="pointer"
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
                {payment === "card" && (
                  <div className="mt-4 space-y-4">
                    <input
                      placeholder={labels.cardNumber}
                      className="w-full rounded-xl border border-border bg-card px-5 py-4 outline-none focus:border-accent/50"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        placeholder="MM/JJ"
                        className="rounded-xl border border-border bg-card px-5 py-4 outline-none focus:border-accent/50"
                      />
                      <input
                        placeholder="CVC"
                        className="rounded-xl border border-border bg-card px-5 py-4 outline-none focus:border-accent/50"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
            {step === 3 && (
              <>
                <h2 className="text-xl font-medium">{labels.reviewOrder}</h2>
                <p className="text-foreground-secondary">{labels.reviewHint}</p>
                <div className="flex items-center gap-3 rounded-xl border border-border p-4">
                  <Lock className="h-5 w-5 text-accent" />
                  <span className="text-sm">{labels.securePayment}</span>
                </div>
              </>
            )}

            <div className="flex gap-4 pt-4">
              {step > 0 && (
                <Button variant="secondary" onClick={() => setStep(step - 1)}>
                  {labels.back}
                </Button>
              )}
              {step < checkoutSteps.length - 1 ? (
                <Button onClick={() => setStep(step + 1)}>{labels.continue}</Button>
              ) : (
                <Button onClick={() => setSubmitted(true)}>
                  {labels.completePurchase} — {formatPrice(cartTotal)}
                </Button>
              )}
            </div>
          </motion.div>

          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-xl">
              <h3 className="mb-6 font-medium">{labels.orderSummary}</h3>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-card">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="block text-xs text-foreground-secondary">
                        {labels.quantity} {item.quantity}
                      </span>
                    </div>
                    <span className="text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-border pt-6">
                <div className="flex justify-between text-lg font-medium">
                  <span>{labels.total}</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-4 text-xs text-foreground-secondary">
                <Shield className="h-4 w-4" />
                <span>{labels.warranty2y}</span>
                <CreditCard className="h-4 w-4" />
                <span>Sichere Kasse</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
