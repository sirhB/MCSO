import { NextResponse } from "next/server";
import { pingDatabase } from "@/lib/prisma";
import { needsOwnerSetup, DEMO_ADMIN } from "@/lib/admin-setup";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Lightweight DB/setup diagnostics for Hostinger deploys (no secrets). */
export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "";
  const info = {
    ok: false,
    needsSetup: true as boolean,
    sqlite: dbUrl.startsWith("file:"),
    ignoredHostDatabaseUrl: Boolean(process.env.MCSO_IGNORED_DATABASE_URL),
    demoEmail: DEMO_ADMIN.email,
    error: null as string | null,
  };

  try {
    await pingDatabase();
    info.needsSetup = await needsOwnerSetup();
    info.ok = true;
    return NextResponse.json(info);
  } catch (err) {
    info.error = err instanceof Error ? err.message : "Database unavailable";
    console.error("[setup/health]", err);
    return NextResponse.json(info, { status: 500 });
  }
}
