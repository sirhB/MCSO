import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { defaultHomeData } from "../src/lib/default-page-data";
import { DEFAULT_GALLERY } from "../src/lib/default-gallery";
import { DEMO_ADMIN } from "../src/lib/admin-accounts";

const prisma = new PrismaClient();

async function ensureDemoAdmin() {
  const existing = await prisma.user.findUnique({
    where: { email: DEMO_ADMIN.email },
  });
  const passwordHash = await hash(DEMO_ADMIN.password, 10);

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        name: DEMO_ADMIN.name,
        passwordHash,
        isDemo: true,
      },
    });
    return;
  }

  await prisma.user.create({
    data: {
      name: DEMO_ADMIN.name,
      email: DEMO_ADMIN.email,
      passwordHash,
      isDemo: true,
    },
  });
}

async function main() {
  const pageJson = JSON.stringify(defaultHomeData);
  const existingPage = await prisma.sitePage.findUnique({ where: { slug: "home" } });
  if (!existingPage) {
    await prisma.sitePage.create({
      data: {
        slug: "home",
        title: "MCSO Security Group",
        draftData: pageJson,
        publishedData: pageJson,
        publishedAt: new Date(),
      },
    });
  }

  // Drop legacy per-template pages if present
  await prisma.sitePage.deleteMany({
    where: { slug: { in: ["template-editorial", "template-authority"] } },
  });

  const galleryCount = await prisma.galleryImage.count();
  if (galleryCount < DEFAULT_GALLERY.length) {
    await prisma.galleryImage.deleteMany({});
    await prisma.galleryImage.createMany({ data: DEFAULT_GALLERY });
  }

  await ensureDemoAdmin();

  const ownerCount = await prisma.user.count({ where: { isDemo: false } });
  const finalCount = await prisma.galleryImage.count();
  console.log("Seed complete.");
  console.log(`Gallery images: ${finalCount}`);
  console.log(`Demo admin: ${DEMO_ADMIN.email} / ${DEMO_ADMIN.password}`);
  if (ownerCount === 0) {
    console.log("No owner admin yet — visit /admin/setup so Michael can create his account.");
  } else {
    console.log(`Owner admin accounts: ${ownerCount}`);
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
