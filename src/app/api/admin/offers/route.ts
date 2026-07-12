import { z } from "zod";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateOfferNumber } from "@/lib/api-utils";
import { notifyCustomer } from "@/lib/notifications";
import { moveOpportunityStage } from "@/lib/pipeline";
import { jsonOk, handleApiError } from "@/lib/api-utils";

export async function GET() {
  try {
    await requireStaff();
    const offers = await prisma.offer.findMany({
      include: { customer: true, opportunity: true, configuration: true },
      orderBy: { createdAt: "desc" },
    });
    return jsonOk({ offers });
  } catch (error) {
    return handleApiError(error);
  }
}

const createSchema = z.object({
  customerId: z.string(),
  opportunityId: z.string().optional(),
  configurationId: z.string().optional(),
  items: z.array(
    z.object({
      name: z.string(),
      price: z.number(),
      quantity: z.number().int().min(1),
    })
  ),
  notes: z.string().optional(),
  validUntil: z.string().datetime().optional(),
});

export async function POST(request: Request) {
  try {
    await requireStaff();
    const body = await request.json();
    const data = createSchema.parse(body);

    const subtotal = data.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const offer = await prisma.offer.create({
      data: {
        offerNumber: generateOfferNumber(),
        customerId: data.customerId,
        opportunityId: data.opportunityId,
        configurationId: data.configurationId,
        items: JSON.stringify(data.items),
        subtotal,
        total: subtotal,
        notes: data.notes,
        status: "SENT",
        validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
      },
    });

    if (data.opportunityId) {
      await moveOpportunityStage(data.opportunityId, "OFFER_SENT");
    }

    await notifyCustomer(
      data.customerId,
      "OFFER_CREATED",
      "Angebot erstellt",
      `Ihr Angebot ${offer.offerNumber} ist bereit. Wir melden uns bei Ihnen.`
    );

    return jsonOk({ offer });
  } catch (error) {
    return handleApiError(error);
  }
}
