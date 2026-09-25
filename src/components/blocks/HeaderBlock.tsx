"use client";

type Props = {
  logoSrc: string;
  ctaLabel: string;
  ctaHref: string;
};

export function HeaderBlock({ logoSrc, ctaLabel, ctaHref }: Props) {
  return (
    <header className="msco-header">
      <a href="#top" className="msco-header__brand" aria-label="MCSO home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="MCSO" />
      </a>
      <nav className="msco-header__nav" aria-label="Primary">
        <a href="#about">The Owner</a>
        <a href="#services">Services</a>
        <a href="#gallery">Gallery</a>
        <a href={ctaHref} className="msco-header__cta">
          {ctaLabel}
        </a>
      </nav>
    </header>
  );
}
