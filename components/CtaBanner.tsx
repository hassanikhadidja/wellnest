import Image from "next/image";
import Link from "next/link";

const steps = [
  {
    number: "1",
    title: "Répondez",
    subtitle: "À des questions simples sur votre mode de vie",
    icon: "/images/cta/step-repondez.png",
  },
  {
    number: "2",
    title: "Analyse",
    subtitle: "Nous analysons vos besoins nutritionnels & sportifs",
    icon: "/images/cta/step-analyse.png",
  },
  {
    number: "3",
    title: "Recevez votre plan",
    subtitle: "Programme personnalisé, liste de courses et conseils adaptés",
    icon: "/images/cta/step-plan.png",
  },
];

export function CtaBanner() {
  return (
    <section id="questionnaire" className="relative bg-olive max-[999px]:bg-white max-[999px]:px-4 max-[999px]:py-5">
      <div className="pointer-events-none absolute -top-px left-0 right-0 h-6 overflow-hidden text-white max-[999px]:hidden" aria-hidden>
        <svg viewBox="0 0 1440 24" preserveAspectRatio="none" className="h-full w-full fill-current">
          <path d="M0,24 C240,4 480,20 720,10 C960,0 1200,18 1440,6 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <div className="cta-banner-inner mx-auto flex max-w-[1200px] flex-col gap-10 px-6 py-12 min-[1000px]:flex-row min-[1000px]:items-center min-[1000px]:justify-between min-[1000px]:gap-10 min-[1000px]:px-8 min-[1000px]:py-14 max-[999px]:gap-5 max-[999px]:rounded-2xl max-[999px]:bg-olive max-[999px]:px-5 max-[999px]:py-6">
        {/* Left CTA — icon beside headline */}
        <div className="max-w-lg text-white">
          <div className="flex items-start gap-4 max-[999px]:gap-3">
            <div className="relative h-16 w-16 shrink-0 sm:h-[72px] sm:w-[72px] max-[999px]:h-12 max-[999px]:w-12">
              <Image
                src="/images/cta/clipboard.png"
                alt=""
                fill
                className="object-contain"
                sizes="72px"
              />
            </div>
            <div className="min-w-0 pt-1">
              <h2 className="font-display text-xl font-semibold leading-snug tracking-wide sm:text-[1.65rem] max-[999px]:text-lg">
                Commencez votre parcours vers une meilleure santé
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-white/80 max-[999px]:text-[12px]">
                Répondez à notre questionnaire complet pour recevoir votre analyse personnalisée.
              </p>
            </div>
          </div>

          <Link
            href="#questionnaire"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[12px] font-bold tracking-[0.06em] text-olive transition-transform hover:scale-[1.02] max-[999px]:mt-0 max-[999px]:hidden"
          >
            COMMENCER LE QUESTIONNAIRE
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Right steps */}
        <ol className="flex flex-1 flex-row items-start justify-between gap-1 min-[1000px]:justify-end min-[1000px]:gap-5">
          {steps.map((step, index) => (
            <li
              key={step.number}
              className="flex min-w-0 flex-1 items-center justify-center gap-1 min-[1000px]:flex-none min-[1000px]:gap-5"
            >
              <div className="flex max-w-[160px] flex-col items-center text-center text-white max-[999px]:max-w-none">
                <div className="relative mb-2.5 h-16 w-16 sm:h-[68px] sm:w-[68px] max-[999px]:mb-1 max-[999px]:h-10 max-[999px]:w-10">
                  <Image
                    src={step.icon}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="68px"
                  />
                </div>
                <p className="text-[13px] font-bold leading-tight max-[999px]:text-[10px]">
                  {step.number}. {step.title}
                </p>
                <p className="mt-1 text-[11px] leading-snug text-white/75 max-[999px]:mt-0.5 max-[999px]:text-[8px] max-[999px]:leading-tight">
                  {step.subtitle}
                </p>
              </div>
              {index < steps.length - 1 && (
                <span className="shrink-0 self-center text-white/60 min-[1000px]:self-start min-[1000px]:pt-6" aria-hidden>
                  <svg className="h-3.5 w-3.5 min-[1000px]:h-5 min-[1000px]:w-5" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M4 10H16M12 6L16 10L12 14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </li>
          ))}
        </ol>

        {/* Mobile CTA button at bottom of card */}
        <Link
          href="#questionnaire"
          className="hidden items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-center text-[12px] font-bold tracking-[0.06em] text-olive max-[999px]:inline-flex"
        >
          COMMENCER LE QUESTIONNAIRE
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
