import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getOrCreateCart, serializeCart } from "@/lib/cart";
import { prisma } from "@/lib/db";
import { jsonOk, handleApiError } from "@/lib/api-utils";

export async function GET() {
  try {
    const session = await getSession();
    const cart = await getOrCreateCart(session?.id);
    return jsonOk(serializeCart(cart));
  } catch (error) {
    return handleApiError(error);
  }
}

const addSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1).max(99).default(1),
  configuration: z.record(z.string(), z.string()).optional(),
  requestOffer: z.boolean().default(false),
});

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const body = await request.json();
    const data = addSchema.parse(body);

    const product = await prisma.product.findUnique({ where: { id: data.productId } });
    if (!product) return handleApiError(new Error("Produkt nicht gefunden"));

    const cart = await getOrCreateCart(session?.id);
    const configStr = data.configuration ? JSON.stringify(data.configuration) : null;

    const existing = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: data.productId,
        configuration: configStr,
      },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + data.quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: data.productId,
          quantity: data.quantity,
          configuration: configStr,
          requestOffer: data.requestOffer,
        },
      });
    }

    const updated = await getOrCreateCart(session?.id);
    return jsonOk(serializeCart(updated));
  } catch (error) {
    return handleApiError(error);
  }
}

const patchSchema = z.object({
  itemId: z.string(),
  quantity: z.number().int().min(0).max(99).optional(),
  requestOffer: z.boolean().optional(),
});

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    const body = await request.json();
    const data = patchSchema.parse(body);

    const cart = await getOrCreateCart(session?.id);
    const item = await prisma.cartItem.findFirst({
      where: { id: data.itemId, cartId: cart.id },
    });
    if (!item) return handleApiError(new Error("Artikel nicht im Warenkorb"));

    if (data.quantity === 0) {
      await prisma.cartItem.delete({ where: { id: item.id } });
    } else {
      await prisma.cartItem.update({
        where: { id: item.id },
        data: {
          quantity: data.quantity ?? item.quantity,
          requestOffer: data.requestOffer ?? item.requestOffer,
        },
      });
    }

    const updated = await getOrCreateCart(session?.id);
    return jsonOk(serializeCart(updated));
  } catch (error) {
    return handleApiError(error);
  }
}

const deleteSchema = z.object({ itemId: z.string() });

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    const body = await request.json();
    const data = deleteSchema.parse(body);

    const cart = await getOrCreateCart(session?.id);
    await prisma.cartItem.deleteMany({
      where: { id: data.itemId, cartId: cart.id },
    });

    const updated = await getOrCreateCart(session?.id);
    return jsonOk(serializeCart(updated));
  } catch (error) {
    return handleApiError(error);
  }
}
