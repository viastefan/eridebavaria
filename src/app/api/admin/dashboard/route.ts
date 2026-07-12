import { requireStaff } from "@/lib/auth";
import { getAdminDashboardStats } from "@/lib/orders";
import { getPipelineOverview } from "@/lib/pipeline";
import { jsonOk, handleApiError } from "@/lib/api-utils";

export async function GET() {
  try {
    await requireStaff();
    const [stats, pipeline] = await Promise.all([
      getAdminDashboardStats(),
      getPipelineOverview(),
    ]);
    return jsonOk({ stats, pipeline });
  } catch (error) {
    return handleApiError(error);
  }
}
