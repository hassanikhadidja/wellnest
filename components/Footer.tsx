import Image from "next/image";
import Link from "next/link";

const socials = [
  {
    label: "Facebook",
    path: "M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97H15.83c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z",
  },
  {
    label: "Instagram",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z",
  },
  {
    label: "YouTube",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  {
    label: "Pinterest",
    path: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z",
  },
];

const quickLinks = [
  { label: "Accueil", href: "#" },
  { label: "À propos", href: "#apropos", chevron: true },
  { label: "Services", href: "#services", chevron: true },
  { label: "Blog", href: "#blog" },
  { label: "Ressources", href: "#ressources", chevron: true },
  { label: "Boutique", href: "#boutique" },
  { label: "Contact", href: "#contact" },
];

const services = [
  { label: "Nutrition Maman", href: "#services" },
  { label: "Bébé & Enfant", href: "#services" },
  { label: "Enfant & Adolescent", href: "#services" },
  { label: "Santé Globale", href: "#services" },
  { label: "Bien-être & Équilibre", href: "#services" },
];

function SocialRow({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {socials.map((social) => (
        <Link
          key={social.label}
          href="#"
          aria-label={social.label}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d={social.path} />
          </svg>
        </Link>
      ))}
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="relative bg-olive text-white">
      <div
        className="pointer-events-none absolute -top-px left-0 right-0 h-8 overflow-hidden text-white max-[999px]:h-7 min-[1000px]:h-14 sm:min-[1000px]:h-16"
        aria-hidden
      >
        <svg viewBox="0 0 1440 64" preserveAspectRatio="none" className="h-full w-full fill-current">
          <path d="M0,64 C180,18 360,54 540,28 C720,2 900,58 1080,30 C1260,4 1380,48 1440,22 L1440,0 L0,0 Z" />
        </svg>
      </div>

      {/* ── Desktop footer (≥1000px) ── */}
      <div className="mx-auto hidden max-w-[1200px] grid-cols-3 items-center gap-6 px-6 pt-12 pb-8 min-[1000px]:grid lg:px-8 lg:pt-14 lg:pb-10">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-wide">Restez informé(e)</h2>
          <p className="mt-1.5 text-[13px] text-white/75">
            Recevez nos conseils nutrition et nouveautés.
          </p>
          <form className="mt-3 flex flex-col gap-2 sm:flex-row" action="#" method="post">
            <label htmlFor="newsletter-email" className="sr-only">
              Adresse e-mail
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              required
              placeholder="Votre adresse e-mail"
              className="w-full rounded-md border-0 bg-white px-4 py-2.5 text-[13px] text-ink placeholder:text-muted outline-none focus:ring-2 focus:ring-sand"
            />
            <button
              type="submit"
              className="shrink-0 rounded-md bg-sand-dark px-4 py-2.5 text-[11px] font-bold tracking-[0.06em] text-ink transition-colors hover:bg-sand"
            >
              S&apos;INSCRIRE
            </button>
          </form>
        </div>

        <div className="flex flex-col items-center text-center">
          <Image
            src="/wellnest-logo-footer.png"
            alt="WELLNEST — بيت العافية"
            width={180}
            height={95}
            className="h-auto w-[170px] object-contain"
          />
          <SocialRow className="mt-3" />
        </div>

        <div className="text-right">
          <h2 className="font-display text-xl font-semibold tracking-wide">Nous contacter</h2>
          <ul className="mt-2.5 space-y-2 text-[13px] text-white/85">
            <li className="flex items-center justify-end gap-3">
              <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" aria-hidden>
                <rect x="2" y="4" width="16" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M3 6L10 11L17 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <a href="mailto:contact@wellnest.com" className="hover:underline">
                contact@wellnest.com
              </a>
            </li>
            <li className="flex items-center justify-end gap-3">
              <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" aria-hidden>
                <path
                  d="M4 3.5H7L8.5 7.5L6.5 8.5C7.5 10.5 9.5 12.5 11.5 13.5L12.5 11.5L16.5 13V16C16.5 16.5 16 17 15.5 17C9.5 17 3.5 11 3.5 4.5C3.5 4 4 3.5 4 3.5Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
              <a href="tel:+213555123456" className="hover:underline">
                +213 555 123 456
              </a>
            </li>
            <li className="flex items-center justify-end gap-3">
              <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" aria-hidden>
                <path
                  d="M10 17C10 17 4 12.5 4 8.5C4 5.5 6.5 3.5 10 3.5C13.5 3.5 16 5.5 16 8.5C16 12.5 10 17 10 17Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <circle cx="10" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.3" />
              </svg>
              <span>Alger, Algérie</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="hidden border-t border-white/15 py-2.5 text-center text-[11px] text-white/60 min-[1000px]:block">
        © {year} WELLNEST — بيت العافية —  Tous droits réservés.
      </div>

      {/* ── Mobile footer (<1000px) — matches mockup ── */}
      <div className="px-5 pt-8 pb-6 min-[1000px]:hidden">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8">
          {/* Brand */}
          <div className="col-span-2 flex flex-col items-start">
            <Image
              src="/wellnest-logo-footer-mobile.png"
              alt="WELLNEST — بيت العافية"
              width={160}
              height={160}
              className="h-auto w-[120px] object-contain"
            />
            <p className="mt-3 max-w-[280px] text-[12px] leading-relaxed text-white/80">
              Nutrition saine pour chaque étape de la vie. De la naissance à l&apos;adolescence.
            </p>
            <SocialRow className="mt-4" />
          </div>

          {/* Liens rapides */}
          <div>
            <h2 className="font-display text-lg font-semibold tracking-wide">Liens rapides</h2>
            <ul className="mt-3 space-y-2 text-[13px] text-white/85">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="inline-flex items-center gap-1 hover:underline">
                    {link.label}
                    {link.chevron && (
                      <span aria-hidden className="text-white/50">
                        ›
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Nos services */}
          <div>
            <h2 className="font-display text-lg font-semibold tracking-wide">Nos services</h2>
            <ul className="mt-3 space-y-2 text-[13px] text-white/85">
              {services.map((service) => (
                <li key={service.label}>
                  <Link href={service.href} className="hover:underline">
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2">
            <h2 className="font-display text-lg font-semibold tracking-wide">Nous contacter</h2>
            <ul className="mt-3 space-y-2.5 text-[13px] text-white/85">
              <li className="flex items-center gap-3">
                <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" aria-hidden>
                  <rect x="2" y="4" width="16" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M3 6L10 11L17 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                <a href="mailto:contact@wellnest.com" className="hover:underline">
                  contact@wellnest.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" aria-hidden>
                  <path
                    d="M4 3.5H7L8.5 7.5L6.5 8.5C7.5 10.5 9.5 12.5 11.5 13.5L12.5 11.5L16.5 13V16C16.5 16.5 16 17 15.5 17C9.5 17 3.5 11 3.5 4.5C3.5 4 4 3.5 4 3.5Z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                </svg>
                <a href="tel:+213555123456" className="hover:underline">
                  +213 555 123 456
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" aria-hidden>
                  <path
                    d="M10 17C10 17 4 12.5 4 8.5C4 5.5 6.5 3.5 10 3.5C13.5 3.5 16 5.5 16 8.5C16 12.5 10 17 10 17Z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                  <circle cx="10" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.3" />
                </svg>
                <span>Alger, Algérie</span>
              </li>
            </ul>

            <Link
              href="#questionnaire"
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-[11px] font-bold tracking-[0.06em] text-olive transition-colors hover:bg-cream"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
                <rect x="3" y="4" width="14" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M7 2.5V5.5M13 2.5V5.5M3 8H17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              PRENDRE RENDEZ-VOUS
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-white/15 pt-3 text-[11px] text-white/60">
          <p>© {year} Wellnest. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
