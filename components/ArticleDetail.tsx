import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/articles";
import { articleUi, contentLanguage } from "@/lib/content-language";

export function ArticleDetail({ article }: { article: Article }) {
  const language = contentLanguage(article.language);
  const ui = articleUi(language);
  const shortCrumb =
    article.title.length > 28 ? `${article.title.slice(0, 28)}…` : article.title;

  return (
    <article
      className="bg-white pb-10 pt-4"
      dir={language === "ar" ? "rtl" : "ltr"}
      lang={language}
    >
      <div className="mx-auto max-w-[760px] px-4 sm:px-6">
        {/* Breadcrumbs */}
        <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-[12px] text-muted" aria-label="Fil d'Ariane">
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
          <Link href="/articles" className="hover:text-olive">
            Articles
          </Link>
          <span className="text-ink/30">›</span>
          <span className="font-medium text-ink">{shortCrumb}</span>
        </nav>

        {/* Hero image */}
        <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-2xl">
          <Image
            src={article.image}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="(max-width: 760px) 100vw, 760px"
          />
          <span className="absolute left-3 top-3 rounded-full bg-olive px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            {article.category}
          </span>
        </div>

        <h1 className="font-display text-[1.75rem] font-semibold leading-tight text-ink sm:text-4xl">
          {article.title}
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">{article.subtitle}</p>

        {/* Meta */}
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-sand/70 py-3 text-[12px] text-muted">
          <div className="flex items-center gap-2">
            <span className="relative h-9 w-9 overflow-hidden rounded-full bg-cream">
              <Image
                src="/images/features/articles.png"
                alt=""
                fill
                className="object-cover"
                sizes="36px"
              />
            </span>
            <div className="leading-tight">
              <p className="font-semibold text-ink">
                {ui.by} {article.author.name}
              </p>
              <p className="text-[11px]">{article.author.role}</p>
            </div>
          </div>
          <span className="hidden h-8 w-px bg-sand sm:block" aria-hidden />
          <span className="inline-flex items-center gap-1.5">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
              <rect x="2" y="3" width="12" height="11" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
              <path d="M5 2V4.5M11 2V4.5M2 6.5H14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {article.date}
          </span>
          <span className="hidden h-8 w-px bg-sand sm:block" aria-hidden />
          <span className="inline-flex items-center gap-1.5">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
              <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M8 5V8.5L10 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {article.readTime}
          </span>
        </div>

        {/* Key points */}
        <section className="mt-6 rounded-2xl bg-cream p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-olive" aria-hidden>
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none">
                <path
                  d="M4 15C4 9 9 4 16 4C16 11 11 16 4 16Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h2 className="font-display text-lg font-semibold text-ink">{ui.keyPoints}</h2>
          </div>
          <ul className="space-y-2.5">
            {article.keyPoints.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink/85">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-olive text-white" aria-hidden>
                  <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {point}
              </li>
            ))}
          </ul>
        </section>

        {/* Introduction */}
        <section className="mt-7">
          <h2 className="font-display text-xl font-semibold text-ink">{ui.introduction}</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-ink/85">{article.introduction}</p>
        </section>

        {/* Content sections */}
        {article.sections.map((section) => (
          <section key={section.title} className="mt-7">
            <h2 className="font-display text-xl font-semibold text-ink">{section.title}</h2>
            {section.subtitle && (
              <p className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-olive">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
                  <path
                    d="M3 13C3 8 7 4 13 4C13 10 9 14 3 14Z"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                </svg>
                {section.subtitle}
              </p>
            )}
            <div className={`mt-3 ${section.image ? "grid gap-4 sm:grid-cols-[1.2fr_0.8fr] sm:items-start" : ""}`}>
              <p className="text-[14px] leading-relaxed text-ink/85">{section.body}</p>
              {section.image && (
                <div className="relative aspect-square overflow-hidden rounded-2xl">
                  <Image src={section.image} alt="" fill className="object-cover" sizes="280px" />
                </div>
              )}
            </div>
          </section>
        ))}

        {/* Tip */}
        <aside className="mt-7 flex items-start gap-3 rounded-2xl bg-cream px-4 py-3.5">
          <span className="mt-0.5 text-olive" aria-hidden>
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none">
              <path
                d="M8 14.5H12M10 3.5C7.5 3.5 5.5 5.5 5.5 8C5.5 9.7 6.4 11.1 7.7 11.9V13.5H12.3V11.9C13.6 11.1 14.5 9.7 14.5 8C14.5 5.5 12.5 3.5 10 3.5Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div>
            <p className="text-[12px] font-bold uppercase tracking-wide text-olive">{ui.tip}</p>
            <p className="mt-0.5 text-[13px] leading-relaxed text-ink/85">{article.tip}</p>
          </div>
        </aside>

        {/* Share */}
        <div className="mt-8 flex flex-col gap-3 rounded-2xl bg-cream p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2.5">
            <span className="text-olive" aria-hidden>
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none">
                <path
                  d="M10 16.5C10 16.5 3.5 12.5 3.5 7.8C3.5 5.4 5.4 3.5 7.8 3.5C9.1 3.5 10.3 4.1 11 5.1C11.7 4.1 12.9 3.5 14.2 3.5C16.6 3.5 18.5 5.4 18.5 7.8C18.5 12.5 12 16.5 12 16.5H10Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <p className="text-[13px] leading-snug text-ink/85">{ui.sharePrompt}</p>
          </div>
          <div className="flex items-center gap-2">
            {["WhatsApp", "Facebook", "Copier le lien"].map((label) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-olive text-white transition-colors hover:bg-olive-dark"
              >
                {label === "WhatsApp" && (
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d="M10 2.2C5.8 2.2 2.4 5.5 2.4 9.6C2.4 11.1 2.9 12.5 3.7 13.6L2.5 17.3L6.3 16.1C7.4 16.8 8.7 17.2 10 17.2C14.2 17.2 17.6 13.9 17.6 9.8C17.6 5.7 14.2 2.2 10 2.2ZM13.7 12.3C13.5 12.8 12.6 13.2 12.1 13.3C11.7 13.3 11.2 13.5 9.5 12.8C7.4 11.9 6 9.8 5.9 9.6C5.8 9.5 5 8.4 5 7.3C5 6.2 5.6 5.7 5.8 5.5C6 5.3 6.2 5.2 6.4 5.2H6.7C6.9 5.2 7.1 5.2 7.3 5.7C7.5 6.2 8 7.4 8.1 7.5C8.2 7.7 8.2 7.9 8.1 8C8 8.2 7.9 8.3 7.8 8.5C7.6 8.6 7.5 8.8 7.7 9.1C7.9 9.4 8.4 10.2 9.1 10.8C10 11.6 10.7 11.8 11 11.9C11.3 12 11.5 12 11.6 11.8C11.8 11.6 12.3 11 12.5 10.7C12.7 10.4 12.9 10.5 13.2 10.6C13.5 10.7 14.9 11.4 15.2 11.5C15.5 11.7 15.7 11.7 15.8 12C15.8 12.2 15.8 12.7 15.6 13.2" />
                  </svg>
                )}
                {label === "Facebook" && (
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d="M11.5 18V10.8H13.8L14.2 8.2H11.5V6.6C11.5 5.9 11.7 5.4 12.8 5.4H14.3V3.1C14 3.1 13.2 3 12.2 3C10.1 3 8.7 4.3 8.7 6.3V8.2H6.3V10.8H8.7V18H11.5Z" />
                  </svg>
                )}
                {label === "Copier le lien" && (
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
                    <path
                      d="M8.2 11.8C8.7 12.3 9.4 12.6 10.1 12.6C10.8 12.6 11.5 12.3 12 11.8L14.3 9.5C15.3 8.5 15.3 6.9 14.3 5.9C13.3 4.9 11.7 4.9 10.7 5.9L10.2 6.4"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M11.8 8.2C11.3 7.7 10.6 7.4 9.9 7.4C9.2 7.4 8.5 7.7 8 8.2L5.7 10.5C4.7 11.5 4.7 13.1 5.7 14.1C6.7 15.1 8.3 15.1 9.3 14.1L9.8 13.6"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
