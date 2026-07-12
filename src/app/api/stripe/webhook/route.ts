import { fulfillPaidOrder } from "@/lib/orders";
import { constructWebhookEvent } from "@/lib/stripe";

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  const event = await constructWebhookEvent(payload, signature);
  if (!event) {
    return new Response("Webhook not configured", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await fulfillPaidOrder(orderId);
    }
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    const orderId = intent.metadata?.orderId;
    if (orderId) {
      await fulfillPaidOrder(orderId);
    }
  }

  return new Response("ok", { status: 200 });
}
