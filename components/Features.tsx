import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "Programmes personnalisés",
    description: "Plans nutritionnels adaptés à chaque âge et besoin.",
    icon: "/images/features/programmes.png",
    href: "/programmes",
  },
  {
    title: "Analyse complète",
    description: "Analyse nutritionnelle & sportive basée sur vos réponses.",
    icon: "/images/features/analyse.png",
    href: "/questionnaire",
  },
  {
    title: "Guides & Listes pratiques",
    description: "Listes de courses, recettes saines et guides pratiques.",
    icon: "/images/features/guides.png",
    href: "/ebooks",
  },
  {
    title: "Articles scientifiques",
    description: "Contenus validés par des experts et études récentes.",
    icon: "/images/features/articles.png",
    href: "/articles",
  },
];

export function Features() {
  return (
    <section
      id="services"
      className="scroll-mt-[calc(var(--header-h)+12px)] border-y border-sand/70 bg-white py-12 sm:py-14 max-[999px]:border-0 max-[999px]:px-4 max-[999px]:pt-8 max-[999px]:pb-4"
    >
      <div className="features-grid mx-auto grid max-w-[1200px] gap-8 px-6 sm:grid-cols-2 min-[1000px]:grid-cols-4 min-[1000px]:gap-6 min-[1000px]:px-8 max-[999px]:grid-cols-1 max-[999px]:gap-0 max-[999px]:rounded-2xl max-[999px]:bg-white max-[999px]:px-0 max-[999px]:shadow-sm">
        {features.map((feature) => (
          <Link
            key={feature.title}
            href={feature.href}
            className="feature-item flex items-start gap-3.5 text-left transition-colors hover:text-olive max-[999px]:items-center max-[999px]:gap-3 max-[999px]:border-b max-[999px]:border-ink/25 max-[999px]:px-4 max-[999px]:py-3.5 max-[999px]:last:border-b-0"
          >
            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full sm:h-16 sm:w-16 max-[999px]:h-11 max-[999px]:w-11 max-[999px]:rounded-xl">
              <Image src={feature.icon} alt="" fill className="object-cover" sizes="64px" />
            </span>
            <div className="min-w-0 flex-1 pt-0.5 max-[999px]:pt-0">
              <h2 className="mb-1 text-[14px] font-bold leading-snug text-ink max-[999px]:mb-0.5">
                {feature.title}
              </h2>
              <p className="text-[12px] leading-relaxed text-muted max-[999px]:whitespace-nowrap max-[999px]:text-[9px] max-[999px]:leading-tight">
                {feature.description}
              </p>
            </div>
            <span className="hidden shrink-0 text-ink/35 max-[999px]:inline" aria-hidden>
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
