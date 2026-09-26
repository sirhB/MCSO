import type { Data } from "@puckeditor/core";
import type { MCSOProps } from "@/lib/puck-config";

/** Default published homepage — redesigned daylight layout */
export const defaultHomeData: Data<MCSOProps> = {
  root: { props: { title: "MCSO Security Group" } },
  content: [
    {
      type: "Header",
      props: {
        id: "header-1",
        logoSrc: "/assets/mcso_star_badge_new.png",
        ctaLabel: "Request Consultation",
        ctaHref: "#contact",
      },
    },
    {
      type: "Hero",
      props: {
        id: "hero-1",
        brandName: "MCSO",
        subtitle: "Licensed & Insured · Florida & New York",
        title: "Professional protection,",
        titleAccent: "executed with discipline.",
        description:
          "Veteran-owned private security built on reliability, detailed planning, and steadfast commitment — for clients who expect the standard, not the average.",
        backgroundImage: "/assets/mcso_patrol_header.jpg",
        primaryCta: "Explore Services",
        primaryHref: "#services",
        secondaryCta: "Meet the Owner",
        secondaryHref: "#about",
      },
    },
    {
      type: "About",
      props: {
        id: "about-1",
        sectionId: "about",
        eyebrow: "Leadership",
        title: "Forged in service. Led with integrity.",
        chapters: [
          {
            tag: "Foundations",
            title: "From Brooklyn to the front line of protection.",
            description:
              "Michael Colon grew up in Brooklyn and enlisted in the United States Navy at 19. After honorable service, he focused his career on high-profile executive protection — where preparation and presence decide outcomes.",
            image: "/assets/michael_new_profile.jpg",
          },
          {
            tag: "Law Enforcement",
            title: "NYPD leadership under pressure.",
            description:
              "At 36, Michael joined the NYPD Auxiliary Division. Recognized as a natural leader, he advanced to sergeant and then lieutenant — sharpening the command instincts that define MCSO today.",
            image: "/assets/michael_nypd.jpg",
          },
          {
            tag: "Tactical Command",
            title: "Seeing what the industry was missing.",
            description:
              "While leading 33 armed officers and onsite medical staff at a high-end residential community, Michael identified the gaps in modern private security. In 2022, he founded MCSO to close them.",
            image: "/assets/michael_new_tactical.jpg",
          },
          {
            tag: "The Standard",
            title: "Hands-on leadership. Zero shortcuts.",
            description:
              "Michael still leads from the front — ensuring every deployment reflects excellence, integrity, and client safety. The firm’s culture starts with his word.",
            image: "/assets/michael_modern_leadership.jpg",
            quote:
              "Be the example, stand by your word and keep your promises to your employees, partners and clients.",
          },
        ],
      },
    },
    {
      type: "Services",
      props: {
        id: "services-1",
        sectionId: "services",
        title: "Protection built for demanding environments.",
        description:
          "From discreet executive details to scalable site security, MCSO pairs veteran expertise with disciplined planning — so safety is the baseline, not the upsell.",
        items: [
          {
            title: "Executive Protection & Bodyguard Services",
            tag: "High Level",
            description:
              "Multi-layered, discreet coverage for executives, public figures, and private clients who require calm presence and decisive response.",
            image: "/assets/executive/exec_1.jpg",
          },
          {
            title: "Residential Property Protection",
            tag: "Domestic",
            description:
              "Elite onsite security and community patrol designed for absolute peace of mind at private residences and gated communities.",
            image: "/assets/fleet/fleet_5.jpg",
          },
          {
            title: "Commercial & Industrial Security",
            tag: "Corporate",
            description:
              "Scalable protection for campuses, medical facilities, and premium retail — structured for risk, staffing, and continuity.",
            image: "/assets/fleet/fleet_4.jpg",
          },
          {
            title: "Special Events & Crowd Management",
            tag: "Special Ops",
            description:
              "Coordinated event security for high-stakes venues and large gatherings, with clear command and calm crowd control.",
            image: "/assets/field/56.jpg",
          },
        ],
      },
    },
    {
      type: "Gallery",
      props: {
        id: "gallery-1",
        sectionId: "gallery",
        title: "Operations in focus.",
        description:
          "Fleet readiness, field teams, and executive protection — a clear look at how MCSO shows up.",
        useDatabase: true,
        categories: "Tactical Fleet,Meet the Team,Executive Protection",
      },
    },
    {
      type: "Contact",
      props: {
        id: "contact-1",
        sectionId: "contact",
        title: "Start a confidential consultation.",
        description:
          "Share your security needs. Our team responds promptly with a clear next step — not a generic pitch.",
        phone: "561-722-2209",
        location: "Licensed & Insured in Florida & New York",
      },
    },
    {
      type: "Footer",
      props: {
        id: "footer-1",
        badgeSrc: "/assets/mcso_star_badge_new.png",
        company: "Michael Colon Security Organization LLC",
        year: "2026",
      },
    },
  ],
};
