import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { defaultHomeData } from "../src/lib/default-page-data";
import { DEFAULT_GALLERY } from "../src/lib/default-gallery";
import { OWNER_ADMIN } from "../src/lib/admin-accounts";

const prisma = new PrismaClient();

async function ensureOwnerAdmin() {
  const email = OWNER_ADMIN.email.toLowerCase();
  const passwordHash = await hash(OWNER_ADMIN.password, 10);
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        name: OWNER_ADMIN.name,
        passwordHash,
        isDemo: false,
      },
    });
    return;
  }

  await prisma.user.create({
    data: {
      name: OWNER_ADMIN.name,
      email,
      passwordHash,
      isDemo: false,
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

  await ensureOwnerAdmin();

  const ownerCount = await prisma.user.count({ where: { isDemo: false } });
  const finalCount = await prisma.galleryImage.count();
  console.log("Seed complete.");
  console.log(`Gallery images: ${finalCount}`);
  console.log(
    `Owner admin ready: ${OWNER_ADMIN.email} / ${OWNER_ADMIN.password} (username ${OWNER_ADMIN.name})`,
  );
  console.log(`Owner admin accounts: ${ownerCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
