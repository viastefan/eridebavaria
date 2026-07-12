import { prisma } from "./db";
import type { CustomRequestStatus, PipelineStage } from "@/generated/prisma/client";

const stageToRequestStatus: Partial<Record<PipelineStage, CustomRequestStatus>> = {
  NEW_REQUEST: "NEW",
  CUSTOMER_CONTACTED: "CONTACTED",
  NEEDS_ANALYSIS: "REVIEWING",
  CONFIGURATION_CREATED: "REVIEWING",
  OFFER_SENT: "OFFER_CREATED",
  ORDER_CONFIRMED: "APPROVED",
  PRODUCTION_DELIVERY: "APPROVED",
  COMPLETED: "COMPLETED",
};

export async function createOpportunityFromRequest(input: {
  customerId: string;
  customRequestId: string;
  title: string;
  estimatedValue?: number;
}) {
  return prisma.salesOpportunity.create({
    data: {
      customerId: input.customerId,
      customRequestId: input.customRequestId,
      title: input.title,
      stage: "NEW_REQUEST",
      estimatedValue: input.estimatedValue,
    },
  });
}

export async function moveOpportunityStage(id: string, stage: PipelineStage) {
  const opportunity = await prisma.salesOpportunity.update({
    where: { id },
    data: { stage },
    include: { customer: true, customRequest: true },
  });

  const requestStatus = stageToRequestStatus[stage];
  if (requestStatus && opportunity.customRequestId) {
    await prisma.customRequest.update({
      where: { id: opportunity.customRequestId },
      data: { status: requestStatus },
    });
  }

  return opportunity;
}

export async function advanceOpportunityForConfiguration(
  customerId: string,
  productId: string
) {
  const opportunity = await prisma.salesOpportunity.findFirst({
    where: {
      customerId,
      stage: { in: ["NEW_REQUEST", "CUSTOMER_CONTACTED", "NEEDS_ANALYSIS"] },
      OR: [
        { customRequest: { productId } },
        { title: { contains: "Anfrage" } },
      ],
    },
    orderBy: { updatedAt: "desc" },
  });

  if (opportunity) {
    return moveOpportunityStage(opportunity.id, "CONFIGURATION_CREATED");
  }
  return null;
}

export async function getPipelineOverview() {
  const [stages, total] = await Promise.all([
    prisma.salesOpportunity.groupBy({
      by: ["stage"],
      _count: { id: true },
    }),
    prisma.salesOpportunity.count(),
  ]);

  return { stages, total };
}
