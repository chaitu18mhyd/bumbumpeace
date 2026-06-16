"use client";

import { Calculator, Info, Menu, Newspaper, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Calculator", href: "#explore", Icon: Calculator },
  { label: "Blog", href: "#blog", Icon: Newspaper },
  { label: "About us", href: "#about", Icon: Info },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-sand bg-cream/90 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
      >
        {/* Left: hamburger (mobile) + brand + desktop links */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* Mobile toggle (hamburger <-> X animation) */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-sand bg-white text-ink transition hover:bg-sand md:hidden"
          >
            <span className="relative h-5 w-5">
              <Menu
                aria-hidden="true"
                className={`absolute inset-0 h-5 w-5 transition-all duration-300 ease-out ${
                  open
                    ? "rotate-90 scale-0 opacity-0"
                    : "rotate-0 scale-100 opacity-100"
                }`}
              />
              <X
                aria-hidden="true"
                className={`absolute inset-0 h-5 w-5 transition-all duration-300 ease-out ${
                  open
                    ? "rotate-0 scale-100 opacity-100"
                    : "-rotate-90 scale-0 opacity-0"
                }`}
              />
            </span>
          </button>

          <a
            href="#top"
            className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-ink"
            aria-label="BumBumSafe home"
          >
            <img
              src="/logo/bumbumsafe-logo-128.png"
              alt="BumBumSafe logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-xl object-cover"
            />
            <span className="hidden md:inline">BumBumSafe</span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-sand hover:text-ink"
                >
                  <link.Icon aria-hidden="true" className="h-4 w-4" />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right actions (always visible) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <a
            href="#signin"
            className="rounded-full px-3 py-2 text-sm font-semibold text-ink transition hover:bg-sand sm:px-4"
          >
            Sign In
          </a>
          <a
            href="#join"
            className="rounded-full bg-brand-500 px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-500/25 transition hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:px-4"
          >
            Join
          </a>
        </div>
      </nav>

      {/* Mobile menu (slide / fade animation) */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`overflow-hidden border-t border-sand bg-cream transition-all duration-300 ease-out md:hidden ${
          open
            ? "max-h-96 opacity-100"
            : "pointer-events-none max-h-0 border-transparent opacity-0"
        }`}
      >
        <div
          className={`px-4 py-3 transition-transform duration-300 ease-out ${
            open ? "translate-y-0" : "-translate-y-3"
          }`}
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? 0 : -1}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-sand"
                >
                  <link.Icon aria-hidden="true" className="h-4 w-4 text-muted" />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
