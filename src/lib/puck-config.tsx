import type { Config } from "@puckeditor/core";
import { HeaderBlock } from "@/components/blocks/HeaderBlock";
import { HeroBlock } from "@/components/blocks/HeroBlock";
import { AboutBlock } from "@/components/blocks/AboutBlock";
import { ServicesBlock } from "@/components/blocks/ServicesBlock";
import { GalleryBlock } from "@/components/blocks/GalleryBlock";
import { ContactBlock } from "@/components/blocks/ContactBlock";
import { FooterBlock } from "@/components/blocks/FooterBlock";
import { TextBlock } from "@/components/blocks/TextBlock";
import { ImageBlock } from "@/components/blocks/ImageBlock";
import { SpacerBlock } from "@/components/blocks/SpacerBlock";
import { CtaBlock } from "@/components/blocks/CtaBlock";

export type MCSOProps = {
  Header: {
    logoSrc: string;
    ctaLabel: string;
    ctaHref: string;
  };
  Hero: {
    subtitle: string;
    title: string;
    titleAccent: string;
    description: string;
    backgroundImage: string;
    primaryCta: string;
    primaryHref: string;
    secondaryCta: string;
    secondaryHref: string;
  };
  About: {
    sectionId: string;
    eyebrow: string;
    title: string;
    chapters: {
      tag: string;
      title: string;
      description: string;
      image: string;
      quote?: string;
    }[];
  };
  Services: {
    sectionId: string;
    title: string;
    description: string;
    items: {
      title: string;
      tag: string;
      description: string;
      image: string;
    }[];
  };
  Gallery: {
    sectionId: string;
    title: string;
    description: string;
    useDatabase: boolean;
    categories: string;
  };
  Contact: {
    sectionId: string;
    title: string;
    description: string;
    phone: string;
    location: string;
  };
  Footer: {
    badgeSrc: string;
    company: string;
    year: string;
  };
  Text: {
    eyebrow: string;
    heading: string;
    body: string;
    align: "left" | "center";
  };
  Image: {
    src: string;
    alt: string;
    caption: string;
    fullBleed: boolean;
  };
  Spacer: {
    size: "sm" | "md" | "lg";
  };
  CTA: {
    heading: string;
    body: string;
    buttonLabel: string;
    buttonHref: string;
  };
};

export const puckConfig: Config<MCSOProps> = {
  categories: {
    layout: {
      title: "Page Structure",
      components: ["Header", "Footer", "Spacer"],
    },
    marketing: {
      title: "Marketing Sections",
      components: ["Hero", "About", "Services", "Gallery", "Contact", "CTA"],
    },
    content: {
      title: "Simple Blocks",
      components: ["Text", "Image"],
    },
  },
  components: {
    Header: {
      label: "Site Header",
      fields: {
        logoSrc: { type: "text", label: "Logo image URL" },
        ctaLabel: { type: "text", label: "Button text" },
        ctaHref: { type: "text", label: "Button link" },
      },
      defaultProps: {
        logoSrc: "/assets/mcso_star_badge_new.png",
        ctaLabel: "Consultation",
        ctaHref: "#contact",
      },
      render: HeaderBlock,
    },
    Hero: {
      label: "Hero Banner",
      fields: {
        subtitle: { type: "text", label: "Small top line" },
        title: { type: "text", label: "Main headline" },
        titleAccent: { type: "text", label: "Gold accent line" },
        description: { type: "textarea", label: "Supporting paragraph" },
        backgroundImage: { type: "text", label: "Background image URL" },
        primaryCta: { type: "text", label: "Primary button text" },
        primaryHref: { type: "text", label: "Primary button link" },
        secondaryCta: { type: "text", label: "Secondary button text" },
        secondaryHref: { type: "text", label: "Secondary button link" },
      },
      defaultProps: {
        subtitle: "Licensed & Insured",
        title: "The Standard of",
        titleAccent: "Professional Protection.",
        description: "Veteran-owned private security.",
        backgroundImage: "/assets/mcso_patrol_header.jpg",
        primaryCta: "View Services",
        primaryHref: "#services",
        secondaryCta: "About Us",
        secondaryHref: "#about",
      },
      render: HeroBlock,
    },
    About: {
      label: "About / Owner Story",
      fields: {
        sectionId: { type: "text", label: "Section anchor id" },
        eyebrow: { type: "text", label: "Eyebrow" },
        title: { type: "text", label: "Section title" },
        chapters: {
          type: "array",
          label: "Story chapters",
          arrayFields: {
            tag: { type: "text", label: "Tag" },
            title: { type: "text", label: "Title" },
            description: { type: "textarea", label: "Description" },
            image: { type: "text", label: "Image URL" },
            quote: { type: "textarea", label: "Optional quote" },
          },
          getItemSummary: (item) => item.title || "Chapter",
        },
      },
      defaultProps: {
        sectionId: "about",
        eyebrow: "The Owner",
        title: "A Legacy of Service",
        chapters: [],
      },
      render: AboutBlock,
    },
    Services: {
      label: "Services Grid",
      fields: {
        sectionId: { type: "text", label: "Section anchor id" },
        title: { type: "text", label: "Title" },
        description: { type: "textarea", label: "Description" },
        items: {
          type: "array",
          label: "Services",
          arrayFields: {
            title: { type: "text", label: "Service name" },
            tag: { type: "text", label: "Tag" },
            description: { type: "textarea", label: "Description" },
            image: { type: "text", label: "Image URL" },
          },
          getItemSummary: (item) => item.title || "Service",
        },
      },
      defaultProps: {
        sectionId: "services",
        title: "Our Specialized Services.",
        description: "Elite protection for demanding environments.",
        items: [],
      },
      render: ServicesBlock,
    },
    Gallery: {
      label: "Image Gallery",
      fields: {
        sectionId: { type: "text", label: "Section anchor id" },
        title: { type: "text", label: "Title" },
        description: { type: "textarea", label: "Description" },
        useDatabase: {
          type: "radio",
          label: "Pull images from Gallery admin?",
          options: [
            { label: "Yes — use uploaded gallery", value: true },
            { label: "No", value: false },
          ],
        },
        categories: {
          type: "text",
          label: "Categories (comma-separated)",
        },
      },
      defaultProps: {
        sectionId: "gallery",
        title: "Precision. Operational Excellence.",
        description: "Fleet, team, and operations.",
        useDatabase: true,
        categories: "Tactical Fleet,Meet the Team,Executive Protection",
      },
      render: GalleryBlock,
    },
    Contact: {
      label: "Contact / Consultation Form",
      fields: {
        sectionId: { type: "text", label: "Section anchor id" },
        title: { type: "text", label: "Title" },
        description: { type: "textarea", label: "Description" },
        phone: { type: "text", label: "Phone number" },
        location: { type: "text", label: "Location line" },
      },
      defaultProps: {
        sectionId: "contact",
        title: "Request a Consultation",
        description: "Tell us about your security needs.",
        phone: "561-722-2209",
        location: "Licensed & Insured in Florida & New York",
      },
      render: ContactBlock,
    },
    Footer: {
      label: "Site Footer",
      fields: {
        badgeSrc: { type: "text", label: "Badge image URL" },
        company: { type: "text", label: "Company name" },
        year: { type: "text", label: "Copyright year" },
      },
      defaultProps: {
        badgeSrc: "/assets/mcso_star_badge_new.png",
        company: "Michael Colon Security Organization LLC",
        year: "2026",
      },
      render: FooterBlock,
    },
    Text: {
      label: "Text Block",
      fields: {
        eyebrow: { type: "text", label: "Eyebrow" },
        heading: { type: "text", label: "Heading" },
        body: { type: "textarea", label: "Body" },
        align: {
          type: "radio",
          label: "Alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
          ],
        },
      },
      defaultProps: {
        eyebrow: "",
        heading: "New section",
        body: "Add your text here.",
        align: "left",
      },
      render: TextBlock,
    },
    Image: {
      label: "Image",
      fields: {
        src: { type: "text", label: "Image URL" },
        alt: { type: "text", label: "Alt text" },
        caption: { type: "text", label: "Caption" },
        fullBleed: {
          type: "radio",
          label: "Full-bleed?",
          options: [
            { label: "Yes", value: true },
            { label: "No (contained)", value: false },
          ],
        },
      },
      defaultProps: {
        src: "/assets/mcso_patrol_header.jpg",
        alt: "MCSO",
        caption: "",
        fullBleed: true,
      },
      render: ImageBlock,
    },
    Spacer: {
      label: "Spacer",
      fields: {
        size: {
          type: "select",
          label: "Height",
          options: [
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
          ],
        },
      },
      defaultProps: { size: "md" },
      render: SpacerBlock,
    },
    CTA: {
      label: "Call to Action",
      fields: {
        heading: { type: "text", label: "Heading" },
        body: { type: "textarea", label: "Body" },
        buttonLabel: { type: "text", label: "Button text" },
        buttonHref: { type: "text", label: "Button link" },
      },
      defaultProps: {
        heading: "Ready for professional protection?",
        body: "Schedule a consultation with MCSO today.",
        buttonLabel: "Get in Touch",
        buttonHref: "#contact",
      },
      render: CtaBlock,
    },
  },
};
