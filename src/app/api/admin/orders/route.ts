import { z } from "zod";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateOrderStatus } from "@/lib/orders";
import { jsonOk, handleApiError } from "@/lib/api-utils";
import type { OrderStatus } from "@/generated/prisma/client";

export async function GET(request: Request) {
  try {
    await requireStaff();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const order = await prisma.order.findUnique({
        where: { id },
        include: { items: true, customer: true, user: true },
      });
      return jsonOk({ order });
    }

    const orders = await prisma.order.findMany({
      include: { items: true, customer: true },
      orderBy: { createdAt: "desc" },
    });
    return jsonOk({ orders });
  } catch (error) {
    return handleApiError(error);
  }
}

const statusSchema = z.object({
  id: z.string(),
  status: z.enum([
    "CREATED",
    "PAYMENT_PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPING",
    "COMPLETED",
    "CANCELLED",
  ]),
});

export async function PATCH(request: Request) {
  try {
    await requireStaff();
    const body = await request.json();
    const data = statusSchema.parse(body);

    const order = await updateOrderStatus(data.id, data.status as OrderStatus);
    return jsonOk({ order });
  } catch (error) {
    return handleApiError(error);
  }
}
