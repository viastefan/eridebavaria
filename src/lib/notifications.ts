import { prisma } from "./db";
import type { NotificationType } from "@/generated/prisma/client";

export async function notifyCustomer(
  customerId: string,
  type: NotificationType,
  title: string,
  message: string,
  metadata?: Record<string, unknown>
) {
  return prisma.notification.create({
    data: {
      customerId,
      type,
      title,
      message,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });
}

export async function notifyAdmins(
  type: NotificationType,
  title: string,
  message: string,
  metadata?: Record<string, unknown>
) {
  const admins = await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "EMPLOYEE"] } },
    select: { id: true },
  });

  if (admins.length === 0) return [];

  return prisma.notification.createMany({
    data: admins.map((admin) => ({
      userId: admin.id,
      type,
      title,
      message,
      metadata: metadata ? JSON.stringify(metadata) : null,
    })),
  });
}

export async function getNotificationsForUser(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function getNotificationsForCustomer(customerId: string) {
  return prisma.notification.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}
