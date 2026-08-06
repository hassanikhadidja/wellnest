import type { ContentLanguage } from "@/lib/content-language";

export type ProductType = "ebook" | "recipe" | "grocery";
export type Pricing = "free" | "paid";

export type SortFilter =
  | "recent"
  | "recipe-free"
  | "recipe-paid"
  | "grocery-free"
  | "grocery-paid"
  | "ebook";

export const sortFilters: { id: SortFilter; label: string }[] = [
  { id: "recent", label: "Plus récentes" },
  { id: "recipe-free", label: "Recettes gratuites" },
  { id: "recipe-paid", label: "Recettes payantes" },
  { id: "grocery-free", label: "Liste de courses gratuite" },
  { id: "grocery-paid", label: "Liste de courses payante" },
  { id: "ebook", label: "Guides Pratiques" },
];

export type Ebook = {
  id: string;
  language?: ContentLanguage;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  pages: string;
  date: string;
  image: string;
  delivery: string;
  author: {
    name: string;
    role: string;
  };
  highlights: string[];
  introduction: string;
  contents: string[];
  tip: string;
  productType: ProductType;
  pricing: Pricing;
  featured?: boolean;
  label?: string;
  /** Homepage Recettes Healthy cards */
  isRecipe?: boolean;
  meta?: string;
  badge?: string;
  cardAuthor?: string;
};

export const ebookCategories = [
  "Tous",
  "Nutrition Maman",
  "Bébé & Enfant",
  "Santé Globale",
  "Bien-être",
  "Recettes",
  "Guides Pratiques",
] as const;

/** No static demos — content comes from the API only. */
export const ebooks: Ebook[] = [];

export const featuredEbook: Ebook | undefined = undefined;

export const healthyRecipes: Ebook[] = [];

export function getEbookById(id: string) {
  return ebooks.find((ebook) => ebook.id === id);
}

export async function resolveEbooks() {
  const { fetchEbooksFromApi } = await import("@/lib/content-api");
  return fetchEbooksFromApi();
}

export async function resolveEbookById(id: string) {
  const { fetchEbookFromApi } = await import("@/lib/content-api");
  return fetchEbookFromApi(id);
}

export async function resolveFeaturedEbook(): Promise<Ebook | null> {
  const list = await resolveEbooks();
  return list.find((ebook) => ebook.featured) ?? list[0] ?? null;
}

export async function resolveHealthyRecipes() {
  const list = await resolveEbooks();
  return list.filter((ebook) => ebook.isRecipe);
}
