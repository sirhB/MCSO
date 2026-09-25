"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/contacts", label: "Contact Book" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/editor", label: "Site Editor" },
];

export function AdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <aside className={`admin-nav ${open ? "is-open" : ""}`}>
      <div className="admin-nav__top">
        <div className="admin-nav__brand">MCSO Admin</div>
        <button
          type="button"
          className="admin-nav__toggle"
          aria-label={open ? "Close admin menu" : "Open admin menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className="admin-nav__links">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? "is-active" : ""}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <Link href="/" target="_blank" onClick={() => setOpen(false)}>
          View live site ↗
        </Link>
        <button
          type="button"
          className="admin-btn admin-btn--ghost admin-nav__signout"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
