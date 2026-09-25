import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { defaultHomeData } from "../src/lib/default-page-data";
import { DEFAULT_GALLERY } from "../src/lib/default-gallery";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@mcso.local";
  const password = process.env.ADMIN_PASSWORD || "MCSOAdmin2026!";
  const name = process.env.ADMIN_NAME || "MCSO Admin";

  const passwordHash = await hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name },
    create: { email, passwordHash, name },
  });

  const pageJson = JSON.stringify(defaultHomeData);
  await prisma.sitePage.upsert({
    where: { slug: "home" },
    update: {
      draftData: pageJson,
      publishedData: pageJson,
      publishedAt: new Date(),
    },
    create: {
      slug: "home",
      title: "MCSO Security Group",
      draftData: pageJson,
      publishedData: pageJson,
      publishedAt: new Date(),
    },
  });

  // Always restore the full default catalog when missing or incomplete
  const galleryCount = await prisma.galleryImage.count();
  if (galleryCount < DEFAULT_GALLERY.length) {
    await prisma.galleryImage.deleteMany({});
    await prisma.galleryImage.createMany({ data: DEFAULT_GALLERY });
  }

  const finalCount = await prisma.galleryImage.count();
  console.log("Seed complete.");
  console.log(`Gallery images: ${finalCount}`);
  console.log(`Admin login: ${email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
