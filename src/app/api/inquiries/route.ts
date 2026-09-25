import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const createSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional().nullable(),
  message: z.string().min(1).max(5000),
});

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const inquiries = await prisma.inquiry.findMany({
    include: {
      contact: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ inquiries });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createSchema.parse(body);

    const email = parsed.email.toLowerCase().trim();
    const contact = await prisma.contact.upsert({
      where: { email },
      update: {
        name: parsed.name.trim(),
        phone: parsed.phone?.trim() || undefined,
      },
      create: {
        name: parsed.name.trim(),
        email,
        phone: parsed.phone?.trim() || null,
      },
    });

    const inquiry = await prisma.inquiry.create({
      data: {
        name: parsed.name.trim(),
        email,
        phone: parsed.phone?.trim() || null,
        message: parsed.message.trim(),
        status: "NEW",
        contactId: contact.id,
        statusHistory: {
          create: {
            fromStatus: null,
            toStatus: "NEW",
            note: "Inquiry submitted from website",
          },
        },
      },
    });

    return NextResponse.json({ ok: true, id: inquiry.id }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Could not save inquiry." }, { status: 500 });
  }
}
