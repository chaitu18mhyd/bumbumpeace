"use client";

import { useState } from "react";

const navLinks = [
  { label: "Calculator", href: "#explore" },
  { label: "Blog", href: "#blog" },
  { label: "About us", href: "#about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-sand bg-cream/90 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
      >
        {/* Brand + left links */}
        <div className="flex items-center gap-6">
          <a
            href="#top"
            className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-ink"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-500 text-sm font-black text-white">
              R
            </span>
            RetireWell
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-sand hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right actions */}
        <div className="hidden items-center gap-2 md:flex">
          <a
            href="#signin"
            className="rounded-full px-4 py-2 text-sm font-semibold text-ink transition hover:bg-sand"
          >
            Sign In
          </a>
          <a
            href="#join"
            className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-500/25 transition hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            Join
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-sand bg-white text-ink transition hover:bg-sand md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className="border-t border-sand bg-cream px-4 py-3 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-sand"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex flex-col gap-2 border-t border-sand pt-3">
            <a
              href="#signin"
              onClick={() => setOpen(false)}
              className="rounded-full border border-sand px-4 py-2.5 text-center text-sm font-semibold text-ink transition hover:bg-sand"
            >
              Sign In
            </a>
            <a
              href="#join"
              onClick={() => setOpen(false)}
              className="rounded-full bg-brand-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-brand-600"
            >
              Join
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
