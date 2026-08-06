"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  CONTENT_LANGUAGES,
  ebooksPageUi,
  inferContentLanguage,
  localizeContentDate,
  type ContentLanguage,
} from "@/lib/content-language";
import {
  ebookCategories,
  resolveEbooks,
  sortFilters,
  type Ebook,
  type SortFilter,
} from "@/lib/ebooks";

function ReasonIcon({ type }: { type: string }) {
  if (type === "star") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path
          d="M12 3.5L14.2 9.2L20.5 9.6L15.7 13.5L17.3 19.5L12 16.2L6.7 19.5L8.3 13.5L3.5 9.6L9.8 9.2L12 3.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (type === "leaf") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path
          d="M5 19C5 11 11 5 19 5C19 13 13 19 5 19Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M5 19C8 14 12 10 19 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "download") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path d="M12 4V14M8 11L12 15L16 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 18H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <rect x="5" y="11" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 11V8C8 5.8 9.8 4 12 4C14.2 4 16 5.8 16 8V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function EbooksListing({
  initialEbooks = [],
  initialFeatured = null,
  onUiLanguageChange,
}: {
  initialEbooks?: Ebook[];
  initialFeatured?: Ebook | null;
  onUiLanguageChange?: (language: ContentLanguage) => void;
}) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof ebookCategories)[number]>("Tous");
  const [language, setLanguage] = useState<ContentLanguage | "all">("all");
  const [sortBy, setSortBy] = useState<SortFilter>("recent");
  const [sortOpen, setSortOpen] = useState(false);
  const [items, setItems] = useState<Ebook[]>(initialEbooks);
  const [featuredEbook, setFeaturedEbook] = useState<Ebook | null>(initialFeatured);

  const uiLang: ContentLanguage = language === "ar" ? "ar" : "fr";
  const ui = ebooksPageUi(uiLang);
  const isAr = uiLang === "ar";

  useEffect(() => {
    // One fetch only — featured is derived from the same list.
    void resolveEbooks().then((list) => {
      setItems(list);
      setFeaturedEbook(list.find((ebook) => ebook.featured) ?? list[0] ?? null);
    });
  }, []);

  useEffect(() => {
    onUiLanguageChange?.(uiLang);
  }, [uiLang, onUiLanguageChange]);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam && (ebookCategories as readonly string[]).includes(categoryParam)) {
      setCategory(categoryParam as (typeof ebookCategories)[number]);
    }

    const sortParam = searchParams.get("sort");
    if (sortParam && sortFilters.some((item) => item.id === sortParam)) {
      setSortBy(sortParam as SortFilter);
      return;
    }

    const typeParam = searchParams.get("type");
    if (typeParam === "recipe") setSortBy("recipe-free");
    else if (typeParam === "grocery") setSortBy("grocery-free");
    else if (typeParam === "ebook" || typeParam === "guides") setSortBy("ebook");

    const tag = (searchParams.get("tag") || "").toLowerCase();
    if (tag.includes("recettes gratuites") || tag === "recettes gratuites") {
      setSortBy("recipe-free");
    } else if (tag.includes("recette")) {
      setSortBy("recipe-free");
    } else if (tag.includes("shopping") || tag.includes("courses") || tag.includes("liste")) {
      setSortBy("grocery-free");
    } else if (tag.includes("guide")) {
      setCategory("Guides Pratiques");
      setSortBy("ebook");
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const typeParam = searchParams.get("type");
    const tag = (searchParams.get("tag") || "").toLowerCase();
    const wantAllGrocery =
      typeParam === "grocery" || tag.includes("shopping") || tag.includes("courses") || tag.includes("liste");
    const wantAllGuides =
      typeParam === "ebook" || typeParam === "guides" || tag.includes("guide");

    return items.filter((ebook) => {
      const matchLanguage =
        language === "all" || inferContentLanguage(ebook, "ebook") === language;
      const matchCategory =
        category === "Tous" ||
        (category === "Guides Pratiques"
          ? ebook.productType === "ebook"
          : ebook.category === category);
      const matchQuery =
        !q ||
        ebook.title.toLowerCase().includes(q) ||
        ebook.category.toLowerCase().includes(q);
      const matchSort =
        category === "Guides Pratiques" || wantAllGuides
          ? ebook.productType === "ebook"
          : wantAllGrocery
            ? ebook.productType === "grocery"
            : sortBy === "recent" ||
              (sortBy === "recipe-free" && ebook.productType === "recipe" && ebook.pricing === "free") ||
              (sortBy === "recipe-paid" && ebook.productType === "recipe" && ebook.pricing === "paid") ||
              (sortBy === "grocery-free" && ebook.productType === "grocery" && ebook.pricing === "free") ||
              (sortBy === "grocery-paid" && ebook.productType === "grocery" && ebook.pricing === "paid") ||
              (sortBy === "ebook" && ebook.productType === "ebook");
      return matchLanguage && matchCategory && matchQuery && matchSort;
    });
  }, [category, language, query, sortBy, searchParams, items]);

  const featuredLang = featuredEbook
    ? inferContentLanguage(featuredEbook, "ebook")
    : "fr";
  const showFeatured =
    featuredEbook != null &&
    sortBy === "recent" &&
    (language === "all" || featuredLang === language) &&
    (category === "Tous" ||
      category === "Guides Pratiques" ||
      featuredEbook.category === category);

  const activeSortLabel =
    ui.sortFilters[sortBy] ??
    sortFilters.find((item) => item.id === sortBy)?.label ??
    ui.sortFilters.recent;
  const featuredCover =
    featuredEbook?.image?.trim() || "/images/article-1.jpg";

  return (
    <div
      className="bg-white pb-10 pt-4"
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
          <span className="font-medium text-ink">{ui.ebooks}</span>
        </nav>

        {/* Title */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-[1.85rem] font-semibold leading-tight text-olive sm:text-4xl">
              {ui.title}
            </h1>
            <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted">
              {ui.subtitle}
            </p>
          </div>
          <div className="relative h-16 w-16 shrink-0 sm:h-[72px] sm:w-[72px]" aria-hidden>
            <Image
              src="/images/features/guides.png"
              alt=""
              fill
              className="object-contain"
              sizes="72px"
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

        {/* Categories */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ebookCategories.map((item) => {
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

        {/* Featured */}
        {showFeatured && featuredEbook && (
          <article
            className="mb-8 overflow-hidden rounded-2xl bg-cream p-4 sm:p-5"
            dir={featuredLang === "ar" ? "rtl" : "ltr"}
            lang={featuredLang}
          >
            <div className="flex items-stretch gap-3 sm:gap-5">
              <Link
                href={`/ebooks/${featuredEbook.id}`}
                className="relative h-[130px] w-[100px] shrink-0 overflow-hidden rounded-xl bg-sand/50 sm:h-[168px] sm:w-[128px]"
                aria-label={featuredEbook.title}
              >
                <Image
                  src={featuredCover}
                  alt={featuredEbook.title}
                  fill
                  className="object-cover"
                  sizes="128px"
                  priority
                />
              </Link>
              <div className="min-w-0 flex-1">
                <span className="inline-block rounded-full bg-olive/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-olive">
                  {featuredEbook.label || "E-BOOK À LA UNE"}
                </span>
                <h2 className="mt-2 font-display text-xl font-semibold leading-snug text-ink sm:text-2xl">
                  {featuredEbook.title}
                </h2>
                <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-muted sm:line-clamp-none">
                  {featuredEbook.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted">
                  <span className="inline-flex items-center gap-1">
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
                      <path d="M4 3H12V13H4V3Z" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M6 6H10M6 8.5H10M6 11H8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    {featuredEbook.pages}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
                      <path d="M8 3V10M5.5 7.5L8 10L10.5 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3.5 12.5H12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    {featuredEbook.delivery}
                  </span>
                </div>
                <Link
                  href={`/ebooks/${featuredEbook.id}`}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-olive px-5 py-2.5 text-[11px] font-bold tracking-[0.06em] text-white transition-colors hover:bg-olive-dark"
                >
                  {featuredLang === "ar" ? "عرض الكتاب" : "VOIR LE E-BOOK"}
                  <span aria-hidden>{featuredLang === "ar" ? "←" : "→"}</span>
                </Link>
              </div>
            </div>
          </article>
        )}

        {/* List header */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-ink">{ui.allEbooks}</h2>
          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen((open) => !open)}
              className="flex max-w-[220px] items-center gap-1.5 text-[12px] text-muted"
              aria-expanded={sortOpen}
              aria-haspopup="listbox"
            >
              <span>
                {ui.sortBy}{" "}
                <span className="font-semibold text-ink">{activeSortLabel}</span>
              </span>
              <svg
                viewBox="0 0 12 12"
                className={`h-3 w-3 shrink-0 transition-transform ${sortOpen ? "rotate-180" : ""}`}
                fill="none"
                aria-hidden
              >
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>
            {sortOpen && (
              <ul
                role="listbox"
                className={`absolute z-20 mt-2 min-w-[230px] overflow-hidden rounded-xl border border-sand bg-white py-1 shadow-[0_8px_24px_rgba(44,42,38,0.12)] ${
                  isAr ? "left-0" : "right-0"
                }`}
              >
                {sortFilters.map((option) => (
                  <li key={option.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={sortBy === option.id}
                      onClick={() => {
                        setSortBy(option.id);
                        setSortOpen(false);
                      }}
                      className={`block w-full px-3 py-2 text-[12px] transition-colors ${
                        isAr ? "text-right" : "text-left"
                      } ${
                        sortBy === option.id
                          ? "bg-cream font-semibold text-olive"
                          : "text-ink/80 hover:bg-cream/70"
                      }`}
                    >
                      {ui.sortFilters[option.id] ?? option.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Ebook cards */}
        <ul className="space-y-3">
          {filtered
            .filter((ebook) => !ebook.featured)
            .map((ebook) => {
              const ebookLang = inferContentLanguage(ebook, "ebook");
              const displayDate = localizeContentDate(ebook.date, ebookLang);
              const categoryLabel = ui.categories[ebook.category] ?? ebook.category;
              return (
            <li key={ebook.id}>
              <article className="flex items-center gap-3 rounded-2xl border border-sand/70 bg-white p-3 shadow-[0_2px_10px_rgba(44,42,38,0.04)]">
                <Link href={`/ebooks/${ebook.id}`} className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl">
                  <Image src={ebook.image} alt="" fill className="object-cover" sizes="72px" />
                </Link>
                <Link href={`/ebooks/${ebook.id}`} className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-olive">
                      {categoryLabel}
                    </span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                        ebookLang === "ar"
                          ? "bg-brown/15 text-brown"
                          : "bg-olive/15 text-olive"
                      }`}
                    >
                      {ebookLang === "ar" ? "AR" : "FR"}
                    </span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                        ebook.pricing === "free" ? "bg-olive/15 text-olive" : "bg-sand text-brown"
                      }`}
                    >
                      {ebook.pricing === "free" ? ui.free : ui.paid}
                    </span>
                  </div>
                  <h3
                    className="mt-0.5 text-[14px] font-bold leading-snug text-ink hover:text-olive"
                    dir={ebookLang === "ar" ? "rtl" : "ltr"}
                    lang={ebookLang}
                  >
                    {ebook.title}
                  </h3>
                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted">
                    <span>{ebook.isRecipe && ebook.meta ? ebook.meta : ebook.pages}</span>
                    <span dir={ebookLang === "ar" ? "rtl" : "ltr"}>{displayDate}</span>
                  </div>
                </Link>
                <Link
                  href={`/ebooks/${ebook.id}`}
                  className="flex shrink-0 flex-col items-center gap-0.5 rounded-xl bg-cream px-2.5 py-2 text-[9px] font-bold tracking-wide text-olive transition-colors hover:bg-sand"
                >
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
                    <path d="M10 3V12M7 9L10 12L13 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 15H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  {ui.download}
                </Link>
              </article>
            </li>
              );
            })}
        </ul>

        {filtered.length === 0 && (
          <p className="py-10 text-center text-[13px] text-muted">{ui.empty}</p>
        )}

        {/* Why section */}
        <section className="mt-10">
          <h2 className="mb-5 text-center font-display text-xl font-semibold text-ink">
            {ui.whyTitle}
          </h2>
          <ul className="grid grid-cols-2 gap-4">
            {ui.reasons.map((reason) => (
              <li key={reason.id} className="flex flex-col items-center gap-2 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream text-olive">
                  <ReasonIcon type={reason.id} />
                </span>
                <p className="text-[12px] font-medium leading-snug text-ink/80">{reason.label}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
