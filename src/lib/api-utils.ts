import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return jsonError(error.issues[0]?.message ?? "Ungültige Eingabe", 400);
  }
  if (error instanceof Error) {
    if (error.message === "Unauthorized") return jsonError("Nicht angemeldet", 401);
    if (error.message === "Forbidden") return jsonError("Keine Berechtigung", 403);
    return jsonError(error.message, 400);
  }
  return jsonError("Interner Fehler", 500);
}

export function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `EB-${ts}-${rand}`;
}

export function generateOfferNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  return `ANG-${ts}`;
}
