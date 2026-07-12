import { prisma } from "./db";
import type { CustomerType } from "@/generated/prisma/client";

export async function findOrCreateCustomer(input: {
  email: string;
  name: string;
  phone?: string;
  company?: string;
  customerType?: CustomerType;
  userId?: string;
}) {
  const existing = await prisma.customer.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (existing) {
    return prisma.customer.update({
      where: { id: existing.id },
      data: {
        name: input.name || existing.name,
        phone: input.phone ?? existing.phone,
        company: input.company ?? existing.company,
        userId: input.userId ?? existing.userId,
      },
    });
  }

  return prisma.customer.create({
    data: {
      email: input.email.toLowerCase(),
      name: input.name,
      phone: input.phone,
      company: input.company,
      customerType: input.customerType ?? "PRIVATE",
      userId: input.userId,
    },
  });
}
