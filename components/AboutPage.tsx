import Image from "next/image";
import Link from "next/link";

const values = [
  {
    title: "Personnalisé",
    text: "Chaque famille, chaque étape de vie a des besoins uniques. Nos recommandations s’adaptent à vous.",
  },
  {
    title: "Scientifique",
    text: "Des conseils fondés sur des données et des pratiques nutritionnelles actualisées.",
  },
  {
    title: "Accessible",
    text: "Des outils concrets — questionnaires, guides, recettes — pour avancer au quotidien.",
  },
];

const stages = [
  "Nutrition Maman",
  "Bébé & Enfant",
  "Enfant & Adolescent",
  "Santé Globale",
  "Bien-être & Équilibre",
];

export function AboutPage() {
  return (
    <div className="bg-white">
      {/* Intro */}
      <section className="relative overflow-hidden border-b border-sand/60">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 100% 0%, rgba(90,107,56,0.08), transparent 55%), linear-gradient(180deg, #f7f4ee 0%, #ffffff 70%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-[960px] px-4 pb-12 pt-4 sm:px-6 sm:pb-16">
          <nav className="mb-6 flex items-center gap-1.5 text-[12px] text-muted" aria-label="Fil d'Ariane">
            <Link href="/" className="inline-flex items-center text-olive hover:underline" aria-label="Accueil">
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden>
                <path
                  d="M3.5 9.5L10 4L16.5 9.5V16.5H12V12H8V16.5H3.5V9.5Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <span className="text-ink/30">›</span>
            <Link href="/" className="hover:text-olive">
              Accueil
            </Link>
            <span className="text-ink/30">›</span>
            <span className="font-medium text-ink">À propos</span>
          </nav>

          <div className="animate-fade-up flex flex-col items-start gap-8 min-[1000px]:flex-row min-[1000px]:items-center min-[1000px]:gap-12">
            <div className="min-w-0 flex-1">
              <p className="font-arabic text-[15px] text-brown-soft" dir="rtl">
                بيت العافية
              </p>
              <h1 className="font-display mt-1 text-[2.1rem] font-semibold leading-tight text-olive sm:text-5xl">
                À propos de WELLNEST
              </h1>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted sm:text-base">
                Nutrition saine pour chaque étape de la vie — de la grossesse à l’adolescence.
                Nous accompagnons les familles avec des programmes personnalisés, des analyses
                claires et des guides pratiques.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/questionnaire"
                  className="inline-flex items-center gap-2 rounded-full bg-olive px-5 py-3 text-[11px] font-bold tracking-[0.06em] text-white transition-colors hover:bg-olive-dark"
                >
                  COMMENCER LE QUESTIONNAIRE
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href="/#services"
                  className="inline-flex items-center gap-2 rounded-full border border-olive/30 px-5 py-3 text-[11px] font-bold tracking-[0.06em] text-olive transition-colors hover:border-olive hover:bg-cream"
                >
                  NOS SERVICES
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[280px] shrink-0 min-[1000px]:mx-0 min-[1000px]:max-w-[320px]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                <Image
                  src="/images/hero-family-v2.png"
                  alt="Famille partageant un moment autour d’une alimentation saine"
                  fill
                  className="object-cover object-[center_28%]"
                  sizes="320px"
                  priority
                />
              </div>
              <div className="absolute -bottom-3 -left-3 hidden h-20 w-20 rounded-full bg-olive/10 min-[1000px]:block" aria-hidden />
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-[960px] px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Notre mission</h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
          WELLNEST — « بيت العافية » — existe pour rendre la nutrition familiale simple, fiable et
          adaptée à chaque étape. Nous aidons les mamans et les familles à mieux comprendre leurs
          besoins, à prévenir les carences et à construire des habitudes durables, sans pression ni
          jargon inutile.
        </p>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
          Du premier trimestre de grossesse aux défis de l’adolescence, nous proposons un
          accompagnement clair : analyse personnalisée, contenus experts et outils concrets pour le
          quotidien.
        </p>
      </section>

      {/* Values */}
      <section className="border-y border-sand/60 bg-cream/50">
        <div className="mx-auto max-w-[960px] px-4 py-12 sm:px-6 sm:py-14">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Ce qui nous guide</h2>
          <p className="mt-2 max-w-lg text-[14px] text-muted">
            Trois principes pour une nutrition de famille utile et bienveillante.
          </p>
          <ul className="mt-8 grid gap-8 sm:grid-cols-3 sm:gap-6">
            {values.map((value, i) => (
              <li
                key={value.title}
                className={`animate-fade-up animate-delay-${i + 1}`}
              >
                <p className="text-[11px] font-bold tracking-[0.12em] text-olive">0{i + 1}</p>
                <h3 className="mt-2 font-display text-xl font-semibold text-ink">{value.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">{value.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Stages */}
      <section className="mx-auto max-w-[960px] px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          Pour chaque étape de la vie
        </h2>
        <p className="mt-2 max-w-lg text-[14px] text-muted">
          Un accompagnement qui évolue avec vous et votre famille.
        </p>
        <ul className="mt-8 flex flex-wrap gap-2.5">
          {stages.map((stage) => (
            <li
              key={stage}
              className="rounded-full border border-sand bg-white px-4 py-2 text-[12px] font-semibold text-ink/80"
            >
              {stage}
            </li>
          ))}
        </ul>
      </section>

      {/* Closing CTA */}
      <section className="bg-olive">
        <div className="mx-auto flex max-w-[960px] flex-col items-start gap-5 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-12">
          <div>
            <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
              Prêt(e) à commencer ?
            </h2>
            <p className="mt-2 max-w-md text-[13px] leading-relaxed text-white/80">
              Répondez à quelques questions et recevez des recommandations nutritionnelles adaptées
              à votre situation.
            </p>
          </div>
          <Link
            href="/questionnaire"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[12px] font-bold tracking-[0.06em] text-olive transition-transform hover:scale-[1.02]"
          >
            COMMENCER
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
