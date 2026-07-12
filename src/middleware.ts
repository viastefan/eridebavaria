import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { acceptClientHintsHeader } from "@teispace/next-themes/server";

export function middleware(_request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("Accept-CH", acceptClientHintsHeader());
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|media/).*)"],
};
