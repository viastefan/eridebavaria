"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Lock, CreditCard } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/products";
import { Button } from "@/components/ui/Button";
import { StripePayment } from "@/components/commerce/StripePayment";
import { labels, checkoutSteps } from "@/lib/labels";
import { commerceCopy } from "@/lib/commerce-copy";

const paymentMethods = [
  { id: "card", label: "Kreditkarte" },
  { id: "paypal", label: "PayPal" },
  { id: "apple_pay", label: "Apple Pay" },
  { id: "google_pay", label: "Google Pay" },
  { id: "invoice", label: "Rechnung (B2B)" },
  { id: "bank_transfer", label: "Banküberweisung" },
] as const;

export default function CheckoutPage() {
  const { cart, cartTotal, removeFromCart } = useStore();
  const [step, setStep] = useState(0);
  const [payment, setPayment] = useState<string>("card");
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripeKey, setStripeKey] = useState<string | null>(null);
  const [awaitingPayment, setAwaitingPayment] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
    country: "DE",
    notes: "",
  });

  useEffect(() => {
    fetch("/api/stripe/config")
      .then((r) => r.json())
      .then((d) => {
        if (d.publishableKey) setStripeKey(d.publishableKey);
      })
      .catch(() => {});

    fetch("/api/auth/session")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.user) {
          setIsLoggedIn(true);
          setForm((prev) => ({
            ...prev,
            email: d.user.email ?? prev.email,
            firstName: d.user.firstName ?? prev.firstName,
            lastName: d.user.lastName ?? prev.lastName,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const submitOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone || undefined,
          shippingAddress: {
            street: form.street,
            city: form.city,
            postalCode: form.postalCode,
            country: form.country,
          },
          paymentMethod: payment,
          guestCheckout: !isLoggedIn,
          notes: form.notes || undefined,
          items: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            configuration: item.configuration,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Bestellung fehlgeschlagen");

      setOrderNumber(data.order.orderNumber);
      setOrderTotal(data.order.total);

      if (data.checkoutUrl) {
        cart.forEach((item) => removeFromCart(item.id));
        window.location.href = data.checkoutUrl;
        return;
      }

      if (data.clientSecret && stripeKey && payment === "card") {
        setClientSecret(data.clientSecret);
        setAwaitingPayment(true);
        return;
      }

      cart.forEach((item) => removeFromCart(item.id));
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !submitted && !awaitingPayment) {
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
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
            <span className="text-2xl">✓</span>
          </div>
          <h1 className="heading-xl text-gradient">{labels.welcomeFuture}</h1>
          <p className="mx-auto mt-4 max-w-md text-foreground-secondary">
            {labels.orderConfirmed}
            {orderNumber && (
              <span className="mt-2 block font-mono text-sm text-accent">{orderNumber}</span>
            )}
          </p>
          <Link href="/garage" className="mt-8 inline-block text-accent hover:underline">
            Meine Garage →
          </Link>
        </motion.div>
      </main>
    );
  }

  if (awaitingPayment && clientSecret && stripeKey) {
    return (
      <main className="min-h-screen pt-28 pb-24">
        <div className="section-padding mx-auto max-w-lg">
          <h1 className="heading-lg mb-2">Zahlung abschließen</h1>
          <p className="mb-8 text-sm text-foreground-secondary">
            Bestellung {orderNumber} · {formatPrice(orderTotal)}
          </p>
          <StripePayment
            clientSecret={clientSecret}
            publishableKey={stripeKey}
            orderNumber={orderNumber}
            onSuccess={() => {
              cart.forEach((item) => removeFromCart(item.id));
              setSubmitted(true);
            }}
            onError={setError}
          />
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-24">
      <div className="section-padding mx-auto max-w-6xl">
        <p className="mx-auto mb-8 max-w-2xl text-center text-sm leading-relaxed text-foreground-secondary">
          {commerceCopy.checkout.b2bIntro}
        </p>
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
              >
                {s}
              </button>
              {i < checkoutSteps.length - 1 && <div className="h-px w-8 bg-border" />}
            </div>
          ))}
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          <motion.div key={step} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {step === 0 && (
              <>
                <h2 className="text-xl font-medium">{labels.contactInfo}</h2>
                {(["firstName", "lastName", "email", "phone"] as const).map((field) => (
                  <input
                    key={field}
                    placeholder={labels[field === "firstName" ? "firstName" : field === "lastName" ? "lastName" : field === "email" ? "email" : "phone"]}
                    type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                    value={form[field]}
                    onChange={(e) => update(field, e.target.value)}
                    className="w-full rounded-xl border border-border bg-card px-5 py-4 outline-none focus:border-accent/50"
                  />
                ))}
              </>
            )}
            {step === 1 && (
              <>
                <h2 className="text-xl font-medium">{labels.shippingAddress}</h2>
                <input placeholder={labels.address} value={form.street} onChange={(e) => update("street", e.target.value)} className="w-full rounded-xl border border-border bg-card px-5 py-4 outline-none focus:border-accent/50" />
                <input placeholder={labels.city} value={form.city} onChange={(e) => update("city", e.target.value)} className="w-full rounded-xl border border-border bg-card px-5 py-4 outline-none focus:border-accent/50" />
                <input placeholder={labels.postalCode} value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} className="w-full rounded-xl border border-border bg-card px-5 py-4 outline-none focus:border-accent/50" />
                <input placeholder={labels.country} value={form.country} onChange={(e) => update("country", e.target.value)} className="w-full rounded-xl border border-border bg-card px-5 py-4 outline-none focus:border-accent/50" />
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
                        payment === method.id ? "border-accent bg-accent/10" : "border-border"
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
                {(payment === "invoice" || payment === "bank_transfer") && (
                  <p className="text-sm text-foreground-secondary">
                    Sie erhalten die Zahlungsinformationen per E-Mail nach Bestellbestätigung.
                  </p>
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
                <Button variant="secondary" onClick={() => setStep(step - 1)}>{labels.back}</Button>
              )}
              {step < checkoutSteps.length - 1 ? (
                <Button onClick={() => setStep(step + 1)}>{labels.continue}</Button>
              ) : (
                <Button onClick={submitOrder} disabled={loading}>
                  {loading ? "Wird verarbeitet …" : `${labels.completePurchase} — ${formatPrice(cartTotal)}`}
                </Button>
              )}
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </motion.div>

          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-xl">
              <h3 className="mb-6 font-medium">{labels.orderSummary}</h3>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-card">
                      <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="64px" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="block text-xs text-foreground-secondary">{labels.quantity} {item.quantity}</span>
                    </div>
                    <span className="text-sm">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-border pt-6 flex justify-between text-lg font-medium">
                <span>{labels.total}</span>
                <span>{formatPrice(cartTotal)}</span>
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
