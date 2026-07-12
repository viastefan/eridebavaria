import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getOrdersForCustomer } from "@/lib/orders";
import { jsonOk, handleApiError } from "@/lib/api-utils";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return handleApiError(new Error("Unauthorized"));

    const customer = await prisma.customer.findUnique({
      where: { userId: session.id },
    });

    if (!customer) {
      return jsonOk({
        orders: [],
        configurations: [],
        offers: [],
        serviceRequests: [],
        vehicles: [],
      });
    }

    const [orders, configurations, offers, serviceRequests, vehicles] =
      await Promise.all([
        getOrdersForCustomer(customer.id),
        prisma.savedConfiguration.findMany({
          where: { customerId: customer.id },
          include: { product: true },
          orderBy: { createdAt: "desc" },
        }),
        prisma.offer.findMany({
          where: { customerId: customer.id },
          orderBy: { createdAt: "desc" },
        }),
        prisma.serviceRequest.findMany({
          where: { customerId: customer.id },
          orderBy: { createdAt: "desc" },
        }),
        prisma.userVehicle.findMany({
          where: { userId: session.id },
        }),
      ]);

    return jsonOk({
      customer,
      orders,
      configurations,
      offers,
      serviceRequests,
      vehicles,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
