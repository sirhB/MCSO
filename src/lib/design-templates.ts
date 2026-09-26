import type { Data } from "@puckeditor/core";
import type { MCSOProps } from "@/lib/puck-config";
import { defaultHomeData } from "@/lib/default-page-data";
import { authorityHomeData } from "@/lib/default-page-data-authority";

export type DesignTemplateId = "editorial" | "authority";

export type DesignTemplateMeta = {
  id: DesignTemplateId;
  name: string;
  tagline: string;
  description: string;
  /** SitePage slug that stores this template's independent content */
  pageSlug: string;
  previewTone: "dark" | "light";
  highlights: string[];
  defaultData: Data<MCSOProps>;
};

export const DESIGN_TEMPLATES: DesignTemplateMeta[] = [
  {
    id: "editorial",
    name: "Editorial Night",
    tagline: "Current dark gold editorial",
    description:
      "Centered cinematic hero, chapter storytelling, and immersive service panels — the original MCSO look.",
    pageSlug: "template-editorial",
    previewTone: "dark",
    highlights: [
      "Full-bleed night ops hero",
      "Owner story chapters",
      "Feature-first services grid",
    ],
    defaultData: defaultHomeData,
  },
  {
    id: "authority",
    name: "Daylight Authority",
    tagline: "New prestige daylight redesign",
    description:
      "A lighter, architectural layout with a left-anchored hero, timeline legacy story, and stacked service bands — same brand story, new presentation.",
    pageSlug: "template-authority",
    previewTone: "light",
    highlights: [
      "Brand-forward daylight hero",
      "Vertical service timeline",
      "Stacked operational bands",
    ],
    defaultData: authorityHomeData,
  },
];

export const DEFAULT_TEMPLATE_ID: DesignTemplateId = "editorial";

export const ACTIVE_TEMPLATE_KEY = "activeTemplate";

export function getTemplateMeta(id: string | null | undefined): DesignTemplateMeta {
  return (
    DESIGN_TEMPLATES.find((t) => t.id === id) ||
    DESIGN_TEMPLATES.find((t) => t.id === DEFAULT_TEMPLATE_ID)!
  );
}

export function isDesignTemplateId(value: string): value is DesignTemplateId {
  return DESIGN_TEMPLATES.some((t) => t.id === value);
}

export function pageSlugForTemplate(id: DesignTemplateId): string {
  return getTemplateMeta(id).pageSlug;
}
