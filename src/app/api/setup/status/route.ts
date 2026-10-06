import { NextResponse } from "next/server";
import { pingDatabase } from "@/lib/prisma";
import { needsOwnerSetup } from "@/lib/admin-setup";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    await pingDatabase();
    const needsSetup = await needsOwnerSetup();
    return NextResponse.json({ needsSetup });
  } catch (err) {
    console.error("[setup/status]", err);
    // Fail open to the setup form so the owner can still attempt registration.
    return NextResponse.json({
      needsSetup: true,
      warning: "database-unavailable",
    });
  }
}
