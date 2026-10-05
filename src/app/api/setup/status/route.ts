import { NextResponse } from "next/server";
import { needsOwnerSetup } from "@/lib/admin-setup";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const needsSetup = await needsOwnerSetup();
    return NextResponse.json({ needsSetup });
  } catch (err) {
    console.error("[setup/status]", err);
    // Fail open to the setup form so the owner can still attempt registration.
    return NextResponse.json({ needsSetup: true });
  }
}
