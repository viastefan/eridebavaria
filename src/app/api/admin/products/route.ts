import { z } from "zod";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { jsonOk, handleApiError } from "@/lib/api-utils";

export async function GET() {
  try {
    await requireStaff();
    const products = await prisma.product.findMany({
      include: { category: true, configOptions: true },
      orderBy: { updatedAt: "desc" },
    });
    return jsonOk({ products });
  } catch (error) {
    return handleApiError(error);
  }
}

const createSchema = z.object({
  id: z.string(),
  slug: z.string(),
  sku: z.string(),
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  price: z.number().positive(),
  brand: z.string(),
  categoryId: z.string(),
  productType: z.enum(["VEHICLE", "ACCESSORY", "PART", "SERVICE"]).default("VEHICLE"),
  images: z.array(z.string()).default([]),
  specs: z.record(z.string(), z.unknown()).default({}),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("ACTIVE"),
  available: z.boolean().default(true),
  featured: z.boolean().default(false),
});

export async function POST(request: Request) {
  try {
    await requireStaff();
    const body = await request.json();
    const data = createSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        ...data,
        images: JSON.stringify(data.images),
        specs: JSON.stringify(data.specs),
      },
    });

    return jsonOk({ product });
  } catch (error) {
    return handleApiError(error);
  }
}

const updateSchema = createSchema.partial().extend({ id: z.string() });

export async function PATCH(request: Request) {
  try {
    await requireStaff();
    const body = await request.json();
    const data = updateSchema.parse(body);

    const { id, images, specs, ...rest } = data;
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(images ? { images: JSON.stringify(images) } : {}),
        ...(specs ? { specs: JSON.stringify(specs) } : {}),
      },
    });

    return jsonOk({ product });
  } catch (error) {
    return handleApiError(error);
  }
}
