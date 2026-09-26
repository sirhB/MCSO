import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import {
  DESIGN_TEMPLATES,
  isDesignTemplateId,
} from "@/lib/design-templates";
import {
  ensureTemplatePages,
  getActiveTemplateId,
  setActiveTemplateId,
} from "@/lib/site-settings";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await ensureTemplatePages();
    const activeTemplate = await getActiveTemplateId();
    const pages = await prisma.sitePage.findMany({
      where: {
        slug: { in: DESIGN_TEMPLATES.map((t) => t.pageSlug) },
      },
    });

    return NextResponse.json({
      activeTemplate,
      templates: DESIGN_TEMPLATES.map((meta) => {
        const page = pages.find((p) => p.slug === meta.pageSlug);
        return {
          id: meta.id,
          name: meta.name,
          tagline: meta.tagline,
          description: meta.description,
          pageSlug: meta.pageSlug,
          previewTone: meta.previewTone,
          highlights: meta.highlights,
          isActive: meta.id === activeTemplate,
          publishedAt: page?.publishedAt ?? null,
          updatedAt: page?.updatedAt ?? null,
        };
      }),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not load design templates." },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const templateId = body.templateId as string;
  if (!isDesignTemplateId(templateId)) {
    return NextResponse.json({ error: "Unknown template." }, { status: 400 });
  }

  await ensureTemplatePages();
  await setActiveTemplateId(templateId);

  const { scheduleBackup } = await import("@/lib/backup");
  scheduleBackup();

  return NextResponse.json({ ok: true, activeTemplate: templateId });
}
