import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations";
import { hashPassword, createSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { findOrCreateCustomer } from "@/lib/customers";
import { mergeGuestCartToUser, CART_SESSION_COOKIE } from "@/lib/cart";
import { cookies } from "next/headers";
import { handleApiError } from "@/lib/api-utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ error: "E-Mail bereits registriert" }, { status: 409 });
    }

    const passwordHash = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: "CUSTOMER",
      },
    });

    await findOrCreateCustomer({
      email: data.email,
      name: `${data.firstName} ${data.lastName}`,
      userId: user.id,
    });

    const cookieStore = await cookies();
    const cartSessionId = cookieStore.get(CART_SESSION_COOKIE)?.value;
    if (cartSessionId) {
      await mergeGuestCartToUser(cartSessionId, user.id);
    }

    await createSession({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
