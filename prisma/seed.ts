import { PrismaClient } from "@prisma/client";
import { defaultHomeData } from "../src/lib/default-page-data";
import { DEFAULT_GALLERY } from "../src/lib/default-gallery";

const prisma = new PrismaClient();

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

  const galleryCount = await prisma.galleryImage.count();
  if (galleryCount < DEFAULT_GALLERY.length) {
    await prisma.galleryImage.deleteMany({});
    await prisma.galleryImage.createMany({ data: DEFAULT_GALLERY });
  }

  const userCount = await prisma.user.count();
  const finalCount = await prisma.galleryImage.count();
  console.log("Seed complete.");
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
