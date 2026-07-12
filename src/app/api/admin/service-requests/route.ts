import { z } from "zod";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notifyCustomer } from "@/lib/notifications";
import { jsonOk, handleApiError } from "@/lib/api-utils";
import type { ServiceStatus } from "@/generated/prisma/client";

const statusSchema = z.object({
  id: z.string(),
  status: z.enum(["CREATED", "REVIEWING", "APPOINTMENT", "IN_PROGRESS", "COMPLETED"]),
  appointmentDate: z.string().datetime().optional(),
});

export async function PATCH(request: Request) {
  try {
    await requireStaff();
    const body = await request.json();
    const data = statusSchema.parse(body);

    const serviceRequest = await prisma.serviceRequest.update({
      where: { id: data.id },
      data: {
        status: data.status as ServiceStatus,
        appointmentDate: data.appointmentDate ? new Date(data.appointmentDate) : undefined,
      },
      include: { customer: true },
    });

    if (serviceRequest.customerId) {
      await notifyCustomer(
        serviceRequest.customerId,
        "SERVICE_UPDATE",
        "Service-Status aktualisiert",
        `Ihre Serviceanfrage ist jetzt: ${data.status}`
      );
    }

    return jsonOk({ serviceRequest });
  } catch (error) {
    return handleApiError(error);
  }
}
