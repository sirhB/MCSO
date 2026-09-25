import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const items = await prisma.galleryImage.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const item = await prisma.galleryImage.create({
    data: {
      src: String(body.src || ""),
      label: body.label ? String(body.label) : null,
      description: body.description ? String(body.description) : null,
      category: String(body.category || "General"),
      sortOrder: Number(body.sortOrder || 0),
    },
  });
  return NextResponse.json({ item }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.galleryImage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
