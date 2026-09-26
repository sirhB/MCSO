import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { defaultHomeData } from "@/lib/default-page-data";
import { DESIGN_TEMPLATES } from "@/lib/design-templates";
import { ensureTemplatePages } from "@/lib/site-settings";

function defaultDataForSlug(slug: string) {
  const template = DESIGN_TEMPLATES.find((t) => t.pageSlug === slug);
  if (template) return template.defaultData;
  if (slug === "home") return defaultHomeData;
  return defaultHomeData;
}

export async function GET(req: NextRequest) {
  const slug = new URL(req.url).searchParams.get("slug") || "home";

  try {
    if (slug.startsWith("template-")) {
      await ensureTemplatePages();
    }
  } catch {
    // continue with defaults
  }

  const page = await prisma.sitePage.findUnique({ where: { slug } });
  if (!page) {
    const fallback = defaultDataForSlug(slug);
    return NextResponse.json({
      page: {
        slug,
        title: "MCSO Security Group",
        draftData: fallback,
        publishedData: fallback,
      },
    });
  }
  return NextResponse.json({
    page: {
      ...page,
      draftData: JSON.parse(page.draftData),
      publishedData: page.publishedData ? JSON.parse(page.publishedData) : null,
    },
  });
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const slug = body.slug || "home";
  const title = body.title || "MCSO Security Group";
  const draftData = JSON.stringify(body.data);
  const publish = Boolean(body.publish);

  const page = await prisma.sitePage.upsert({
    where: { slug },
    update: {
      title,
      draftData,
      ...(publish
        ? { publishedData: draftData, publishedAt: new Date() }
        : {}),
    },
    create: {
      slug,
      title,
      draftData,
      publishedData: publish ? draftData : null,
      publishedAt: publish ? new Date() : null,
    },
  });

  // Keep legacy home mirrored when editorial is saved.
  if (slug === "template-editorial" && publish) {
    await prisma.sitePage.upsert({
      where: { slug: "home" },
      update: {
        title,
        draftData,
        publishedData: draftData,
        publishedAt: new Date(),
      },
      create: {
        slug: "home",
        title,
        draftData,
        publishedData: draftData,
        publishedAt: new Date(),
      },
    });
  }

  const { scheduleBackup } = await import("@/lib/backup");
  scheduleBackup();

  return NextResponse.json({
    ok: true,
    publishedAt: page.publishedAt,
  });
}
