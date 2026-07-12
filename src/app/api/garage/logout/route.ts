import { NextResponse } from "next/server";
import { destroyGarageSession } from "@/lib/garage-auth";

export async function POST() {
  await destroyGarageSession();
  return NextResponse.json({ ok: true });
}
