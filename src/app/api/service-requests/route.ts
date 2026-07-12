import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { findOrCreateCustomer } from "@/lib/customers";
import { notifyAdmins, notifyCustomer } from "@/lib/notifications";
import { jsonOk, handleApiError } from "@/lib/api-utils";

const schema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  vehicleId: z.string().optional(),
  productName: z.string().optional(),
  problemDescription: z.string().min(10).max(5000),
  images: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const body = await request.json();
    const data = schema.parse(body);

    let customerId: string;
    if (session) {
      const customer = await findOrCreateCustomer({
        email: session.email,
        name: data.name ?? `${session.firstName ?? ""} ${session.lastName ?? ""}`.trim(),
        userId: session.id,
      });
      customerId = customer.id;
    } else if (data.email) {
      const customer = await findOrCreateCustomer({
        email: data.email,
        name: data.name ?? data.email.split("@")[0],
      });
      customerId = customer.id;
    } else {
      return handleApiError(new Error("E-Mail oder Anmeldung erforderlich"));
    }

    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        customerId,
        vehicleId: data.vehicleId,
        productName: data.productName,
        problemDescription: data.problemDescription,
        images: JSON.stringify(data.images ?? []),
        status: "CREATED",
      },
    });

    await notifyCustomer(
      customerId,
      "SERVICE_UPDATE",
      "Serviceanfrage eingegangen",
      "Wir haben Ihre Serviceanfrage erhalten und melden uns zeitnah."
    );

    await notifyAdmins(
      "NEW_SERVICE_REQUEST",
      "Neue Serviceanfrage",
      data.problemDescription.slice(0, 100),
      { serviceId: serviceRequest.id }
    );

    return jsonOk({ serviceRequest });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return handleApiError(new Error("Unauthorized"));

    const { requireStaff } = await import("@/lib/auth");
    const isStaff = session.role === "ADMIN" || session.role === "EMPLOYEE";

    if (isStaff) {
      const requests = await prisma.serviceRequest.findMany({
        orderBy: { createdAt: "desc" },
        include: { customer: true, vehicle: true },
      });
      return jsonOk({ requests });
    }

    const customer = await prisma.customer.findUnique({
      where: { userId: session.id },
    });
    if (!customer) return jsonOk({ requests: [] });

    const requests = await prisma.serviceRequest.findMany({
      where: { customerId: customer.id },
      orderBy: { createdAt: "desc" },
    });

    return jsonOk({ requests });
  } catch (error) {
    return handleApiError(error);
  }
}
