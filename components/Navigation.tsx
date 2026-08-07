"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/wordle", label: "Wordle" },
  { href: "/word-search", label: "Word Search" },
  { href: "/about", label: "About" },
  { href: "/settings", label: "Settings" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="main-navigation" aria-label="Main navigation">
      <button
        className="menu-button"
        type="button"
        aria-expanded={open}
        aria-controls="navigation-links"
        onClick={() => setOpen((current) => !current)}
      >
        <span aria-hidden="true">☰</span>
        <span>Menu</span>
      </button>

      <ul
        id="navigation-links"
        className={open ? "navigation-list open" : "navigation-list"}
      >
        {links.map((link) => (
          <li key={link.href}>
            <Link
              className={pathname === link.href ? "active" : ""}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}