import { Render } from "@puckeditor/core/rsc";
import type { Data } from "@puckeditor/core";
import { prisma } from "@/lib/prisma";
import { puckConfig, type MCSOProps } from "@/lib/puck-config";
import { defaultHomeData } from "@/lib/default-page-data";

export const dynamic = "force-dynamic";

async function getPublishedHome(): Promise<Data<MCSOProps>> {
  try {
    const page = await prisma.sitePage.findUnique({ where: { slug: "home" } });
    if (page?.publishedData) {
      return JSON.parse(page.publishedData) as Data<MCSOProps>;
    }
  } catch {
    // DB may not be ready during first build
  }
  return defaultHomeData;
}

export default async function HomePage() {
  const data = await getPublishedHome();
  return <Render config={puckConfig} data={data} />;
}
