import { checkoutSchema } from "@/lib/validations";
import { getSession } from "@/lib/auth";
import { createOrder } from "@/lib/orders";
import { clearCart } from "@/lib/cart";
import { prisma } from "@/lib/db";
import {
  createPaymentIntent,
  createCheckoutSession,
  isStripeEnabled,
} from "@/lib/stripe";
import { jsonOk, handleApiError } from "@/lib/api-utils";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const body = await request.json();
    const data = checkoutSchema.parse(body);

    const order = await createOrder({
      ...data,
      userId: session?.id,
      guestCheckout: !session,
    });

    if (session) {
      await clearCart(session.id);
    } else {
      await clearCart();
    }

    const origin = new URL(request.url).origin;
    let clientSecret: string | null = null;
    let checkoutUrl: string | null = null;

    const stripePayments = ["card", "apple_pay", "google_pay", "paypal"];
    if (stripePayments.includes(data.paymentMethod) && isStripeEnabled()) {
      const fullOrder = await prisma.order.findUnique({
        where: { id: order.id },
        include: { items: true },
      });

      if (fullOrder) {
        const stripeSession = await createCheckoutSession({
          orderId: order.id,
          orderNumber: order.orderNumber,
          email: data.email,
          items: fullOrder.items.map((i) => ({
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          successUrl: `${origin}/checkout/success?order=${order.orderNumber}`,
          cancelUrl: `${origin}/checkout?cancelled=1`,
        });

        if (stripeSession?.url) {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              status: "PAYMENT_PENDING",
              stripePaymentIntentId: stripeSession.id,
            },
          });
          checkoutUrl = stripeSession.url;
        }
      }

      if (!checkoutUrl && data.paymentMethod === "card") {
        const intent = await createPaymentIntent(Math.round(order.total * 100), {
          orderId: order.id,
          orderNumber: order.orderNumber,
        });
        if (intent) {
          await prisma.order.update({
            where: { id: order.id },
            data: { stripePaymentIntentId: intent.id, status: "PAYMENT_PENDING" },
          });
          clientSecret = intent.client_secret;
        }
      }
    }

    return jsonOk({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
      },
      clientSecret,
      checkoutUrl,
      stripeEnabled: isStripeEnabled(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
