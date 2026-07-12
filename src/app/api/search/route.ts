import { searchCatalog } from "@/lib/catalog";
import { prisma } from "@/lib/db";
import { jsonOk, handleApiError } from "@/lib/api-utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? "";
    const admin = searchParams.get("admin") === "1";

    const catalog = await searchCatalog(q);

    if (!admin) {
      return jsonOk({
        results: [...catalog.products, ...catalog.parts].slice(0, 10),
      });
    }

    const requests = q
      ? await prisma.customRequest.findMany({
          where: { message: { contains: q } },
          take: 5,
        })
      : [];

    return jsonOk({
      ...catalog,
      requests: requests.map((r) => ({
        id: r.id,
        type: "request" as const,
        name: r.productName ?? "Beratungsanfrage",
        subtitle: r.message.slice(0, 60),
        href: `/admin/pipeline?request=${r.id}`,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
