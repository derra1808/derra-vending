import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bloquer l'accès public à l'ebook PDF (servi via API membre uniquement)
  if (
    pathname === "/formation/ebook.pdf" ||
    pathname.startsWith("/formation/ebook")
  ) {
    return NextResponse.redirect(new URL("/formation/pricing", request.url));
  }

  if (pathname === "/") {
    return NextResponse.rewrite(new URL("/index.html", request.url));
  }

  // Cron + webhook Shotstack : pas de session cookie requise
  if (
    pathname.startsWith("/api/studio/cron") ||
    pathname.startsWith("/api/studio/webhook")
  ) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/formation") ||
    pathname.startsWith("/studio") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/stripe/checkout") ||
    pathname.startsWith("/api/formation") ||
    pathname.startsWith("/api/studio")
  ) {
    return updateSession(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/formation/:path*",
    "/studio",
    "/studio/:path*",
    "/api/auth/:path*",
    "/api/stripe/checkout",
    "/api/formation/:path*",
    "/api/studio/:path*",
  ],
};
