import Link from "next/link";

const items = [
  {
    label: "Accueil",
    href: "/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <path d="M4 10.5L12 4L20 10.5V20H14.5V14H9.5V20H4V10.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Programmes",
    href: "/programmes",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <path d="M7 6H17M7 12H17M7 18H13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Ressources",
    href: "/articles",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <path d="M5 5.5C5 4.7 5.7 4 6.5 4H11V20H6.5C5.7 20 5 19.3 5 18.5V5.5Z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M19 5.5C19 4.7 18.3 4 17.5 4H13V20H17.5C18.3 20 19 19.3 19 18.5V5.5Z" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    label: "Boutique",
    href: "/programmes",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <path d="M6 8H18L17 19H7L6 8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M9 8V7C9 5.3 10.3 4 12 4C13.7 4 15 5.3 15 7V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Profil",
    href: "/profil",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M5.5 19C6.4 15.8 8.9 14 12 14C15.1 14 17.6 15.8 18.5 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function MobileBottomNav({ active = "Accueil" }: { active?: string }) {
  return (
    <nav
      className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-50 hidden border-t border-sand/70 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-1.5 backdrop-blur-sm max-[999px]:block"
      aria-label="Navigation mobile"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between">
        {items.map((item) => (
          <li key={item.label} className="flex-1">
            <Link
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-1 py-1.5 text-[10px] font-medium ${
                item.label === active ? "text-olive" : "text-ink/60"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
