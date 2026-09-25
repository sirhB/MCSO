import { NextRequest, NextResponse } from "next/server";
import { compare, hash } from "bcryptjs";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scheduleBackup } from "@/lib/backup";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, email: true, createdAt: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ user });
}

const patchSchema = z
  .object({
    name: z.string().min(2).max(80).optional(),
    email: z.string().email().max(200).optional(),
    currentPassword: z.string().min(1).optional(),
    newPassword: z.string().min(8).max(100).optional(),
  })
  .refine(
    (data) => !data.newPassword || Boolean(data.currentPassword),
    { message: "Current password is required to set a new password.", path: ["currentPassword"] },
  );

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!existing) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const body = patchSchema.parse(await req.json());
    const data: { name?: string; email?: string; passwordHash?: string } = {};

    if (body.name) data.name = body.name.trim();

      if (body.email) {
      const email = body.email.toLowerCase().trim();
      if (email !== existing.email) {
        if (!body.currentPassword) {
          return NextResponse.json(
            { error: "Enter your current password to change email." },
            { status: 400 },
          );
        }
        const ok = await compare(body.currentPassword, existing.passwordHash);
        if (!ok) {
          return NextResponse.json(
            { error: "Current password is incorrect." },
            { status: 400 },
          );
        }
        const taken = await prisma.user.findUnique({ where: { email } });
        if (taken) {
          return NextResponse.json(
            { error: "That email is already in use." },
            { status: 409 },
          );
        }
        data.email = email;
      }
    }

    if (body.newPassword) {
      const ok = await compare(body.currentPassword || "", existing.passwordHash);
      if (!ok) {
        return NextResponse.json(
          { error: "Current password is incorrect." },
          { status: 400 },
        );
      }
      data.passwordHash = await hash(body.newPassword, 10);
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No changes submitted." }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: existing.id },
      data,
      select: { id: true, name: true, email: true },
    });

    scheduleBackup();

    return NextResponse.json({
      ok: true,
      user,
      emailChanged: Boolean(data.email),
      passwordChanged: Boolean(data.passwordHash),
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message || "Invalid account update." },
        { status: 400 },
      );
    }
    console.error(err);
    return NextResponse.json({ error: "Could not update account." }, { status: 500 });
  }
}
