import type { Data } from "@puckeditor/core";
import { type MCSOProps } from "@/lib/puck-config";
import { PageRenderer } from "@/components/PageRenderer";
import { getPublishedTemplateData } from "@/lib/site-settings";
import { isDesignTemplateId } from "@/lib/design-templates";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function HomePage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = (await searchParams) || {};
  const previewRaw = params.previewTemplate;
  const previewValue = Array.isArray(previewRaw) ? previewRaw[0] : previewRaw;
  const previewId =
    previewValue && isDesignTemplateId(previewValue) ? previewValue : undefined;

  const { templateId, data } = await getPublishedTemplateData(previewId);
  return (
    <PageRenderer
      data={data as Data<MCSOProps>}
      templateId={templateId}
    />
  );
}
