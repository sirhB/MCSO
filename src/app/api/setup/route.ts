import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { pingDatabase, prisma } from "@/lib/prisma";
import { scheduleBackup } from "@/lib/backup";
import { isDemoEmail, needsOwnerSetup } from "@/lib/admin-setup";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const setupSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(200),
  password: z.string().min(8).max(100),
});

function dbErrorMessage(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  if (/readonly|read-only|EACCES|SQLITE_READONLY/i.test(msg)) {
    return "Server storage is not writable. Redeploy on Hostinger, then try again.";
  }
  if (/P1001|P1003|unable to open|does not exist|no such table/i.test(msg)) {
    return "Database is not ready on the server. Redeploy (npm run build) so SQLite can be created, then try again.";
  }
  if (/postgres|mysql|prisma\/client/i.test(msg) && /url|provider|datasource/i.test(msg)) {
    return "Host database URL conflict. This app needs SQLite; redeploy the latest build.";
  }
  return "Could not create your account. Please try again.";
}

export async function POST(req: NextRequest) {
  try {
    await pingDatabase();

    if (!(await needsOwnerSetup())) {
      return NextResponse.json(
        { error: "Admin account already exists. Please sign in at /admin/login." },
        { status: 409 },
      );
    }

    const body = setupSchema.parse(await req.json());
    const email = body.email.toLowerCase().trim();

    if (isDemoEmail(email)) {
      return NextResponse.json(
        {
          error:
            "That email is reserved for the demo login. Use a different email for your account.",
        },
        { status: 400 },
      );
    }

    const passwordHash = await hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        name: body.name.trim(),
        email,
        passwordHash,
        isDemo: false,
      },
    });

    scheduleBackup();

    return NextResponse.json({
      ok: true,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        {
          error:
            "Please enter a name, a valid email, and a password of at least 8 characters.",
        },
        { status: 400 },
      );
    }
    console.error("[setup] create failed:", err);
    return NextResponse.json({ error: dbErrorMessage(err) }, { status: 500 });
  }
}
