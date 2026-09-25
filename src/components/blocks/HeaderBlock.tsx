"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  logoSrc: string;
  ctaLabel: string;
  ctaHref: string;
};

const NAV_LINKS = [
  { href: "#about", label: "The Owner" },
  { href: "#services", label: "Services" },
  { href: "#gallery", label: "Gallery" },
];

export function HeaderBlock({ logoSrc, ctaLabel, ctaHref }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  const drawer =
    mounted &&
    createPortal(
      <div
        id="msco-mobile-nav"
        className={`msco-header__drawer ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        <nav className="msco-header__nav msco-header__nav--mobile" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={closeMenu}>
              {link.label}
            </a>
          ))}
          <a href={ctaHref} className="msco-header__cta" onClick={closeMenu}>
            {ctaLabel}
          </a>
        </nav>
      </div>,
      document.body,
    );

  return (
    <>
      <header className={`msco-header ${open ? "is-open" : ""}`}>
        <a href="#top" className="msco-header__brand" aria-label="MCSO home" onClick={closeMenu}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="MCSO" />
        </a>

        <nav className="msco-header__nav msco-header__nav--desktop" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <a href={ctaHref} className="msco-header__cta">
            {ctaLabel}
          </a>
        </nav>

        <button
          type="button"
          className="msco-header__toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="msco-mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>
      {drawer}
    </>
  );
}
