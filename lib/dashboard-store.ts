import {
  api,
  clearAuth,
  getToken,
  setCurrentUser,
  setToken,
  type AuthUser,
} from "@/lib/api";
import {
  contentLanguage,
  type ContentLanguage,
} from "@/lib/content-language";
import {
  clearEmailAcceptance,
  resolveEmailAcceptance,
  setEmailAcceptance,
} from "@/lib/email-acceptance";
import {
  getNewsletterOptIn,
  hasNewsletterOptIn,
  readAcceptedFlag,
  setNewsletterOptIn,
} from "@/lib/newsletter-preference";

export type { ContentLanguage } from "@/lib/content-language";

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
  language: ContentLanguage;
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
  language: ContentLanguage;
  featured: boolean;
  categories: ContentCategory[];
  isRecipe: boolean;
  recipeMeta?: RecipeMeta;
  title: string;
  subtitle: string;
  author: string;
  delivery: "immediate" | "email-after-pay";
  pages: string;
  /** Cover image URL */
  image: string;
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
      articles: (parsed.articles ?? []).map((item) =>
        asDashArticle(item as DashArticle & { id: string })
      ),
      ebooks: (parsed.ebooks ?? []).map((item) =>
        asDashEbook(item as DashEbook & { id: string })
      ),
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

function asDashArticle(item: Partial<DashArticle> & { id: string }): DashArticle {
  return {
    id: String(item.id),
    language: contentLanguage(item.language),
    categories: Array.isArray(item.categories) ? item.categories : [],
    image: item.image ?? "",
    title: item.title ?? "",
    subtitle: item.subtitle ?? "",
    keyPoints: Array.isArray(item.keyPoints) ? item.keyPoints : [],
    author: item.author ?? "",
    introduction: item.introduction ?? "",
    sections: Array.isArray(item.sections) ? item.sections : [],
    tip: item.tip ?? "",
    tags: Array.isArray(item.tags) ? item.tags : [],
    createdAt: item.createdAt ? String(item.createdAt) : "",
  };
}

function asDashEbook(item: Partial<DashEbook> & { id: string }): DashEbook {
  return {
    id: String(item.id),
    language: contentLanguage(item.language),
    featured: Boolean(item.featured),
    categories: Array.isArray(item.categories) ? item.categories : [],
    isRecipe: Boolean(item.isRecipe),
    recipeMeta: item.recipeMeta,
    title: item.title ?? "",
    subtitle: item.subtitle ?? "",
    author: item.author ?? "",
    delivery: item.delivery === "email-after-pay" ? "email-after-pay" : "immediate",
    pages: item.pages ?? "",
    image: item.image ?? "",
    pdfUrl: item.pdfUrl ?? "",
    pdfFileName: item.pdfFileName ?? "",
    highlights: Array.isArray(item.highlights) ? item.highlights : [],
    about: item.about ?? "",
    summary: Array.isArray(item.summary) ? item.summary : [],
    tip: item.tip ?? "",
    tags: Array.isArray(item.tags) ? item.tags : [],
    createdAt: item.createdAt ? String(item.createdAt) : "",
  };
}

function emailKey(email: string) {
  return email.trim().toLowerCase();
}

function apiAcceptedFlag(
  item: {
    accepted?: unknown;
    acceptEmails?: unknown;
    subscribed?: unknown;
  },
  fallback: boolean
): boolean {
  const raw = item.accepted ?? item.acceptEmails ?? item.subscribed;
  if (raw === undefined || raw === null || raw === "") return fallback;
  return readAcceptedFlag(raw, fallback);
}

function asDashEmail(
  item: Omit<Partial<DashEmail>, "accepted"> & {
    id: string;
    email: string;
    accepted?: unknown;
    acceptEmails?: unknown;
    subscribed?: unknown;
  },
  fallbackAccepted = true
): DashEmail {
  return {
    id: String(item.id),
    email: item.email,
    name: item.name,
    source: item.source === "account" ? "account" : "newsletter",
    accepted: apiAcceptedFlag(item, fallbackAccepted),
    createdAt: item.createdAt ? String(item.createdAt) : "",
  };
}

function hasApiAcceptedField(item: {
  accepted?: unknown;
  acceptEmails?: unknown;
  subscribed?: unknown;
}) {
  return (
    item.accepted !== undefined ||
    item.acceptEmails !== undefined ||
    item.subscribed !== undefined
  );
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
    store.articles = articles.map((item) => asDashArticle(item));
    store.ebooks = ebooks.map((item) => asDashEbook(item));

    if (getToken()) {
      try {
        const [users, emails] = await Promise.all([
          api<Omit<DashUser, "password">[]>("/user", { auth: true }),
          api<
            Array<
              Partial<DashEmail> & {
                id: string;
                email: string;
                accepted?: unknown;
                acceptEmails?: unknown;
                subscribed?: unknown;
              }
            >
          >("/newsletter", { auth: true }),
        ]);
        store.users = users.map((u) => asDashUser(u));

        // Prefer API `accepted` when present; otherwise keep local/cache fallbacks.
        const prevByEmail = new Map(
          store.emails.map((e) => [emailKey(e.email), e] as const)
        );
        store.emails = emails.map((item) => {
          if (hasApiAcceptedField(item)) {
            const row = asDashEmail(item, true);
            setNewsletterOptIn(row.email, row.accepted);
            setEmailAcceptance(row.email, row.accepted);
            return row;
          }
          const prev = prevByEmail.get(emailKey(item.email));
          let fallback = true;
          if (typeof prev?.accepted === "boolean") fallback = prev.accepted;
          if (hasNewsletterOptIn(item.email)) {
            fallback = getNewsletterOptIn(item.email);
          }
          fallback = resolveEmailAcceptance(item.email, fallback);
          return asDashEmail(item, fallback);
        });
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
    language: contentLanguage(input.language),
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
    store.articles = store.articles.map((a) =>
      a.id === input.id ? asDashArticle(updated) : a
    );
    writeCache(store);
    return;
  }

  const created = await api<DashArticle>("/article", {
    method: "POST",
    auth: true,
    body,
  });
  const store = readCache();
  store.articles.unshift(asDashArticle(created));
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
    language: contentLanguage(input.language),
    featured: input.featured,
    categories: input.categories,
    isRecipe: input.isRecipe,
    recipeMeta: input.recipeMeta,
    title: input.title,
    subtitle: input.subtitle,
    author: input.author,
    delivery: input.delivery,
    pages: input.pages,
    image: input.image,
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
    store.ebooks = store.ebooks.map((e) =>
      e.id === input.id ? asDashEbook(updated) : e
    );
    writeCache(store);
    return;
  }

  const created = await api<DashEbook>("/ebook", {
    method: "POST",
    auth: true,
    body,
  });
  const store = readCache();
  store.ebooks.unshift(asDashEbook(created));
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
  const key = emailKey(input.email);
  const store = readCache();
  const existing = store.emails.find((e) => emailKey(e.email) === key);

  const data = await api<{
    id?: string;
    email?: string;
    name?: string;
    source?: "newsletter" | "account";
    accepted?: unknown;
    acceptEmails?: unknown;
    createdAt?: string;
  }>("/newsletter", {
    method: "POST",
    body: {
      email: input.email,
      name: input.name,
      source: input.source,
      accepted,
      acceptEmails: accepted,
    },
  });

  const savedAccepted = apiAcceptedFlag(data, accepted);
  const id = data.id || existing?.id || `${Date.now()}`;

  setNewsletterOptIn(input.email, savedAccepted);
  setEmailAcceptance(input.email, savedAccepted);

  const normalized: DashEmail = {
    id: String(id),
    email: data.email || input.email,
    name: data.name || input.name,
    source: (data.source || input.source) === "account" ? "account" : "newsletter",
    accepted: savedAccepted,
    createdAt: data.createdAt ? String(data.createdAt) : existing?.createdAt || "",
  };

  const next = readCache();
  const idx = next.emails.findIndex((e) => emailKey(e.email) === key);
  if (idx >= 0) next.emails[idx] = { ...next.emails[idx], ...normalized, accepted: savedAccepted };
  else next.emails.unshift(normalized);
  writeCache(next);
}

/** Toggle "Accepte les emails" in the admin dashboard (Oui / Non). */
export async function setEmailAccepted(
  id: string,
  accepted: boolean,
  hint?: Pick<DashEmail, "email" | "name" | "source">
) {
  const store = readCache();
  const current =
    store.emails.find((e) => e.id === id) ||
    (hint
      ? {
          id,
          email: hint.email,
          name: hint.name,
          source: hint.source,
          accepted: !accepted,
          createdAt: "",
        }
      : undefined);
  if (!current?.email) throw new Error("Email introuvable.");

  const data = await api<{
    msg?: string;
    item?: Partial<DashEmail> & { accepted?: unknown; acceptEmails?: unknown };
  }>(`/newsletter/${id}`, {
    method: "PATCH",
    auth: true,
    body: {
      accepted,
      acceptEmails: accepted,
      email: current.email,
      name: current.name,
      source: current.source,
    },
  });

  const savedAccepted = apiAcceptedFlag(data.item || { accepted }, accepted);
  setEmailAcceptance(current.email, savedAccepted);
  setNewsletterOptIn(current.email, savedAccepted);

  const next = readCache();
  const idx = next.emails.findIndex(
    (e) => e.id === id || emailKey(e.email) === emailKey(current.email)
  );
  if (idx >= 0) {
    next.emails[idx] = { ...next.emails[idx], accepted: savedAccepted };
  } else {
    next.emails.unshift({ ...current, accepted: savedAccepted });
  }
  writeCache(next);
}

export async function deleteEmail(id: string) {
  const store = readCache();
  const current = store.emails.find((e) => e.id === id);

  try {
    await api(`/newsletter/${id}`, { method: "DELETE", auth: true });
  } catch (err) {
    // Still drop from the local list if the row was already gone on the server.
    if (!current) throw err;
    const status = err && typeof err === "object" && "status" in err ? Number(err.status) : 0;
    if (status !== 404) throw err;
  }

  if (current) {
    setNewsletterOptIn(current.email, false);
    clearEmailAcceptance(current.email);
  }

  const next = readCache();
  next.emails = next.emails.filter((e) => e.id !== id);
  writeCache(next);
}

/** Resolve newsletter acceptance for the logged-in user (API + local cache). */
export async function resolveNewsletterAccepted(
  email: string,
  profileHint?: boolean
): Promise<boolean> {
  const normalized = emailKey(email);

  // Profile payload is authoritative when the API includes newsletterAccepted.
  if (typeof profileHint === "boolean") {
    setNewsletterOptIn(email, profileHint);
    setEmailAcceptance(email, profileHint);
    return profileHint;
  }

  if (getToken()) {
    try {
      const emails = await api<
        Array<
          Partial<DashEmail> & {
            id: string;
            email: string;
            accepted?: unknown;
            acceptEmails?: unknown;
          }
        >
      >("/newsletter", { auth: true });
      const match = emails.find((e) => emailKey(e.email) === normalized);
      if (match) {
        const accepted = apiAcceptedFlag(match, true);
        setNewsletterOptIn(email, accepted);
        setEmailAcceptance(email, accepted);
        return accepted;
      }
      setNewsletterOptIn(email, false);
      setEmailAcceptance(email, false);
      return false;
    } catch {
      // Non-admin users cannot list newsletters — use cache
    }
  }

  if (hasNewsletterOptIn(email)) {
    return getNewsletterOptIn(email);
  }
  return resolveEmailAcceptance(email, false);
}

function toAuthUser(user: {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
  newsletterAccepted?: unknown;
  acceptedEmails?: unknown;
  acceptEmails?: unknown;
}): AuthUser {
  const rawAccepted =
    user.newsletterAccepted ?? user.acceptedEmails ?? user.acceptEmails;
  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    role: user.role === "admin" ? "admin" : "user",
    createdAt: user.createdAt ? String(user.createdAt) : undefined,
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

    user.newsletterAccepted = await resolveNewsletterAccepted(
      user.email,
      user.newsletterAccepted
    );

    // Silent: callers already hold the result; notifying would re-trigger profile load loops.
    setCurrentUser(user, { notify: false });
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
