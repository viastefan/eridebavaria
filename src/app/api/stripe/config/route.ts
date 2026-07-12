import { isStripeEnabled } from "@/lib/stripe";
import { jsonOk } from "@/lib/api-utils";

export async function GET() {
  return jsonOk({
    enabled: isStripeEnabled(),
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? null,
  });
}
