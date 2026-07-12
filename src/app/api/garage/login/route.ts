import { NextResponse } from "next/server";
import { garagePinSchema } from "@/lib/validations";
import { loginWithGaragePin } from "@/lib/garage-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = garagePinSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe" },
        { status: 400 }
      );
    }

    const result = await loginWithGaragePin(parsed.data.pin);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    return NextResponse.json({ access: result.access });
  } catch {
    return NextResponse.json({ error: "Anmeldung fehlgeschlagen." }, { status: 500 });
  }
}
