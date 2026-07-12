import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getNotificationsForUser, getNotificationsForCustomer } from "@/lib/notifications";
import { jsonOk, handleApiError } from "@/lib/api-utils";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return handleApiError(new Error("Unauthorized"));

    const isStaff = session.role === "ADMIN" || session.role === "EMPLOYEE";
    const userNotifications = await getNotificationsForUser(session.id);

    let customerNotifications: Awaited<ReturnType<typeof getNotificationsForCustomer>> = [];
    const customer = await prisma.customer.findUnique({
      where: { userId: session.id },
    });
    if (customer) {
      customerNotifications = await getNotificationsForCustomer(customer.id);
    }

    const all = [...userNotifications, ...customerNotifications]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 50);

    return jsonOk({ notifications: all, isStaff });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) return handleApiError(new Error("Unauthorized"));

    const { ids } = (await request.json()) as { ids: string[] };
    await prisma.notification.updateMany({
      where: { id: { in: ids } },
      data: { read: true },
    });

    return jsonOk({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
