import { prisma } from "@/lib/prisma";
import { DEFAULT_GALLERY } from "@/lib/default-gallery";

/** If the gallery table is empty, restore the full MCSO asset catalog. */
export async function ensureGalleryDefaults() {
  const count = await prisma.galleryImage.count();
  if (count > 0) return { seeded: false, count };

  await prisma.galleryImage.createMany({ data: DEFAULT_GALLERY });
  const next = await prisma.galleryImage.count();
  return { seeded: true, count: next };
}
