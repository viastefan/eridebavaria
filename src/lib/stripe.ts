import Stripe from "stripe";

let stripe: Stripe | null = null;

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripe) {
    stripe = new Stripe(key, { apiVersion: "2026-06-24.dahlia" });
  }
  return stripe;
}

export function isStripeEnabled() {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

export async function createPaymentIntent(amountCents: number, metadata: Record<string, string>) {
  const client = getStripe();
  if (!client) return null;

  return client.paymentIntents.create({
    amount: amountCents,
    currency: "eur",
    automatic_payment_methods: { enabled: true },
    metadata,
  });
}

export async function createCheckoutSession(input: {
  orderId: string;
  orderNumber: string;
  email: string;
  items: { name: string; price: number; quantity: number }[];
  successUrl: string;
  cancelUrl: string;
}) {
  const client = getStripe();
  if (!client) return null;

  return client.checkout.sessions.create({
    mode: "payment",
    customer_email: input.email,
    line_items: input.items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    metadata: {
      orderId: input.orderId,
      orderNumber: input.orderNumber,
    },
  });
}

export async function constructWebhookEvent(payload: string, signature: string) {
  const client = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!client || !secret) return null;
  return client.webhooks.constructEvent(payload, signature, secret);
}
