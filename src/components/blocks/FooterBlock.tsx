"use client";

type Props = {
  badgeSrc: string;
  company: string;
  year: string;
};

export function FooterBlock({ badgeSrc, company, year }: Props) {
  return (
    <footer className="msco-footer">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={badgeSrc} alt="" />
      <p>
        © {year} {company}. All rights reserved.
      </p>
    </footer>
  );
}
