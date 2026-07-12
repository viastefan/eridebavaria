import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { jsonOk, handleApiError } from "@/lib/api-utils";

export async function GET() {
  try {
    await requireStaff();
    const customers = await prisma.customer.findMany({
      include: {
        _count: {
          select: {
            orders: true,
            customRequests: true,
            serviceRequests: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return jsonOk({ customers });
  } catch (error) {
    return handleApiError(error);
  }
}
