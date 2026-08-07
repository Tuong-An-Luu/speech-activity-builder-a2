"use client";

import Link from "next/link";
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

  return (
    <nav aria-label="Main navigation">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="main-navigation"
        onClick={() => setOpen(!open)}
      >
        Menu
      </button>

      <ul id="main-navigation">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}