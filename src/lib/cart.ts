import { prisma } from "./db";
import { cookies } from "next/headers";

export const CART_SESSION_COOKIE = "eride-cart-session";

export async function getCartSessionId() {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get(CART_SESSION_COOKIE)?.value;
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    cookieStore.set(CART_SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }
  return sessionId;
}

export async function getOrCreateCart(userId?: string) {
  if (userId) {
    const existing = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
    if (existing) return existing;

    return prisma.cart.create({
      data: { userId },
      include: { items: { include: { product: true } } },
    });
  }

  const sessionId = await getCartSessionId();
  const existing = await prisma.cart.findUnique({
    where: { sessionId },
    include: { items: { include: { product: true } } },
  });
  if (existing) return existing;

  return prisma.cart.create({
    data: { sessionId },
    include: { items: { include: { product: true } } },
  });
}

export async function mergeGuestCartToUser(sessionId: string, userId: string) {
  const guestCart = await prisma.cart.findUnique({
    where: { sessionId },
    include: { items: true },
  });
  if (!guestCart || guestCart.items.length === 0) return;

  let userCart = await prisma.cart.findUnique({ where: { userId } });
  if (!userCart) {
    userCart = await prisma.cart.create({ data: { userId } });
  }

  for (const item of guestCart.items) {
    const existing = await prisma.cartItem.findFirst({
      where: {
        cartId: userCart.id,
        productId: item.productId,
        configuration: item.configuration,
      },
    });
    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + item.quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          productId: item.productId,
          quantity: item.quantity,
          configuration: item.configuration,
          requestOffer: item.requestOffer,
        },
      });
    }
  }

  await prisma.cart.delete({ where: { id: guestCart.id } });
}

export async function clearCart(userId?: string) {
  const cart = await getOrCreateCart(userId);
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
}

export function serializeCart(cart: Awaited<ReturnType<typeof getOrCreateCart>>) {
  return {
    id: cart.id,
    items: cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      price: item.product.price,
      image: (JSON.parse(item.product.images) as string[])[0] ?? "",
      quantity: item.quantity,
      configuration: item.configuration ? JSON.parse(item.configuration) : undefined,
      requestOffer: item.requestOffer,
    })),
    total: cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    count: cart.items.reduce((sum, i) => sum + i.quantity, 0),
  };
}
