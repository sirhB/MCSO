import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { defaultHomeData } from "@/lib/default-page-data";

export async function GET(req: NextRequest) {
  const slug = new URL(req.url).searchParams.get("slug") || "home";
  const page = await prisma.sitePage.findUnique({ where: { slug } });
  if (!page) {
    return NextResponse.json({
      page: {
        slug: "home",
        title: "MCSO Security Group",
        draftData: defaultHomeData,
        publishedData: defaultHomeData,
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

  const { scheduleBackup } = await import("@/lib/backup");
  scheduleBackup();

  return NextResponse.json({
    ok: true,
    publishedAt: page.publishedAt,
  });
}
