import type { ContentLanguage } from "@/lib/content-language";

export type Article = {
  id: string;
  language?: ContentLanguage;
  category: string;
  title: string;
  subtitle: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  author: {
    name: string;
    role: string;
  };
  keyPoints: string[];
  introduction: string;
  sections: {
    title: string;
    subtitle?: string;
    body: string;
    image?: string;
  }[];
  tip: string;
};

export const articleCategories = [
  "Tous",
  "Nutrition Maman",
  "Bébé & Enfant",
  "Santé Globale",
  "Bien-être",
] as const;

/** No static demos — content comes from the API only. */
export const articles: Article[] = [];

export function getArticleById(id: string) {
  return articles.find((article) => article.id === id);
}

export async function resolveArticles() {
  const { fetchArticlesFromApi } = await import("@/lib/content-api");
  return fetchArticlesFromApi();
}

export async function resolveArticleById(id: string) {
  const { fetchArticleFromApi } = await import("@/lib/content-api");
  return fetchArticleFromApi(id);
}
