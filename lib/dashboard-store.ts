import { api, getToken, setToken } from "@/lib/api";

export const CONTENT_CATEGORIES = [
  "Nutrition Maman",
  "Bébé & Enfant",
  "Enfants & Adolescents",
  "Santé Globale",
  "Bien-être & Équilibre",
] as const;

export type ContentCategory = (typeof CONTENT_CATEGORIES)[number];
export type UserRole = "user" | "admin";

export type DashUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
};

export type ArticleSection = {
  id: string;
  title: string;
  note: string;
  text: string;
  image: string;
};

export type DashArticle = {
  id: string;
  categories: ContentCategory[];
  image: string;
  title: string;
  subtitle: string;
  keyPoints: string[];
  author: string;
  introduction: string;
  sections: ArticleSection[];
  tip: string;
  tags: string[];
  createdAt: string;
};

export type RecipeMeta = {
  time: string;
  difficulty: "facile" | "moyen" | "difficile";
  people: string;
};

export type DashEbook = {
  id: string;
  featured: boolean;
  categories: ContentCategory[];
  isRecipe: boolean;
  recipeMeta?: RecipeMeta;
  title: string;
  subtitle: string;
  author: string;
  delivery: "immediate" | "email-after-pay";
  pages: string;
  pdfUrl: string;
  pdfFileName: string;
  highlights: string[];
  about: string;
  summary: string[];
  tip: string;
  tags: string[];
  createdAt: string;
};

export type DashEmail = {
  id: string;
  email: string;
  name?: string;
  source: "newsletter" | "account";
  createdAt: string;
};

type Store = {
  users: DashUser[];
  articles: DashArticle[];
  ebooks: DashEbook[];
  emails: DashEmail[];
};

const KEY = "wellnest-dashboard-v1";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function todayLabel() {
  return new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const defaultStore: Store = {
  users: [],
  articles: [],
  ebooks: [],
  emails: [],
};

function notify() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("wellnest-store-updated"));
  }
}

function readCache(): Store {
  if (typeof window === "undefined") return structuredClone(defaultStore);
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(defaultStore);
    const parsed = JSON.parse(raw) as Partial<Store>;
    return {
      users: parsed.users ?? [],
      articles: parsed.articles ?? [],
      ebooks: parsed.ebooks ?? [],
      emails: parsed.emails ?? [],
    };
  } catch {
    return structuredClone(defaultStore);
  }
}

function writeCache(store: Store) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(store));
  notify();
}

function asDashUser(u: Omit<DashUser, "password"> & { password?: string }): DashUser {
  return { ...u, password: u.password ?? "" };
}

export function getStore() {
  return readCache();
}

export async function refreshStore(): Promise<Store> {
  const store = readCache();
  try {
    const [articles, ebooks] = await Promise.all([
      api<DashArticle[]>("/article"),
      api<DashEbook[]>("/ebook"),
    ]);
    store.articles = articles;
    store.ebooks = ebooks;

    if (getToken()) {
      try {
        const [users, emails] = await Promise.all([
          api<Omit<DashUser, "password">[]>("/user", { auth: true }),
          api<DashEmail[]>("/newsletter", { auth: true }),
        ]);
        store.users = users.map((u) => asDashUser(u));
        store.emails = emails;
      } catch {
        // keep cached admin data if token expired / not admin
      }
    }

    writeCache(store);
    return store;
  } catch {
    return store;
  }
}

export async function saveUser(
  input: Omit<DashUser, "id" | "createdAt"> & { id?: string }
) {
  if (input.id) {
    const updated = await api<{ user: Omit<DashUser, "password"> }>(
      `/user/${input.id}`,
      {
        method: "PATCH",
        auth: true,
        body: {
          name: input.name,
          email: input.email,
          role: input.role,
          ...(input.password ? { password: input.password } : {}),
        },
      }
    );
    const store = readCache();
    store.users = store.users.map((u) =>
      u.id === input.id
        ? asDashUser({ ...updated.user, password: input.password || u.password })
        : u
    );
    writeCache(store);
    return;
  }

  const created = await api<Omit<DashUser, "password">>("/user", {
    method: "POST",
    auth: true,
    body: {
      name: input.name,
      email: input.email,
      password: input.password,
      role: input.role,
    },
  });
  const store = readCache();
  store.users.unshift(asDashUser({ ...created, password: input.password }));
  writeCache(store);
}

export async function deleteUser(id: string) {
  await api(`/user/${id}`, { method: "DELETE", auth: true });
  const store = readCache();
  store.users = store.users.filter((u) => u.id !== id);
  writeCache(store);
}

export async function saveArticle(
  input: Omit<DashArticle, "id" | "createdAt"> & { id?: string }
) {
  const body = {
    categories: input.categories,
    image: input.image,
    title: input.title,
    subtitle: input.subtitle,
    keyPoints: input.keyPoints,
    author: input.author,
    introduction: input.introduction,
    sections: input.sections,
    tip: input.tip,
    tags: input.tags,
  };

  if (input.id) {
    const updated = await api<DashArticle>(`/article/${input.id}`, {
      method: "PATCH",
      auth: true,
      body,
    });
    const store = readCache();
    store.articles = store.articles.map((a) => (a.id === input.id ? updated : a));
    writeCache(store);
    return;
  }

  const created = await api<DashArticle>("/article", {
    method: "POST",
    auth: true,
    body,
  });
  const store = readCache();
  store.articles.unshift(created);
  writeCache(store);
}

export async function deleteArticle(id: string) {
  await api(`/article/${id}`, { method: "DELETE", auth: true });
  const store = readCache();
  store.articles = store.articles.filter((a) => a.id !== id);
  writeCache(store);
}

export async function saveEbook(
  input: Omit<DashEbook, "id" | "createdAt"> & { id?: string }
) {
  const body = {
    featured: input.featured,
    categories: input.categories,
    isRecipe: input.isRecipe,
    recipeMeta: input.recipeMeta,
    title: input.title,
    subtitle: input.subtitle,
    author: input.author,
    delivery: input.delivery,
    pages: input.pages,
    pdfUrl: input.pdfUrl,
    pdfFileName: input.pdfFileName,
    highlights: input.highlights,
    about: input.about,
    summary: input.summary,
    tip: input.tip,
    tags: input.tags,
  };

  if (input.id) {
    const updated = await api<DashEbook>(`/ebook/${input.id}`, {
      method: "PATCH",
      auth: true,
      body,
    });
    const store = readCache();
    store.ebooks = store.ebooks.map((e) => (e.id === input.id ? updated : e));
    writeCache(store);
    return;
  }

  const created = await api<DashEbook>("/ebook", {
    method: "POST",
    auth: true,
    body,
  });
  const store = readCache();
  store.ebooks.unshift(created);
  writeCache(store);
}

export async function deleteEbook(id: string) {
  await api(`/ebook/${id}`, { method: "DELETE", auth: true });
  const store = readCache();
  store.ebooks = store.ebooks.filter((e) => e.id !== id);
  writeCache(store);
}

export async function upsertEmail(input: {
  email: string;
  name?: string;
  source: "newsletter" | "account";
}) {
  await api("/newsletter", {
    method: "POST",
    body: {
      email: input.email,
      name: input.name,
      source: input.source,
    },
  });
  await refreshStore();
}

export async function registerAccount(input: {
  name: string;
  email: string;
  password: string;
}) {
  const data = await api<{ token: string; user: Omit<DashUser, "password"> }>(
    "/user/register",
    {
      method: "POST",
      body: input,
    }
  );
  setToken(data.token);
  await refreshStore();
  return data.user;
}

export async function loginAccount(input: { email: string; password: string }) {
  const data = await api<{ token: string; user: Omit<DashUser, "password"> }>(
    "/user/login",
    {
      method: "POST",
      body: input,
    }
  );
  setToken(data.token);
  await refreshStore();
  return data.user;
}

export async function logoutAccount() {
  setToken(null);
  notify();
}

export function newSection(): ArticleSection {
  return { id: uid(), title: "", note: "", text: "", image: "" };
}

export function linesToList(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function listToLines(list: string[]) {
  return list.join("\n");
}

export function tagsFromInput(value: string) {
  return value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}
