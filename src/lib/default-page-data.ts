import type { Data } from "@puckeditor/core";
import type { MCSOProps } from "@/lib/puck-config";

/** Default published homepage matching MCSO marketing content */
export const defaultHomeData: Data<MCSOProps> = {
  root: { props: { title: "MCSO Security Group" } },
  content: [
    {
      type: "Header",
      props: {
        id: "header-1",
        logoSrc: "/assets/mcso_star_badge_new.png",
        ctaLabel: "Consultation",
        ctaHref: "#contact",
      },
    },
    {
      type: "Hero",
      props: {
        id: "hero-1",
        brandName: "MCSO",
        subtitle: "Licensed & Insured // Florida & New York",
        title: "The Standard of",
        titleAccent: "Professional Protection.",
        description:
          "Veteran-owned and operated. We provide comprehensive private security solutions built on reliability, detailed planning, and steadfast commitment to our clients.",
        backgroundImage: "/assets/mcso_patrol_header.jpg",
        primaryCta: "View Services",
        primaryHref: "#services",
        secondaryCta: "About Us",
        secondaryHref: "#about",
      },
    },
    {
      type: "About",
      props: {
        id: "about-1",
        sectionId: "about",
        eyebrow: "The Owner",
        title: "A Legacy of Service",
        chapters: [
          {
            tag: "Foundations & Service",
            title: "A Calling for Service.",
            description:
              "Michael Colon was born in Brooklyn, NY and came from humble beginnings. After enlisting at 19 years old and honorably serving our country in the United States Navy, Michael had his professional trajectory in focus, starting his career in high-profile Executive Protection.",
            image: "/assets/michael_new_profile.jpg",
          },
          {
            tag: "Law Enforcement",
            title: "Natural Born Leader.",
            description:
              "At 36 years old, Michael joined the New York City Police Department's Aux Division. Seen by his superiors as a natural born leader, he was shortly thereafter promoted to the rank of sergeant, then lieutenant.",
            image: "/assets/michael_nypd.jpg",
          },
          {
            tag: "Tactical Excellence",
            title: "Exceeding Expectations.",
            description:
              "While managing 33 armed security officers and onsite medical personnel at a high-end residential community, Michael dug deep into what was missing in today's private security market. In 2022, he opened his own firm.",
            image: "/assets/michael_new_tactical.jpg",
          },
          {
            tag: "The Mission",
            title: "Modern Leadership.",
            description:
              "Today, Michael leads MCSO with a hands-on approach, ensuring that every deployment reflects his commitment to excellence, integrity, and client safety.",
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
        title: "Our Specialized Services.",
        description:
          "Elite protection designed for the most demanding environments. We combine veteran expertise with strategic planning to deliver safety as a standard.",
        items: [
          {
            title: "Executive Protection & Bodyguard Services",
            tag: "High Level",
            description:
              "Discreet, multi-layered protection for executives, high-profile individuals, and private clients.",
            image: "/assets/executive/exec_1.jpg",
          },
          {
            title: "Residential Property Protection",
            tag: "Domestic",
            description:
              "Ensuring absolute peace of mind for residents through elite onsite security and community patrol services.",
            image: "/assets/fleet/fleet_5.jpg",
          },
          {
            title: "Commercial & Industrial Security",
            tag: "Corporate",
            description:
              "Scalable infrastructure security for corporate campuses, medical facilities, and high-end retail.",
            image: "/assets/fleet/fleet_4.jpg",
          },
          {
            title: "Special Events & Crowd Management",
            tag: "Special Ops",
            description:
              "Professional event security coordination for large-scale gatherings and high-stakes venues.",
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
        title: "Precision. Operational Excellence.",
        description:
          "A look inside our fleet, field teams, and executive protection operations.",
        useDatabase: true,
        categories: "Tactical Fleet,Meet the Team,Executive Protection",
      },
    },
    {
      type: "Contact",
      props: {
        id: "contact-1",
        sectionId: "contact",
        title: "Request a Consultation",
        description:
          "Tell us about your security needs. Our team will follow up promptly.",
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
