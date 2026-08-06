import Image from "next/image";
import Link from "next/link";

const lifeStages = [
  {
    label: "Nutrition\nMaman",
    icon: "/images/life-stages/nutrition-maman.png",
  },
  {
    label: "Bébé &\nEnfant",
    icon: "/images/life-stages/bebe-enfant.png",
  },
  {
    label: "Enfant &\nAdolescent",
    icon: "/images/life-stages/enfant-adolescent.png",
  },
  {
    label: "Santé\nGlobale",
    icon: "/images/life-stages/sante-globale.png",
  },
  {
    label: "Bien-être &\nÉquilibre",
    icon: "/images/life-stages/bien-etre.png",
  },
];

function LifeStages({ className }: { className?: string }) {
  return (
    <ul className={className}>
      {lifeStages.map((stage) => (
        <li key={stage.label} className="flex min-w-0 flex-1 flex-col items-center text-center max-[999px]:w-auto">
          <span className="hero-stage-icon relative mb-2 h-14 w-14 overflow-hidden rounded-full sm:h-16 sm:w-16 max-[999px]:mb-1.5">
            <Image src={stage.icon} alt="" fill className="object-cover" sizes="64px" />
          </span>
          <span className="hero-stage-label whitespace-pre-line text-[10px] font-medium leading-tight text-ink/75 sm:text-[11px]">
            {stage.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Hero() {
  return (
    <>
      <section className="hero-section relative overflow-x-hidden bg-white">
        {/* Decorative tree — desktop only */}
        <div
          className="hero-tree pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-[140px] min-[1000px]:block min-[1000px]:w-[220px] xl:w-[260px]"
          aria-hidden
        >
          <Image
            src="/images/hero-tree-v2.png"
            alt=""
            fill
            className="object-cover object-left"
            sizes="260px"
            priority
          />
        </div>

        {/* Photo */}
        <div className="hero-media relative h-full min-h-0 w-full overflow-visible min-[1000px]:absolute min-[1000px]:inset-y-0 min-[1000px]:right-0 min-[1000px]:w-[58%]">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="/images/hero-family-v2.png"
              alt="Mère et enfants partageant un repas sain"
              fill
              priority
              className="object-cover object-[center_28%]"
              sizes="(max-width: 999px) 52vw, 58vw"
            />
          </div>

          <svg
            className="hero-wave pointer-events-none absolute -top-4 bottom-0 left-0 z-[2] hidden h-[calc(100%+1rem)] w-[30%] overflow-visible min-[1000px]:block"
            viewBox="0 -32 220 864"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <path
                id="hero-wave-edge"
                d="M0,-32
                 C48,-10 118,70 100,170
                 C78,280 145,360 105,460
                 C62,570 138,650 90,740
                 C58,790 28,830 0,864"
              />
            </defs>
            <path
              d="M0,-32
               C48,-10 118,70 100,170
               C78,280 145,360 105,460
               C62,570 138,650 90,740
               C58,790 28,830 0,864
               L0,-32 Z"
              fill="#ffffff"
            />
            <use
              href="#hero-wave-edge"
              fill="none"
              stroke="#926f48a1"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="translate(-5 0)"
            />
          </svg>

          {/* Mobile wavy edge — under 1000px */}
          <svg
            className="hero-wave-mobile pointer-events-none absolute inset-y-0 left-0 z-[2] h-full w-[34%] overflow-visible min-[1000px]:hidden"
            viewBox="0 0 100 600"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <path
                id="hero-wave-mobile-edge"
                d="M0,0
                   C38,45 72,95 58,165
                   C42,240 78,300 52,370
                   C28,440 68,500 40,555
                   C28,580 12,595 0,600"
              />
            </defs>
            <path
              d="M0,0
                 C38,45 72,95 58,165
                 C42,240 78,300 52,370
                 C28,440 68,500 40,555
                 C28,580 12,595 0,600
                 L0,0 Z"
              fill="#ffffff"
            />
            <use
              href="#hero-wave-mobile-edge"
              fill="none"
              stroke="#926f48a1"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="hero-overlay-card animate-fade-up animate-delay-3 absolute bottom-8 left-1/2 z-30 w-[min(92%,320px)] -translate-x-[calc(50%-50px)] rounded-xl bg-white/95 p-5 text-center shadow-[0_8px_30px_rgba(44,42,38,0.12)] backdrop-blur-sm sm:bottom-12">
            <p className="font-arabic text-[15px] font-semibold leading-relaxed text-ink" dir="rtl">
              غذاء صحي لعائلة أكثر سعادة
            </p>
            <p className="font-arabic mt-1.5 text-[12px] leading-relaxed text-muted" dir="rtl">
              برامج غذائية مخصصة لكل مرحلة من الحمل إلى المراهقة.
            </p>
            <Link
              href="/questionnaire"
              className="relative z-30 mt-4 inline-flex items-center justify-center rounded-md bg-olive px-5 py-2.5 text-[11px] font-semibold tracking-[0.08em] text-white transition-colors hover:bg-olive-dark"
            >
              DÉCOUVRIR PLUS
            </Link>
          </div>
        </div>

        {/* Content column — pointer-events-none so it does not block the overlay CTA on the photo */}
        <div className="hero-content-wrap pointer-events-none relative z-10 mx-auto flex h-full max-w-[1400px] items-center px-6 py-8 pl-28 sm:px-10 sm:pl-36 min-[1000px]:px-14 min-[1000px]:pl-44 xl:px-16 xl:pl-48">
          <div className="hero-inner pointer-events-auto animate-fade-up flex w-full max-w-xl flex-col items-center min-[1000px]:w-[42%]">
            <div className="hero-brand-block mb-5 flex w-full max-w-md -translate-x-[70px] flex-col items-center max-[999px]:mb-0">
              <h1 className="sr-only">WELLNEST — بيت العافية</h1>

              {/* Desktop hero logo */}
              <Image
                src="/wellnest-logo-hero.png"
                alt="WELLNEST — بيت العافية"
                width={280}
                height={280}
                className="hero-logo-img mx-auto hidden h-auto w-[200px] object-contain min-[1000px]:block min-[1000px]:w-[260px]"
                priority
              />

              {/* Mobile hero logo (<1000px) */}
              <Image
                src="/wellnest-logo-hero-mobile.png"
                alt="WELLNEST — بيت العافية"
                width={280}
                height={148}
                className="hero-logo-mobile mx-auto h-auto w-[200px] object-contain min-[1000px]:hidden sm:w-[230px]"
                priority
              />

              <p className="hero-tagline animate-fade-up animate-delay-1 mt-4 w-full text-center text-[15px] font-bold leading-relaxed text-ink sm:text-base">
                Nutrition saine pour chaque étape de la vie.
                <br />
                De la naissance à l&apos;adolescence.
              </p>
            </div>

            {/* Desktop life stages (inside hero) */}
            <LifeStages className="hero-stages animate-fade-up animate-delay-2 mt-10 hidden w-full max-w-xl -translate-x-[50px] flex-wrap gap-x-3 gap-y-6 min-[1000px]:flex min-[1000px]:flex-nowrap min-[1000px]:justify-between" />
          </div>

        </div>
      </section>

      {/* Mobile life stages — full-width row below hero (<1000px) */}
      <div className="bg-white px-3 pt-8 pb-2 min-[1000px]:hidden">
        <LifeStages className="hero-stages mx-auto flex w-full max-w-xl justify-between gap-1" />
      </div>
    </>
  );
}
