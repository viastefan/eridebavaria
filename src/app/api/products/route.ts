import { getAllProducts, getAllAccessories } from "@/lib/catalog";
import { jsonOk, handleApiError } from "@/lib/api-utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type === "accessories") {
      const accessories = await getAllAccessories();
      return jsonOk({ accessories });
    }

    const products = await getAllProducts();
    return jsonOk({ products });
  } catch (error) {
    return handleApiError(error);
  }
}
