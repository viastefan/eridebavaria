import { getSession, getUserFromDb } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { jsonOk } from "@/lib/api-utils";

export async function GET() {
  const session = await getSession();
  if (!session) return jsonOk({ user: null });

  const user = await getUserFromDb(session.id);
  const customer = await prisma.customer.findUnique({
    where: { userId: session.id },
  });

  return jsonOk({ user, customer });
}
