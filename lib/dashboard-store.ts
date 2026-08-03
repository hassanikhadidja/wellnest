import {
  api,
  clearAuth,
  getToken,
  setCurrentUser,
  setToken,
  type AuthUser,
} from "@/lib/api";
import {
  getNewsletterOptIn,
  readAcceptedFlag,
  setNewsletterOptIn,
} from "@/lib/newsletter-preference";

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
  /** Whether this contact accepts emails / newsletter */
  accepted: boolean;
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
      emails: (parsed.emails ?? []).map((item) =>
        asDashEmail(item as DashEmail & { id: string; email: string })
      ),
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

function asDashEmail(
  item: Partial<DashEmail> & {
    id: string;
    email: string;
    accepted?: unknown;
    acceptEmails?: unknown;
    subscribed?: unknown;
  }
): DashEmail {
  const accepted = readAcceptedFlag(
    item.accepted ?? item.acceptEmails ?? item.subscribed,
    true
  );
  return {
    id: String(item.id),
    email: item.email,
    name: item.name,
    source: item.source === "account" ? "account" : "newsletter",
    accepted,
    createdAt: item.createdAt ? String(item.createdAt) : "",
  };
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
        store.emails = emails.map((item) => asDashEmail(item));
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
  accepted?: boolean;
}) {
  const accepted = input.accepted !== false;
  const data = await api<{
    id?: string;
    email?: string;
    name?: string;
    source?: "newsletter" | "account";
    accepted?: unknown;
    createdAt?: string;
  }>("/newsletter", {
    method: "POST",
    body: {
      email: input.email,
      name: input.name,
      source: input.source,
      accepted,
    },
  });

  setNewsletterOptIn(input.email, accepted);

  const store = readCache();
  const normalized = asDashEmail({
    id: data.id || `${Date.now()}`,
    email: data.email || input.email,
    name: data.name || input.name,
    source: data.source || input.source,
    accepted: data.accepted ?? accepted,
    createdAt: data.createdAt,
  });
  const idx = store.emails.findIndex(
    (e) => e.email.trim().toLowerCase() === normalized.email.trim().toLowerCase()
  );
  if (idx >= 0) store.emails[idx] = { ...store.emails[idx], ...normalized, accepted };
  else store.emails.unshift(normalized);
  writeCache(store);

  await refreshStore();
}

export async function setEmailAccepted(id: string, accepted: boolean) {
  const store = readCache();
  const current = store.emails.find((e) => e.id === id);

  try {
    await api(`/newsletter/${id}`, {
      method: "PATCH",
      auth: true,
      body: { accepted },
    });
  } catch {
    if (!current) throw new Error("Email introuvable.");
    await api("/newsletter", {
      method: "POST",
      body: {
        email: current.email,
        name: current.name,
        source: current.source,
        accepted,
      },
    });
  }

  if (current) setNewsletterOptIn(current.email, accepted);

  const next = readCache();
  next.emails = next.emails.map((e) => (e.id === id ? { ...e, accepted } : e));
  writeCache(next);
  await refreshStore();
}

export async function deleteEmail(id: string) {
  const store = readCache();
  const current = store.emails.find((e) => e.id === id);

  await api(`/newsletter/${id}`, { method: "DELETE", auth: true });

  if (current) setNewsletterOptIn(current.email, false);

  const next = readCache();
  next.emails = next.emails.filter((e) => e.id !== id);
  writeCache(next);
}

/** Resolve newsletter acceptance for the logged-in user (API + local cache). */
export async function resolveNewsletterAccepted(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();

  if (getToken()) {
    try {
      const emails = await api<
        Array<Partial<DashEmail> & { id: string; email: string }>
      >("/newsletter", { auth: true });
      const match = emails.find((e) => e.email.trim().toLowerCase() === normalized);
      if (match) {
        const accepted = asDashEmail(match).accepted;
        setNewsletterOptIn(email, accepted);
        return accepted;
      }
      // Listed nowhere → not accepted yet
      setNewsletterOptIn(email, false);
      return false;
    } catch {
      // Non-admin users cannot list newsletters — use cache / profile
    }
  }

  return getNewsletterOptIn(email);
}

function toAuthUser(
  user: (Omit<DashUser, "password"> | AuthUser) & {
    newsletterAccepted?: unknown;
    acceptedEmails?: unknown;
    acceptEmails?: unknown;
  }
): AuthUser {
  const rawAccepted =
    user.newsletterAccepted ?? user.acceptedEmails ?? user.acceptEmails;
  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    role: user.role === "admin" ? "admin" : "user",
    createdAt: "createdAt" in user && user.createdAt ? String(user.createdAt) : undefined,
    newsletterAccepted:
      rawAccepted === undefined ? undefined : readAcceptedFlag(rawAccepted, false),
  };
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
  setCurrentUser(toAuthUser(data.user));
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
  setCurrentUser(toAuthUser(data.user));
  await refreshStore();
  return data.user;
}

export async function fetchCurrentProfile(): Promise<AuthUser | null> {
  if (!getToken()) return null;
  try {
    const data = await api<
      | AuthUser
      | {
          user: AuthUser;
          newsletterAccepted?: unknown;
          acceptedEmails?: unknown;
        }
      | Omit<DashUser, "password">
    >("/user/profile", { auth: true });

    const nested =
      data && typeof data === "object" && "user" in data
        ? (data as { user: AuthUser }).user
        : null;
    const raw = nested || data;
    if (!raw || typeof raw !== "object" || !("email" in raw) || !("name" in raw)) {
      return null;
    }

    const root = data as {
      newsletterAccepted?: unknown;
      acceptedEmails?: unknown;
      acceptEmails?: unknown;
    };
    const user = toAuthUser({
      ...(raw as AuthUser),
      newsletterAccepted:
        (raw as AuthUser).newsletterAccepted ??
        root.newsletterAccepted ??
        root.acceptedEmails ??
        root.acceptEmails,
    });

    if (typeof user.newsletterAccepted === "boolean") {
      setNewsletterOptIn(user.email, user.newsletterAccepted);
    } else {
      user.newsletterAccepted = await resolveNewsletterAccepted(user.email);
    }

    setCurrentUser(user);
    return user;
  } catch {
    return null;
  }
}

export async function logoutAccount() {
  clearAuth();
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
