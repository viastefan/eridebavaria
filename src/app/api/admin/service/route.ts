import { z } from "zod";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notifyCustomer } from "@/lib/notifications";
import { jsonOk, handleApiError } from "@/lib/api-utils";
import type { ServiceStatus } from "@/generated/prisma/client";

export async function GET() {
  try {
    await requireStaff();
    const requests = await prisma.serviceRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: { customer: true, vehicle: true },
    });
    return jsonOk({ requests });
  } catch (error) {
    return handleApiError(error);
  }
}

const patchSchema = z.object({
  id: z.string(),
  status: z.enum(["CREATED", "REVIEWING", "APPOINTMENT", "IN_PROGRESS", "COMPLETED"]),
  notes: z.string().optional(),
  appointmentDate: z.string().datetime().optional(),
});

export async function PATCH(request: Request) {
  try {
    await requireStaff();
    const body = await request.json();
    const data = patchSchema.parse(body);

    const serviceRequest = await prisma.serviceRequest.update({
      where: { id: data.id },
      data: {
        status: data.status as ServiceStatus,
        notes: data.notes,
        appointmentDate: data.appointmentDate ? new Date(data.appointmentDate) : undefined,
      },
      include: { customer: true },
    });

    await notifyCustomer(
      serviceRequest.customerId,
      "SERVICE_UPDATE",
      "Service-Status aktualisiert",
      `Ihre Serviceanfrage ist jetzt: ${data.status.replace("_", " ")}`
    );

    return jsonOk({ serviceRequest });
  } catch (error) {
    return handleApiError(error);
  }
}
