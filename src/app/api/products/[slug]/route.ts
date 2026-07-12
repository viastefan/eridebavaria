import { getProductBySlug } from "@/lib/catalog";
import { prisma } from "@/lib/db";
import { jsonOk, handleApiError } from "@/lib/api-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) return handleApiError(new Error("Produkt nicht gefunden"));

    const configOptions = await prisma.productConfigOption.findMany({
      where: { productId: product.id },
      orderBy: { sortOrder: "asc" },
    });

    return jsonOk({ product, configOptions });
  } catch (error) {
    return handleApiError(error);
  }
}
