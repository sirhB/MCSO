import { prisma } from "@/lib/prisma";
import {
  ACTIVE_TEMPLATE_KEY,
  DEFAULT_TEMPLATE_ID,
  DESIGN_TEMPLATES,
  getTemplateMeta,
  isDesignTemplateId,
  type DesignTemplateId,
} from "@/lib/design-templates";

export async function getActiveTemplateId(): Promise<DesignTemplateId> {
  try {
    const row = await prisma.siteSetting.findUnique({
      where: { key: ACTIVE_TEMPLATE_KEY },
    });
    if (row && isDesignTemplateId(row.value)) {
      return row.value;
    }
  } catch {
    // DB may be unavailable during first boot
  }
  return DEFAULT_TEMPLATE_ID;
}

export async function setActiveTemplateId(id: DesignTemplateId) {
  await prisma.siteSetting.upsert({
    where: { key: ACTIVE_TEMPLATE_KEY },
    update: { value: id },
    create: { key: ACTIVE_TEMPLATE_KEY, value: id },
  });
}

/** Ensure every design template has its own SitePage row with independent content. */
export async function ensureTemplatePages() {
  const legacyHome = await prisma.sitePage.findUnique({ where: { slug: "home" } });

  for (const template of DESIGN_TEMPLATES) {
    const existing = await prisma.sitePage.findUnique({
      where: { slug: template.pageSlug },
    });
    if (existing) continue;

    // Seed editorial from legacy `home` content when present; otherwise use defaults.
    const seedJson =
      template.id === "editorial" && legacyHome
        ? legacyHome.publishedData || legacyHome.draftData
        : JSON.stringify(template.defaultData);

    await prisma.sitePage.create({
      data: {
        slug: template.pageSlug,
        title: `MCSO — ${template.name}`,
        draftData: seedJson,
        publishedData: seedJson,
        publishedAt: new Date(),
      },
    });
  }

  const active = await prisma.siteSetting.findUnique({
    where: { key: ACTIVE_TEMPLATE_KEY },
  });
  if (!active) {
    await prisma.siteSetting.create({
      data: { key: ACTIVE_TEMPLATE_KEY, value: DEFAULT_TEMPLATE_ID },
    });
  }
}

export async function getPublishedTemplateData(templateId?: DesignTemplateId) {
  const id = templateId || (await getActiveTemplateId());
  const meta = getTemplateMeta(id);

  try {
    await ensureTemplatePages();
    const page = await prisma.sitePage.findUnique({
      where: { slug: meta.pageSlug },
    });
    if (page?.publishedData) {
      return {
        templateId: id,
        meta,
        data: JSON.parse(page.publishedData),
      };
    }
  } catch {
    // fall through to defaults
  }

  return {
    templateId: id,
    meta,
    data: meta.defaultData,
  };
}
