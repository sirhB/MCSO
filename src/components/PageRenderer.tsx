"use client";

import { Render, type Data } from "@puckeditor/core";
import { puckConfig, type MCSOProps } from "@/lib/puck-config";
import { TemplateProvider } from "@/lib/template-context";
import type { DesignTemplateId } from "@/lib/design-templates";

export function PageRenderer({
  data,
  templateId = "editorial",
}: {
  data: Data<MCSOProps>;
  templateId?: DesignTemplateId;
}) {
  return (
    <TemplateProvider templateId={templateId}>
      <div className="msco-site" data-template={templateId}>
        <Render config={puckConfig} data={data} />
      </div>
    </TemplateProvider>
  );
}
