import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { scheduleBackup } from "@/lib/backup";
import { isDemoEmail, needsOwnerSetup } from "@/lib/admin-setup";

export const dynamic = "force-dynamic";

const setupSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(200),
  password: z.string().min(8).max(100),
});

export async function POST(req: NextRequest) {
  try {
    if (!(await needsOwnerSetup())) {
      return NextResponse.json(
        { error: "Admin account already exists. Please sign in." },
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
    const message =
      err instanceof Error && /readonly|read-only|EACCES|SQLITE_READONLY/i.test(err.message)
        ? "Server storage is not writable. Redeploy or contact support, then try again."
        : "Could not create your account. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
