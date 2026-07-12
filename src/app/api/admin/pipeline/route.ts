import { z } from "zod";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { moveOpportunityStage } from "@/lib/pipeline";
import { jsonOk, handleApiError } from "@/lib/api-utils";
import type { PipelineStage } from "@/generated/prisma/client";

export async function GET() {
  try {
    await requireStaff();
    const opportunities = await prisma.salesOpportunity.findMany({
      include: {
        customer: true,
        customRequest: { include: { product: true } },
        assignedTo: true,
        offers: true,
      },
      orderBy: { updatedAt: "desc" },
    });
    return jsonOk({ opportunities });
  } catch (error) {
    return handleApiError(error);
  }
}

const moveSchema = z.object({
  id: z.string(),
  stage: z.enum([
    "NEW_REQUEST",
    "CUSTOMER_CONTACTED",
    "NEEDS_ANALYSIS",
    "CONFIGURATION_CREATED",
    "OFFER_SENT",
    "ORDER_CONFIRMED",
    "PRODUCTION_DELIVERY",
    "COMPLETED",
  ]),
});

export async function PATCH(request: Request) {
  try {
    await requireStaff();
    const body = await request.json();
    const data = moveSchema.parse(body);

    const opportunity = await moveOpportunityStage(
      data.id,
      data.stage as PipelineStage
    );

    return jsonOk({ opportunity });
  } catch (error) {
    return handleApiError(error);
  }
}
