"use client";

import { useTemplate } from "@/lib/template-context";

type Props = {
  badgeSrc: string;
  company: string;
  year: string;
};

export function FooterBlock({ badgeSrc, company, year }: Props) {
  const template = useTemplate();

  return (
    <footer
      className={`msco-footer ${template === "authority" ? "msco-footer--authority" : ""}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={badgeSrc} alt="" />
      <p>
        © {year} {company}. All rights reserved.
      </p>
    </footer>
  );
}
