import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import "@/lib/runtime-env";

export async function middleware(req: NextRequest) {
  if (!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL === "http://localhost:3000") {
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") || "https";
    if (host && !host.includes("localhost")) {
      process.env.NEXTAUTH_URL = `${proto}://${host}`;
    }
  }

  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // Public admin entry points
  if (pathname.startsWith("/admin/login") || pathname.startsWith("/admin/setup")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret:
      process.env.NEXTAUTH_SECRET ||
      process.env.SUPABASE_API_KEY ||
      "mcso-hostinger-default-nextauth-secret",
  });
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
