"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/contacts", label: "Contact Book" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/editor", label: "Site Editor" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <aside className="admin-nav">
      <div className="admin-nav__brand">MCSO Admin</div>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={pathname === link.href ? "is-active" : ""}
        >
          {link.label}
        </Link>
      ))}
      <Link href="/" target="_blank">
        View live site ↗
      </Link>
      <button
        type="button"
        className="admin-btn admin-btn--ghost"
        style={{ marginTop: "auto", color: "#fff", borderColor: "#44403c" }}
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
      >
        Sign out
      </button>
    </aside>
  );
}
