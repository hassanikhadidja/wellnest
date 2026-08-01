import { getApiBase } from "@/lib/api";
import type { Article } from "@/lib/articles";
import type { Ebook } from "@/lib/ebooks";
import type { DashArticle, DashEbook } from "@/lib/dashboard-store";

function estimateReadTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(3, Math.round(words / 180));
  return `${minutes} min de lecture`;
}

export function mapDashArticle(a: DashArticle): Article {
  const bodyText = [a.introduction, ...a.sections.map((s) => s.text)].join(" ");
  return {
    id: a.id,
    category: a.categories[0] || "Santé Globale",
    title: a.title,
    subtitle: a.subtitle,
    excerpt: a.introduction || a.subtitle || a.keyPoints[0] || "",
    date: a.createdAt,
    readTime: estimateReadTime(bodyText),
    image: a.image || "/images/article-1.jpg",
    author: {
      name: a.author || "WELLNEST",
      role: "Nutritionniste",
    },
    keyPoints: a.keyPoints,
    introduction: a.introduction,
    sections: a.sections.map((s) => ({
      title: s.title,
      subtitle: s.note || undefined,
      body: s.text,
      image: s.image || undefined,
    })),
    tip: a.tip,
  };
}

export function mapDashEbook(e: DashEbook): Ebook {
  const metaParts = [
    e.recipeMeta?.time,
    e.recipeMeta?.difficulty?.toUpperCase(),
    e.recipeMeta?.people ? `${e.recipeMeta.people} PERS.` : "",
  ].filter(Boolean);

  return {
    id: e.id,
    category: e.categories[0] || (e.isRecipe ? "Recettes" : "Guides Pratiques"),
    title: e.title,
    subtitle: e.subtitle,
    description: e.about || e.subtitle,
    pages: e.pages ? (e.pages.includes("page") ? e.pages : `${e.pages} pages`) : "",
    date: e.createdAt,
    image: "/images/article-1.jpg",
    delivery:
      e.delivery === "immediate"
        ? "Téléchargement immédiat"
        : "Par mail après paiement",
    author: {
      name: e.author || "WELLNEST",
      role: e.isRecipe ? "Recette" : "Nutritionniste",
    },
    highlights: e.highlights,
    introduction: e.about,
    contents: e.summary,
    tip: e.tip,
    productType: e.isRecipe ? "recipe" : "ebook",
    pricing: e.delivery === "email-after-pay" ? "paid" : "free",
    featured: e.featured,
    label: e.featured ? "E-BOOK À LA UNE" : undefined,
    isRecipe: e.isRecipe,
    meta: e.isRecipe ? metaParts.join(" — ") : undefined,
    cardAuthor: e.author || "WELLNEST",
  };
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${getApiBase()}${path}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchArticlesFromApi(): Promise<Article[]> {
  const data = await fetchJson<DashArticle[]>("/article");
  if (!data?.length) return [];
  return data.map(mapDashArticle);
}

export async function fetchArticleFromApi(id: string): Promise<Article | null> {
  const data = await fetchJson<DashArticle>(`/article/${id}`);
  if (!data?.id) return null;
  return mapDashArticle(data);
}

export async function fetchEbooksFromApi(): Promise<Ebook[]> {
  const data = await fetchJson<DashEbook[]>("/ebook");
  if (!data?.length) return [];
  return data.map(mapDashEbook);
}

export async function fetchEbookFromApi(id: string): Promise<Ebook | null> {
  const data = await fetchJson<DashEbook>(`/ebook/${id}`);
  if (!data?.id) return null;
  return mapDashEbook(data);
}
