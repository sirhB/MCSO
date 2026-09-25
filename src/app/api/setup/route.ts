import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { scheduleBackup } from "@/lib/backup";

const setupSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(200),
  password: z.string().min(8).max(100),
});

export async function POST(req: NextRequest) {
  const existing = await prisma.user.count();
  if (existing > 0) {
    return NextResponse.json(
      { error: "Admin account already exists. Please sign in." },
      { status: 409 },
    );
  }

  try {
    const body = setupSchema.parse(await req.json());
    const email = body.email.toLowerCase().trim();
    const passwordHash = await hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        name: body.name.trim(),
        email,
        passwordHash,
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
    console.error(err);
    return NextResponse.json({ error: "Could not create admin account." }, { status: 500 });
  }
}
