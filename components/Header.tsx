"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "ACCUEIL", href: "#" },
  { label: "À PROPOS", href: "#apropos" },
  { label: "SERVICES", href: "#services", dropdown: true },
  { label: "BLOG", href: "#blog" },
  { label: "RESSOURCES", href: "#ressources", dropdown: true },
  { label: "BOUTIQUE", href: "#boutique" },
  { label: "CONTACT", href: "#contact" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 overflow-visible border-b border-sand/60 bg-white/95 backdrop-blur-sm">
      <div className="site-header-bar mx-auto flex h-[72px] max-w-[1280px] items-center justify-between gap-3 px-4 min-[1000px]:px-8">
        {/* Desktop nav logo (≥1000px) */}
        <Link
          href="/"
          className="relative z-10 hidden h-12 w-[106px] shrink-0 items-center min-[1000px]:flex sm:h-14 sm:w-[124px]"
        >
          <Image
            src="/wellnest-logo-nav.png"
            alt="WELLNEST — بيت العافية"
            width={180}
            height={95}
            className="h-12 w-auto origin-left scale-[1.75] object-contain sm:h-14"
            priority
          />
        </Link>

        {/* Mobile nav logo (<1000px) */}
        <Link href="/" className="relative z-10 flex shrink-0 items-center min-[1000px]:hidden">
          <Image
            src="/wellnest-logo-nav-mobile.png"
            alt="WELLNEST — بيت العافية"
            width={120}
            height={120}
            className="h-[52px] w-auto object-contain"
            priority
          />
        </Link>

        {/* Full desktop nav — ≥1000px */}
        <nav
          className="nav-desktop hidden items-center gap-5 xl:gap-6 min-[1000px]:flex"
          aria-label="Navigation principale"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="group flex items-center gap-1 text-[11px] font-semibold tracking-[0.08em] text-ink/80 transition-colors hover:text-olive"
            >
              {link.label}
              {link.dropdown && (
                <svg
                  className="h-3 w-3 text-brown-soft transition-transform group-hover:translate-y-0.5"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M2.5 4.5L6 8L9.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="#questionnaire"
            className="inline-flex items-center gap-2 rounded-full bg-olive px-3 py-2 text-[11px] font-semibold tracking-[0.06em] text-white transition-colors hover:bg-olive-dark sm:px-4 max-[999px]:rounded-xl max-[999px]:px-3.5 max-[999px]:py-2.5 max-[999px]:text-[10px]"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M11.5 2.5L13.5 4.5M3 13L3.5 10.5L11 3L13 5L5.5 12.5L3 13Z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>QUESTIONNAIRE</span>
          </Link>

          <button
            type="button"
            className="hidden rounded-full p-2 text-ink/70 transition-colors hover:bg-cream hover:text-olive min-[1000px]:inline-flex"
            aria-label="Rechercher"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
              <path d="M16 16L20 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>

          <button
            type="button"
            className="hidden rounded-full p-2 text-ink/70 transition-colors hover:bg-cream hover:text-olive min-[1000px]:inline-flex"
            aria-label="Mon compte"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
              <path
                d="M5 19.5C5.8 16.2 8.5 14 12 14C15.5 14 18.2 16.2 19 19.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Hamburger — <1000px */}
          <button
            type="button"
            className="rounded-full p-2 text-ink/70 transition-colors hover:bg-cream hover:text-olive min-[1000px]:hidden"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-panel"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav-panel"
        className={`relative z-50 overflow-hidden border-t border-sand/60 bg-white transition-[max-height,opacity] duration-300 ease-out min-[1000px]:hidden ${
          menuOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-auto flex max-w-[1280px] flex-col px-4 py-3" aria-label="Navigation mobile">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="border-b border-sand/50 px-2 py-3 text-[12px] font-semibold tracking-[0.08em] text-ink/85 transition-colors last:border-b-0 hover:text-olive"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {menuOpen && (
        <button
          type="button"
          className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 bg-ink/25 min-[1000px]:hidden"
          aria-label="Fermer le menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
}
