import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { findOrCreateCustomer } from "@/lib/customers";
import { advanceOpportunityForConfiguration } from "@/lib/pipeline";
import { jsonOk, handleApiError } from "@/lib/api-utils";

const schema = z.object({
  productId: z.string(),
  selections: z.record(z.string(), z.string()),
  accessories: z.array(z.string()).default([]),
  specialRequest: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const body = await request.json();
    const data = schema.parse(body);

    const product = await prisma.product.findUnique({
      where: { id: data.productId },
      include: { configOptions: true },
    });
    if (!product) return handleApiError(new Error("Produkt nicht gefunden"));

    let accessoryTotal = 0;
    if (data.accessories.length > 0) {
      const accessories = await prisma.product.findMany({
        where: { id: { in: data.accessories } },
      });
      accessoryTotal = accessories.reduce((sum, a) => sum + a.price, 0);
    }

    let optionTotal = 0;
    const config = product.configurator ? JSON.parse(product.configurator) : {};
    for (const [key, value] of Object.entries(data.selections)) {
      const options = config[key] as { id: string; price?: number }[] | undefined;
      const match = options?.find((o) => o.id === value);
      if (match?.price) optionTotal += match.price;
    }

    const estimatedPrice = product.price + optionTotal + accessoryTotal;

    const summaryParts = [
      product.name,
      ...Object.entries(data.selections).map(([k, v]) => `${k}: ${v}`),
    ];
    if (data.specialRequest) summaryParts.push(`Anfrage: ${data.specialRequest}`);

    let customerId: string | undefined;
    if (session) {
      const customer = await prisma.customer.findUnique({
        where: { userId: session.id },
      });
      customerId = customer?.id;
    }

    const configuration = await prisma.savedConfiguration.create({
      data: {
        customerId,
        productId: data.productId,
        selections: JSON.stringify(data.selections),
        accessories: JSON.stringify(data.accessories),
        specialRequest: data.specialRequest,
        estimatedPrice,
        summary: summaryParts.join(" · "),
      },
    });

    if (customerId) {
      await advanceOpportunityForConfiguration(customerId, data.productId);
    }

    return jsonOk({ configuration });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return handleApiError(new Error("Unauthorized"));

    const customer = await prisma.customer.findUnique({
      where: { userId: session.id },
    });
    if (!customer) return jsonOk({ configurations: [] });

    const configurations = await prisma.savedConfiguration.findMany({
      where: { customerId: customer.id },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });

    return jsonOk({ configurations });
  } catch (error) {
    return handleApiError(error);
  }
}
