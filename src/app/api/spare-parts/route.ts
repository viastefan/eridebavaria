import { getSpareParts } from "@/lib/catalog";
import { jsonOk, handleApiError } from "@/lib/api-utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId") ?? undefined;
    const q = searchParams.get("q");

    const parts = await getSpareParts(productId);

    if (q) {
      const query = q.toLowerCase();
      const filtered = parts.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.partNumber.toLowerCase().includes(query)
      );
      return jsonOk({ parts: filtered });
    }

    return jsonOk({ parts });
  } catch (error) {
    return handleApiError(error);
  }
}
