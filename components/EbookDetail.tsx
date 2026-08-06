import Image from "next/image";
import Link from "next/link";
import { EbookDownloadForm } from "@/components/EbookDownloadForm";
import {
  ebookUi,
  inferContentLanguage,
  localizeAuthorRole,
  localizeContentDate,
} from "@/lib/content-language";
import type { Ebook } from "@/lib/ebooks";

export function EbookDetail({ ebook }: { ebook: Ebook }) {
  const language = inferContentLanguage(ebook, "ebook");
  const ui = ebookUi(language);
  const authorRole = localizeAuthorRole(ebook.author.role, language);
  const displayDate = localizeContentDate(ebook.date, language);
  const shortCrumb =
    ebook.title.length > 28 ? `${ebook.title.slice(0, 28)}…` : ebook.title;

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
          <Link href="/ebooks" className="hover:text-olive">
            E-books
          </Link>
          <span className="text-ink/30">›</span>
          <span className="font-medium text-ink">{shortCrumb}</span>
        </nav>

        {/* Hero */}
        <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-2xl">
          <Image
            src={ebook.image}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="(max-width: 760px) 100vw, 760px"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-olive px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              {ebook.category}
            </span>
            {ebook.pricing === "paid" && (
              <span className="rounded-full bg-brown px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                {ui.paidBadge}
              </span>
            )}
          </div>
        </div>

        <h1 className="font-display text-[1.75rem] font-semibold leading-tight text-ink sm:text-4xl">
          {ebook.title}
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">{ebook.subtitle}</p>

        {/* Meta */}
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-sand/70 py-3 text-[12px] text-muted">
          <div className="flex items-center gap-2">
            <span className="relative h-9 w-9 overflow-hidden rounded-full bg-cream">
              <Image
                src="/images/features/guides.png"
                alt=""
                fill
                className="object-cover"
                sizes="36px"
              />
            </span>
            <div className="leading-tight">
              <p className="font-semibold text-ink">
                <span className="me-1">{ui.by}</span>
                {ebook.author.name}
              </p>
              <p className="text-[11px]">{authorRole}</p>
            </div>
          </div>
          <span className="hidden h-8 w-px bg-sand sm:block" aria-hidden />
          <span className="inline-flex items-center gap-1.5">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
              <path d="M4 3H12V13H4V3Z" stroke="currentColor" strokeWidth="1.2" />
              <path d="M6 6H10M6 8.5H10M6 11H8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {ebook.pages}
          </span>
          <span className="hidden h-8 w-px bg-sand sm:block" aria-hidden />
          <span className="inline-flex items-center gap-1.5">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
              <rect x="2" y="3" width="12" height="11" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
              <path d="M5 2V4.5M11 2V4.5M2 6.5H14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span dir={language === "ar" ? "rtl" : "ltr"}>{displayDate}</span>
          </span>
          <span className="hidden h-8 w-px bg-sand sm:block" aria-hidden />
          <span className="inline-flex items-center gap-1.5">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
              <path d="M8 3V10M5.5 7.5L8 10L10.5 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3.5 12.5H12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {ebook.delivery}
          </span>
        </div>

        {/* CTA */}
        <div className="mt-5">
          {ebook.pricing === "paid" && (
            <p className="mb-3 text-[13px] leading-relaxed text-muted">{ui.ctaTextPaid}</p>
          )}
          <EbookDownloadForm
            ebookId={ebook.id}
            ebookTitle={ebook.title}
            pricing={ebook.pricing}
            language={language}
            variant="primary"
          />
        </div>

        {/* Highlights */}
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
            <h2 className="font-display text-lg font-semibold text-ink">{ui.highlights}</h2>
          </div>
          <ul className="space-y-2.5">
            {ebook.highlights.map((point) => (
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
          <h2 className="font-display text-xl font-semibold text-ink">{ui.about}</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-ink/85">{ebook.introduction}</p>
        </section>

        {/* Contents */}
        <section className="mt-7">
          <h2 className="font-display text-xl font-semibold text-ink">{ui.contents}</h2>
          <ol className="mt-3 space-y-2.5">
            {ebook.contents.map((item, index) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border border-sand/70 bg-white px-3 py-2.5 text-[13px] text-ink/85"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cream text-[11px] font-bold text-olive">
                  {index + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </section>

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
            <p className="mt-0.5 text-[13px] leading-relaxed text-ink/85">{ebook.tip}</p>
          </div>
        </aside>

        {/* Bottom CTA */}
        <div className="mt-8 rounded-2xl bg-olive p-5 text-white">
          <h2 className="font-display text-xl font-semibold">{ui.ctaTitle}</h2>
          <p className="mt-1.5 text-[13px] text-white/85">
            {ebook.pricing === "paid" ? ui.ctaTextPaid : ui.ctaText}
          </p>
          <div className="mt-4">
            <EbookDownloadForm
              ebookId={ebook.id}
              ebookTitle={ebook.title}
              pricing={ebook.pricing}
              language={language}
              variant="inverse"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
