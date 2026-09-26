"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { DesignTemplateId } from "@/lib/design-templates";

const TemplateContext = createContext<DesignTemplateId>("editorial");

export function TemplateProvider({
  templateId,
  children,
}: {
  templateId: DesignTemplateId;
  children: ReactNode;
}) {
  return (
    <TemplateContext.Provider value={templateId}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplate(): DesignTemplateId {
  return useContext(TemplateContext);
}
