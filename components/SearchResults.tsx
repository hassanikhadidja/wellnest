"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { articles, resolveArticles, type Article } from "@/lib/articles";
import { ebooks, resolveEbooks, type Ebook } from "@/lib/ebooks";

export function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = (searchParams.get("q") || "").trim();
  const [input, setInput] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [articleItems, setArticleItems] = useState<Article[]>(articles);
  const [ebookItems, setEbookItems] = useState<Ebook[]>(ebooks);

  useEffect(() => {
    const q = (searchParams.get("q") || "").trim();
    setInput(q);
    setQuery(q);
  }, [searchParams]);

  useEffect(() => {
    void resolveArticles().then(setArticleItems);
    void resolveEbooks().then(setEbookItems);
  }, []);

  const matchedArticles = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return [];
    return articleItems.filter(
      (article) =>
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q) ||
        article.subtitle.toLowerCase().includes(q),
    );
  }, [articleItems, query]);

  const matchedEbooks = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return [];
    return ebookItems.filter(
      (ebook) =>
        ebook.title.toLowerCase().includes(q) ||
        ebook.category.toLowerCase().includes(q) ||
        ebook.subtitle.toLowerCase().includes(q) ||
        ebook.description.toLowerCase().includes(q),
    );
  }, [ebookItems, query]);

  const total = matchedArticles.length + matchedEbooks.length;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = input.trim();
    setQuery(q);
    router.replace(q ? `/recherche?q=${encodeURIComponent(q)}` : "/recherche");
  }

  return (
    <div className="bg-white pb-10 pt-4 max-[999px]:pb-6">
      <div className="mx-auto max-w-[900px] px-4 sm:px-6">
        <nav className="mb-5 flex items-center gap-1.5 text-[12px] text-muted" aria-label="Fil d'Ariane">
          <Link href="/" className="hover:text-olive">
            Accueil
          </Link>
          <span className="text-ink/30">›</span>
          <span className="font-medium text-ink">Recherche</span>
        </nav>

        <h1 className="font-display text-[1.85rem] font-semibold leading-tight text-olive sm:text-4xl">
          Recherche
        </h1>
        <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted">
          Trouvez des articles, guides et recettes sur Wellnest.
        </p>

        <form onSubmit={onSubmit} className="relative mb-6 mt-5" role="search">
          <label className="relative block">
            <span className="sr-only">Rechercher</span>
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
                <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M13 13L17 17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Rechercher articles, guides, recettes…"
              className="w-full rounded-full border border-sand bg-cream/60 py-2.5 pl-10 pr-4 text-[13px] text-ink outline-none placeholder:text-muted focus:border-olive focus:ring-1 focus:ring-olive/30"
            />
          </label>
        </form>

        {!query && (
          <p className="py-8 text-center text-[13px] text-muted">
            Saisissez un mot-clé pour lancer une recherche.
          </p>
        )}

        {query && (
          <p className="mb-5 text-[13px] text-muted">
            {total === 0
              ? `Aucun résultat pour « ${query} ».`
              : `${total} résultat${total > 1 ? "s" : ""} pour « ${query} ».`}
          </p>
        )}

        {matchedArticles.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-[12px] font-bold uppercase tracking-[0.08em] text-olive">
              Articles
            </h2>
            <ul className="space-y-3">
              {matchedArticles.map((article) => (
                <li key={article.id}>
                  <Link
                    href={`/articles/${article.id}`}
                    className="flex gap-3 rounded-2xl border border-sand/70 bg-white p-3 transition-colors hover:border-olive/40"
                  >
                    <span className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={article.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="72px"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-olive">
                        {article.category}
                      </span>
                      <span className="mt-0.5 block text-[14px] font-bold leading-snug text-ink">
                        {article.title}
                      </span>
                      <span className="mt-1 line-clamp-2 block text-[12px] text-muted">
                        {article.excerpt}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {matchedEbooks.length > 0 && (
          <section>
            <h2 className="mb-3 text-[12px] font-bold uppercase tracking-[0.08em] text-olive">
              Guides & recettes
            </h2>
            <ul className="space-y-3">
              {matchedEbooks.map((ebook) => (
                <li key={ebook.id}>
                  <Link
                    href={`/ebooks/${ebook.id}`}
                    className="flex gap-3 rounded-2xl border border-sand/70 bg-white p-3 transition-colors hover:border-olive/40"
                  >
                    <span className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={ebook.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="72px"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-olive">
                        {ebook.category}
                      </span>
                      <span className="mt-0.5 block text-[14px] font-bold leading-snug text-ink">
                        {ebook.title}
                      </span>
                      <span className="mt-1 line-clamp-2 block text-[12px] text-muted">
                        {ebook.subtitle || ebook.description}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
