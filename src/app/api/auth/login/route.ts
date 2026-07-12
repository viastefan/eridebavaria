import { loginSchema } from "@/lib/validations";
import { verifyPassword, createSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { mergeGuestCartToUser, CART_SESSION_COOKIE } from "@/lib/cart";
import { cookies } from "next/headers";
import { handleApiError, jsonOk } from "@/lib/api-utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !(await verifyPassword(data.password, user.passwordHash))) {
      return handleApiError(new Error("Ungültige Anmeldedaten"));
    }

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

    return jsonOk({
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
