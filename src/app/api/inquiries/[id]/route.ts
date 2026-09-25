import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { INQUIRY_STATUSES } from "@/lib/inquiry-status";

const patchSchema = z.object({
  status: z.enum(INQUIRY_STATUSES).optional(),
  notes: z.string().max(5000).optional().nullable(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
    include: {
      contact: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!inquiry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ inquiry });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  try {
    const body = patchSchema.parse(await req.json());
    const existing = await prisma.inquiry.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data: { status?: string; notes?: string | null } = {};
    if (body.notes !== undefined) data.notes = body.notes;
    if (body.status && body.status !== existing.status) {
      data.status = body.status;
      await prisma.statusEvent.create({
        data: {
          inquiryId: id,
          fromStatus: existing.status,
          toStatus: body.status,
        },
      });
    }

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data,
      include: {
        contact: true,
        statusHistory: { orderBy: { createdAt: "asc" } },
      },
    });

    const { scheduleBackup } = await import("@/lib/backup");
    scheduleBackup();

    return NextResponse.json({ inquiry });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid update" }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
