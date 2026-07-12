import { NextResponse } from "next/server";
import { getGarageAccessData, getGarageSession } from "@/lib/garage-auth";

export async function GET() {
  const session = await getGarageSession();
  if (!session) {
    return NextResponse.json({ access: null });
  }

  const access = await getGarageAccessData(session.accessId);
  if (!access) {
    return NextResponse.json({ access: null });
  }

  return NextResponse.json({ access });
}
