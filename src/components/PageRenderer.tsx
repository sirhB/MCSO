"use client";

import { Render, type Data } from "@puckeditor/core";
import { puckConfig, type MCSOProps } from "@/lib/puck-config";

export function PageRenderer({ data }: { data: Data<MCSOProps> }) {
  return (
    <div className="msco-site">
      <Render config={puckConfig} data={data} />
    </div>
  );
}
