"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { articleCategories, type Article, resolveArticles } from "@/lib/articles";
import {
  CONTENT_LANGUAGES,
  articlesPageUi,
  inferContentLanguage,
  localizeContentDate,
  localizeReadTime,
  type ContentLanguage,
} from "@/lib/content-language";

export function ArticlesListing({
  initialArticles = [],
  onUiLanguageChange,
}: {
  initialArticles?: Article[];
  onUiLanguageChange?: (language: ContentLanguage) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof articleCategories)[number]>("Tous");
  const [language, setLanguage] = useState<ContentLanguage | "all">("all");
  const [items, setItems] = useState<Article[]>(initialArticles);

  const uiLang: ContentLanguage = language === "ar" ? "ar" : "fr";
  const ui = articlesPageUi(uiLang);
  const isAr = uiLang === "ar";

  useEffect(() => {
    // Soft refresh in the background; keep SSR data visible meanwhile.
    void resolveArticles().then(setItems);
  }, []);

  useEffect(() => {
    onUiLanguageChange?.(uiLang);
  }, [uiLang, onUiLanguageChange]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((article) => {
      const matchLanguage =
        language === "all" || inferContentLanguage(article, "article") === language;
      const matchCategory = category === "Tous" || article.category === category;
      const matchQuery =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q);
      return matchLanguage && matchCategory && matchQuery;
    });
  }, [category, language, query, items]);

  return (
    <div
      className="bg-white pb-8 pt-4 max-[999px]:pb-6"
      dir={isAr ? "rtl" : "ltr"}
      lang={uiLang}
    >
      <div className="mx-auto max-w-[900px] px-4 sm:px-6">
        {/* Breadcrumbs */}
        <nav
          className="mb-5 flex items-center gap-1.5 text-[12px] text-muted"
          aria-label={isAr ? "مسار التنقل" : "Fil d'Ariane"}
        >
          <Link
            href="/"
            className="inline-flex items-center text-olive hover:underline"
            aria-label={ui.home}
          >
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
            {ui.home}
          </Link>
          <span className="text-ink/30">›</span>
          <span className="font-medium text-ink">{ui.articles}</span>
        </nav>

        {/* Title row */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-[1.85rem] font-semibold leading-tight text-olive sm:text-4xl">
              {ui.title}
            </h1>
            <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted">
              {ui.subtitle}
            </p>
          </div>
          <div className="relative hidden h-16 w-16 shrink-0 sm:block" aria-hidden>
            <Image
              src="/images/features/articles.png"
              alt=""
              fill
              className="object-contain"
              sizes="64px"
            />
          </div>
        </div>

        {/* Search */}
        <label className="relative mb-4 block">
          <span className="sr-only">{ui.searchLabel}</span>
          <span
            className={`pointer-events-none absolute inset-y-0 flex items-center text-muted ${
              isAr ? "right-3" : "left-3"
            }`}
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
              <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M13 13L17 17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={ui.searchPlaceholder}
            className={`w-full rounded-full border border-sand bg-cream/60 py-2.5 text-[13px] text-ink outline-none placeholder:text-muted focus:border-olive focus:ring-1 focus:ring-olive/30 ${
              isAr ? "pl-4 pr-10" : "pl-10 pr-4"
            }`}
          />
        </label>

        {/* Language tabs */}
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(
            [
              { id: "all" as const, label: ui.allLanguages },
              ...CONTENT_LANGUAGES.map((item) => ({ id: item.id, label: item.label })),
            ] as const
          ).map((item) => {
            const active = item.id === language;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setLanguage(item.id)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                  active
                    ? "bg-olive text-white"
                    : "border border-sand bg-white text-ink/70 hover:border-olive/40 hover:text-olive"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Category tabs */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {articleCategories.map((item) => {
            const active = item === category;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                  active
                    ? "bg-olive text-white"
                    : "border border-sand bg-white text-ink/70 hover:border-olive/40 hover:text-olive"
                }`}
              >
                {ui.categories[item] ?? item}
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <div className="mb-5 flex items-center gap-2 text-[12px] text-muted">
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden>
            <path d="M4 6H16M6 10H14M8 14H12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <span>
            {ui.sortBy}{" "}
            <span className="font-semibold text-ink">{ui.sortRecent}</span>
          </span>
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" aria-hidden>
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </div>

        {/* Article cards */}
        <ul className="space-y-4">
          {filtered.map((article) => {
            const articleLang = inferContentLanguage(article, "article");
            const displayDate = localizeContentDate(article.date, articleLang);
            const displayReadTime = localizeReadTime(article.readTime, articleLang);
            const categoryLabel = ui.categories[article.category] ?? article.category;
            return (
              <li key={article.id}>
                <article className="flex gap-3 rounded-2xl border border-sand/70 bg-white p-3 shadow-[0_2px_10px_rgba(44,42,38,0.04)]">
                  <Link
                    href={`/articles/${article.id}`}
                    className="relative h-[92px] w-[92px] shrink-0 overflow-hidden rounded-xl sm:h-[104px] sm:w-[104px]"
                  >
                    <Image
                      src={article.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="104px"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full bg-cream px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-olive">
                        {categoryLabel}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          articleLang === "ar"
                            ? "bg-brown/15 text-brown"
                            : "bg-olive/15 text-olive"
                        }`}
                      >
                        {articleLang === "ar" ? "AR" : "FR"}
                      </span>
                    </div>
                    <Link href={`/articles/${article.id}`}>
                      <h2
                        className="text-[14px] font-bold leading-snug text-ink hover:text-olive"
                        dir={articleLang === "ar" ? "rtl" : "ltr"}
                        lang={articleLang}
                      >
                        {article.title}
                      </h2>
                    </Link>
                    <p
                      className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-muted"
                      dir={articleLang === "ar" ? "rtl" : "ltr"}
                      lang={articleLang}
                    >
                      {article.excerpt}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted">
                      <span className="inline-flex items-center gap-1">
                        <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" aria-hidden>
                          <rect
                            x="2"
                            y="3"
                            width="12"
                            height="11"
                            rx="1.2"
                            stroke="currentColor"
                            strokeWidth="1.2"
                          />
                          <path
                            d="M5 2V4.5M11 2V4.5M2 6.5H14"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span dir={articleLang === "ar" ? "rtl" : "ltr"}>{displayDate}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" aria-hidden>
                          <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.2" />
                          <path
                            d="M8 5V8.5L10 10"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                          />
                        </svg>
                        {displayReadTime}
                      </span>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        {filtered.length === 0 && (
          <p className="py-10 text-center text-[13px] text-muted">{ui.empty}</p>
        )}
      </div>
    </div>
  );
}
