import { PrismaClient } from "@prisma/client";
import { DEFAULT_GALLERY } from "../src/lib/default-gallery";
import {
  ACTIVE_TEMPLATE_KEY,
  DEFAULT_TEMPLATE_ID,
  DESIGN_TEMPLATES,
} from "../src/lib/design-templates";

const prisma = new PrismaClient();

async function main() {
  const legacyHome = await prisma.sitePage.findUnique({ where: { slug: "home" } });

  for (const template of DESIGN_TEMPLATES) {
    const existing = await prisma.sitePage.findUnique({
      where: { slug: template.pageSlug },
    });
    if (existing) continue;

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

  // Keep legacy `home` in sync with editorial for older bookmarks/tools.
  const editorial = await prisma.sitePage.findUnique({
    where: { slug: "template-editorial" },
  });
  if (editorial) {
    await prisma.sitePage.upsert({
      where: { slug: "home" },
      update: {
        title: editorial.title,
        draftData: editorial.draftData,
        publishedData: editorial.publishedData,
        publishedAt: editorial.publishedAt,
      },
      create: {
        slug: "home",
        title: editorial.title,
        draftData: editorial.draftData,
        publishedData: editorial.publishedData,
        publishedAt: editorial.publishedAt ?? new Date(),
      },
    });
  }

  await prisma.siteSetting.upsert({
    where: { key: ACTIVE_TEMPLATE_KEY },
    update: {},
    create: { key: ACTIVE_TEMPLATE_KEY, value: DEFAULT_TEMPLATE_ID },
  });

  const galleryCount = await prisma.galleryImage.count();
  if (galleryCount < DEFAULT_GALLERY.length) {
    await prisma.galleryImage.deleteMany({});
    await prisma.galleryImage.createMany({ data: DEFAULT_GALLERY });
  }

  const userCount = await prisma.user.count();
  const finalCount = await prisma.galleryImage.count();
  console.log("Seed complete.");
  console.log(`Design templates: ${DESIGN_TEMPLATES.map((t) => t.id).join(", ")}`);
  console.log(`Gallery images: ${finalCount}`);
  if (userCount === 0) {
    console.log("No admin yet — visit /admin/setup to create your username and password.");
  } else {
    console.log(`Admin accounts: ${userCount}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
