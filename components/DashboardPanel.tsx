"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { api, getCurrentUser, getToken } from "@/lib/api";
import {
  CONTENT_LANGUAGES,
  contentLanguage,
  contentLanguageLabel,
  setStoredContentLanguage,
  type ContentLanguage,
} from "@/lib/content-language";
import {
  CONTENT_CATEGORIES,
  type ContentCategory,
  type DashArticle,
  type DashEbook,
  type DashEmail,
  type DashUser,
  type UserRole,
  deleteArticle,
  deleteEbook,
  deleteUser,
  linesToList,
  listToLines,
  newSection,
  deleteEmail,
  getStore,
  refreshStore,
  saveArticle,
  saveEbook,
  saveUser,
  setEmailAccepted,
  tagsFromInput,
  upsertEmail,
} from "@/lib/dashboard-store";
import {
  getEmailAcceptance,
  setEmailAcceptance,
} from "@/lib/email-acceptance";

type SectionId = "users" | "articles" | "ebooks" | "emails";

const emptyUser = (): Omit<DashUser, "id" | "createdAt"> & { id?: string } => ({
  name: "",
  email: "",
  password: "",
  role: "user",
});

const emptyArticle = (): Omit<DashArticle, "id" | "createdAt"> & { id?: string } => ({
  language: "fr",
  categories: [],
  image: "",
  title: "",
  subtitle: "",
  keyPoints: [""],
  author: "",
  introduction: "",
  sections: [newSection()],
  tip: "",
  tags: [],
});

const emptyEmailForm = () => ({
  email: "",
  name: "",
  source: "newsletter" as "newsletter" | "account",
  accepted: true,
});

const emptyEbook = (): Omit<DashEbook, "id" | "createdAt"> & { id?: string } => ({
  language: "fr",
  featured: false,
  categories: [],
  isRecipe: false,
  recipeMeta: { time: "", difficulty: "facile", people: "" },
  title: "",
  subtitle: "",
  author: "",
  delivery: "immediate",
  pages: "",
  image: "",
  pdfUrl: "",
  pdfFileName: "",
  highlights: [""],
  about: "",
  summary: [""],
  tip: "",
  tags: [],
});

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-semibold text-ink">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-sand bg-cream/40 px-3 py-2 text-[13px] text-ink outline-none focus:border-olive";

async function uploadAsset(file: File, folder: string, resourceType: "image" | "raw" = "image") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  formData.append("resourceType", resourceType);
  return api<{ url: string; fileName?: string }>("/upload", {
    method: "POST",
    auth: true,
    formData,
  });
}

function FilePickButton({
  accept,
  disabled,
  label,
  onFile,
}: {
  accept: string;
  disabled?: boolean;
  label: string;
  onFile: (file: File) => void;
}) {
  const inputId = useId();

  return (
    <div className="mt-2">
      <input
        id={inputId}
        type="file"
        accept={accept}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => {
          const input = e.currentTarget;
          const file = input.files?.[0];
          if (!file) return;
          onFile(file);
          input.value = "";
        }}
      />
      <label
        htmlFor={inputId}
        className={`inline-flex cursor-pointer items-center justify-center rounded-full px-4 py-2 text-[11px] font-bold tracking-[0.06em] transition-colors ${
          disabled
            ? "cursor-not-allowed bg-sand text-ink/40"
            : "bg-olive text-white hover:bg-olive-dark"
        }`}
      >
        {label}
      </label>
    </div>
  );
}

function ImageUrlField({
  label,
  value,
  onChange,
  folder,
  onError,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: string;
  onError: (msg: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  return (
    <div className="block">
      <span className="mb-1 block text-[12px] font-semibold text-ink">{label}</span>
      <input
        className={inputClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://..."
      />
      <FilePickButton
        accept="image/*"
        disabled={uploading}
        label={uploading ? "UPLOAD…" : "CHOISIR UNE IMAGE"}
        onFile={(file) => {
          void (async () => {
            setUploading(true);
            try {
              const uploaded = await uploadAsset(file, folder, "image");
              onChange(uploaded.url);
            } catch (err) {
              onError(err instanceof Error ? err.message : "Échec upload image");
            } finally {
              setUploading(false);
            }
          })();
        }}
      />
      <p className="mt-1 text-[11px] text-muted">
        {uploading ? "Upload en cours…" : "Collez un lien ou choisissez une image depuis votre appareil"}
      </p>
      {value ? (
        // Preview; remote Cloudinary URLs may vary
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="mt-2 h-20 w-auto max-w-full rounded-lg border border-sand object-cover"
        />
      ) : null}
    </div>
  );
}

function CategoryPicker({
  value,
  onChange,
}: {
  value: ContentCategory[];
  onChange: (next: ContentCategory[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {CONTENT_CATEGORIES.map((cat) => {
        const active = value.includes(cat);
        return (
          <button
            key={cat}
            type="button"
            onClick={() =>
              onChange(active ? value.filter((c) => c !== cat) : [...value, cat])
            }
            className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
              active ? "bg-olive text-white" : "bg-cream text-ink/70"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

function LanguagePicker({
  value,
  onChange,
}: {
  value: ContentLanguage;
  onChange: (next: ContentLanguage) => void;
}) {
  return (
    <div className="space-y-1.5">
      <span className="mb-1 block text-[12px] font-semibold text-ink">Langue</span>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Langue du contenu">
        {CONTENT_LANGUAGES.map((lang) => {
          const active = value === lang.id;
          return (
            <button
              key={lang.id}
              type="button"
              aria-pressed={active}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange(lang.id);
              }}
              className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-colors ${
                active
                  ? "bg-olive text-white"
                  : "border border-sand bg-white text-ink/70 hover:border-olive/40 hover:text-olive"
              }`}
            >
              {lang.short} — {lang.label}
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-muted">
        {value === "ar"
          ? "Langue actuelle : العربية — écriture de droite à gauche activée."
          : "Langue actuelle : Français — cliquez sur AR pour passer en arabe (et inversement)."}
      </p>
    </div>
  );
}

function textDir(language?: string | null): "rtl" | "ltr" {
  return contentLanguage(language) === "ar" ? "rtl" : "ltr";
}

function LanguageBadge({ language }: { language?: string | null }) {
  const lang = contentLanguage(language);
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
        lang === "ar" ? "bg-brown/15 text-brown" : "bg-olive/15 text-olive"
      }`}
    >
      {lang === "ar" ? "AR" : "FR"}
    </span>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/40 p-3 sm:items-center">
      <div className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-4 shadow-xl sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
          <button type="button" onClick={onClose} className="text-[13px] font-semibold text-muted hover:text-olive">
            Fermer
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function DashboardPanel() {
  const [active, setActive] = useState<SectionId>("users");
  const [users, setUsers] = useState<DashUser[]>([]);
  const [articles, setArticles] = useState<DashArticle[]>([]);
  const [ebooks, setEbooks] = useState<DashEbook[]>([]);
  const [emails, setEmails] = useState<DashEmail[]>([]);

  const [userForm, setUserForm] = useState<ReturnType<typeof emptyUser> | null>(null);
  const [articleForm, setArticleForm] = useState<ReturnType<typeof emptyArticle> | null>(null);
  const [ebookForm, setEbookForm] = useState<ReturnType<typeof emptyEbook> | null>(null);
  const [emailForm, setEmailForm] = useState<ReturnType<typeof emptyEmailForm> | null>(null);
  const [keyPointsText, setKeyPointsText] = useState("");
  const [articleTags, setArticleTags] = useState("");
  const [highlightsText, setHighlightsText] = useState("");
  const [summaryText, setSummaryText] = useState("");
  const [ebookTags, setEbookTags] = useState("");

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const refresh = async () => {
    const token = Boolean(getToken());
    const user = getCurrentUser();
    setAuthed(token);
    setIsAdmin(token && user?.role === "admin");
    const store = await refreshStore();
    setUsers(store.users);
    setArticles(store.articles);
    setEbooks(store.ebooks);
    setEmails(store.emails);
  };

  useEffect(() => {
    void refresh();
    const syncFromCache = () => {
      const token = Boolean(getToken());
      const user = getCurrentUser();
      setAuthed(token);
      setIsAdmin(token && user?.role === "admin");
      const store = getStore();
      setUsers(store.users);
      setArticles(store.articles);
      setEbooks(store.ebooks);
      setEmails(store.emails);
    };
    const onFocus = () => {
      void refresh();
    };
    window.addEventListener("wellnest-store-updated", syncFromCache);
    window.addEventListener("storage", onFocus);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("wellnest-store-updated", syncFromCache);
      window.removeEventListener("storage", onFocus);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setError("");
    try {
      await action();
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.");
    } finally {
      setBusy(false);
    }
  };

  const emailRows = useMemo(() => {
    // Only real /newsletter contacts — every row can be deleted.
    // Account users without a newsletter entry live under Utilisateurs.
    return emails.map((item) => {
      const override = getEmailAcceptance(item.email);
      return {
        ...item,
        accepted: typeof override === "boolean" ? override : item.accepted,
      };
    });
  }, [emails]);

  const sections = useMemo(
    () => [
      { id: "users" as const, label: "Utilisateurs", count: users.length },
      { id: "articles" as const, label: "Articles", count: articles.length },
      { id: "ebooks" as const, label: "E-books", count: ebooks.length },
      { id: "emails" as const, label: "Emails", count: emailRows.length },
    ],
    [users.length, articles.length, ebooks.length, emailRows.length]
  );

  if (authed && !isAdmin) {
    return (
      <div className="bg-cream/40 flex min-h-[calc(100dvh-var(--header-h))] items-center justify-center px-4 py-16">
        <div className="max-w-md rounded-2xl border border-sand/70 bg-white p-6 text-center shadow-sm">
          <h1 className="font-display text-2xl font-semibold text-ink">Accès admin requis</h1>
          <p className="mt-2 text-[13px] text-muted">
            Le tableau de bord est réservé aux administrateurs WELLNEST.
          </p>
          <Link
            href="/profil"
            className="mt-5 inline-flex rounded-full bg-olive px-5 py-3 text-[11px] font-bold tracking-[0.06em] text-white hover:bg-olive-dark"
          >
            Retour au profil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream/40 min-h-[calc(100dvh-var(--header-h))]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:gap-6 lg:px-8 lg:py-8">
        <aside className="w-full shrink-0 lg:w-56">
          <div className="rounded-2xl border border-sand/70 bg-white p-4 shadow-sm">
            <p className="font-display text-xl font-semibold text-ink">Dashboard</p>
            <p className="mt-1 text-[12px] text-muted">Gérez votre contenu WELLNEST</p>
            <nav className="mt-4 flex gap-2 overflow-x-auto lg:flex-col" aria-label="Sections dashboard">
              {sections.map((section) => {
                const isActive = section.id === active;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActive(section.id)}
                    className={`flex shrink-0 items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold ${
                      isActive ? "bg-olive text-white" : "bg-cream/70 text-ink/80 hover:bg-sand/60"
                    }`}
                  >
                    <span>{section.label}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] ${isActive ? "bg-white/20" : "bg-white text-muted"}`}>
                      {section.count}
                    </span>
                  </button>
                );
              })}
            </nav>
            <Link href="/" className="mt-4 hidden text-[12px] font-semibold text-olive hover:underline lg:inline-block">
              ← Retour au site
            </Link>
          </div>
        </aside>

        <section className="min-w-0 flex-1 rounded-2xl border border-sand/70 bg-white p-4 shadow-sm sm:p-6">
          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-[13px] font-medium text-red-700">
              {error}
            </p>
          )}
          {!authed && (
            <p className="mb-4 rounded-lg bg-cream px-3 py-2 text-[13px] text-ink">
              Connectez-vous en tant qu&apos;admin pour gérer utilisateurs et emails.{" "}
              <Link href="/profil" className="font-semibold text-olive hover:underline">
                Se connecter
              </Link>
            </p>
          )}
          {active === "users" && (
            <>
              <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h1 className="font-display text-2xl font-semibold text-ink">Utilisateurs</h1>
                  <p className="mt-1 text-[13px] text-muted">Ajouter, modifier ou supprimer par nom, email, mot de passe et rôle.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setUserForm(emptyUser())}
                  className="rounded-full bg-olive px-4 py-2 text-[11px] font-bold tracking-wide text-white hover:bg-olive-dark"
                >
                  + AJOUTER
                </button>
              </header>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-sand text-[11px] uppercase tracking-wide text-muted">
                      <th className="pb-2">Nom</th>
                      <th className="pb-2">Email</th>
                      <th className="pb-2">Mot de passe</th>
                      <th className="pb-2">Rôle</th>
                      <th className="pb-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-sand/60">
                        <td className="py-3 font-semibold">{user.name}</td>
                        <td className="py-3 text-muted">{user.email}</td>
                        <td className="py-3 font-mono text-[12px]">{user.password}</td>
                        <td className="py-3">
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${user.role === "admin" ? "bg-olive/15 text-olive" : "bg-cream text-muted"}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <button type="button" className="text-[12px] font-semibold text-olive" onClick={() => setUserForm(user)}>
                              Modifier
                            </button>
                            <button
                              type="button"
                              disabled={busy}
                              className="text-[12px] font-semibold text-red-700 disabled:opacity-50"
                              onClick={() => void run(() => deleteUser(user.id))}
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {active === "articles" && (
            <>
              <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h1 className="font-display text-2xl font-semibold text-ink">Articles</h1>
                  <p className="mt-1 text-[13px] text-muted">Ajouter, modifier ou supprimer des articles complets.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const draft = emptyArticle();
                    setArticleForm(draft);
                    setKeyPointsText("");
                    setArticleTags("");
                  }}
                  className="rounded-full bg-olive px-4 py-2 text-[11px] font-bold tracking-wide text-white hover:bg-olive-dark"
                >
                  + AJOUTER
                </button>
              </header>
              <ul className="space-y-3">
                {articles.length === 0 && <li className="text-[13px] text-muted">Aucun article pour le moment.</li>}
                {articles.map((article) => (
                  <li key={article.id} className="rounded-xl border border-sand/70 p-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <LanguageBadge language={article.language} />
                          <p className="text-[11px] font-bold uppercase tracking-wide text-olive">
                            {article.categories.join(" • ") || "Sans catégorie"}
                          </p>
                        </div>
                        <h3
                          className="mt-1 font-semibold text-ink"
                          dir={contentLanguage(article.language) === "ar" ? "rtl" : "ltr"}
                          lang={contentLanguage(article.language)}
                        >
                          {article.title}
                        </h3>
                        <p className="text-[12px] text-muted">
                          {contentLanguageLabel(article.language)} — {article.createdAt} — Par{" "}
                          {article.author || "—"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="text-[12px] font-semibold text-olive"
                          onClick={() => {
                            setArticleForm({
                              ...article,
                              language: contentLanguage(article.language),
                            });
                            setKeyPointsText(listToLines(article.keyPoints));
                            setArticleTags(article.tags.join(", "));
                          }}
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          className="text-[12px] font-semibold text-red-700 disabled:opacity-50"
                          onClick={() => void run(() => deleteArticle(article.id))}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {active === "ebooks" && (
            <>
              <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h1 className="font-display text-2xl font-semibold text-ink">E-books</h1>
                  <p className="mt-1 text-[13px] text-muted">Guides, recettes et listes avec PDF (lien ou fichier).</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEbookForm(emptyEbook());
                    setHighlightsText("");
                    setSummaryText("");
                    setEbookTags("");
                  }}
                  className="rounded-full bg-olive px-4 py-2 text-[11px] font-bold tracking-wide text-white hover:bg-olive-dark"
                >
                  + AJOUTER
                </button>
              </header>
              <ul className="space-y-3">
                {ebooks.length === 0 && <li className="text-[13px] text-muted">Aucun e-book pour le moment.</li>}
                {ebooks.map((ebook) => (
                  <li key={ebook.id} className="rounded-xl border border-sand/70 p-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <LanguageBadge language={ebook.language} />
                          <p className="text-[11px] font-bold uppercase tracking-wide text-olive">
                            {ebook.featured ? "E-BOOK À LA UNE • " : ""}
                            {ebook.isRecipe ? "Recette • " : ""}
                            {ebook.categories.join(" • ") || "Sans catégorie"}
                          </p>
                        </div>
                        <h3
                          className="mt-1 font-semibold text-ink"
                          dir={contentLanguage(ebook.language) === "ar" ? "rtl" : "ltr"}
                          lang={contentLanguage(ebook.language)}
                        >
                          {ebook.title}
                        </h3>
                        <p className="text-[12px] text-muted">
                          {contentLanguageLabel(ebook.language)} — {ebook.pages || "—"} pages —{" "}
                          {ebook.delivery === "immediate"
                            ? "Téléchargement immédiat"
                            : "Par mail après paiement"}{" "}
                          — {ebook.createdAt}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="text-[12px] font-semibold text-olive"
                          onClick={() => {
                            setEbookForm({
                              ...ebook,
                              language: contentLanguage(ebook.language),
                              recipeMeta: ebook.recipeMeta ?? { time: "", difficulty: "facile", people: "" },
                            });
                            setHighlightsText(listToLines(ebook.highlights));
                            setSummaryText(listToLines(ebook.summary));
                            setEbookTags(ebook.tags.join(", "));
                          }}
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          className="text-[12px] font-semibold text-red-700 disabled:opacity-50"
                          onClick={() => void run(() => deleteEbook(ebook.id))}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {active === "emails" && (
            <>
              <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h1 className="font-display text-2xl font-semibold text-ink">Emails</h1>
                  <p className="mt-1 text-[13px] text-muted">
                    Contacts newsletter et compte inscrits. Cliquez sur Oui / Non pour l&apos;acceptation,
                    ou Supprimer pour retirer un contact.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={!authed}
                  onClick={() => setEmailForm(emptyEmailForm())}
                  className="rounded-full bg-olive px-4 py-2 text-[11px] font-bold tracking-wide text-white hover:bg-olive-dark disabled:opacity-50"
                >
                  + AJOUTER
                </button>
              </header>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-sand text-[11px] uppercase tracking-wide text-muted">
                      <th className="pb-2">Email</th>
                      <th className="pb-2">Nom</th>
                      <th className="pb-2">Source</th>
                      <th className="pb-2">Accepte les emails</th>
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emailRows.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-6 text-muted">
                          Aucun email collecté pour le moment.
                        </td>
                      </tr>
                    )}
                    {emailRows.map((item) => (
                      <tr key={item.id} className="border-b border-sand/60">
                        <td className="py-3 font-semibold">{item.email}</td>
                        <td className="py-3 text-muted">{item.name || "—"}</td>
                        <td className="py-3">
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${item.source === "account" ? "bg-olive/15 text-olive" : "bg-sand text-brown"}`}>
                            {item.source === "account" ? "Compte" : "Newsletter"}
                          </span>
                        </td>
                        <td className="py-3">
                          <button
                            type="button"
                            disabled={busy || !authed}
                            title="Modifier l'acceptation"
                            onClick={() => {
                              const next = !item.accepted;
                              // Optimistic UI — do not full-refresh (API ignores accepted).
                              setEmailAcceptance(item.email, next);
                              setEmails((prev) =>
                                prev.map((e) =>
                                  e.id === item.id ||
                                  e.email.trim().toLowerCase() ===
                                    item.email.trim().toLowerCase()
                                    ? { ...e, accepted: next }
                                    : e
                                )
                              );

                              void (async () => {
                                setBusy(true);
                                setError("");
                                try {
                                  await setEmailAccepted(item.id, next, {
                                    email: item.email,
                                    name: item.name,
                                    source: item.source,
                                  });
                                  setEmails(getStore().emails);
                                } catch (e) {
                                  setError(
                                    e instanceof Error
                                      ? e.message
                                      : "Impossible de modifier l'acceptation."
                                  );
                                } finally {
                                  setBusy(false);
                                }
                              })();
                            }}
                            className={`rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide transition-colors disabled:opacity-50 ${
                              item.accepted
                                ? "bg-olive/15 text-olive hover:bg-olive/25"
                                : "bg-sand text-brown hover:bg-sand/80"
                            }`}
                          >
                            {item.accepted ? "Oui" : "Non"}
                          </button>
                        </td>
                        <td className="py-3 text-muted">{item.createdAt || "—"}</td>
                        <td className="py-3">
                          <button
                            type="button"
                            disabled={busy || !authed}
                            className="text-[12px] font-semibold text-red-700 disabled:opacity-50"
                            onClick={() =>
                              void run(async () => {
                                await deleteEmail(item.id);
                                setEmails(getStore().emails);
                              })
                            }
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </div>

      {userForm && (
        <Modal title={userForm.id ? "Modifier utilisateur" : "Ajouter utilisateur"} onClose={() => setUserForm(null)}>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              void run(async () => {
                await saveUser(userForm);
                setUserForm(null);
              });
            }}
          >
            <Field label="Nom">
              <input className={inputClass} required value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} />
            </Field>
            <Field label="Email">
              <input className={inputClass} type="email" required value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} />
            </Field>
            <Field label={userForm.id ? "Mot de passe (laisser vide pour conserver)" : "Mot de passe"}>
              <input
                className={inputClass}
                required={!userForm.id}
                minLength={userForm.password ? 6 : undefined}
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
              />
            </Field>
            <Field label="Rôle">
              <select
                className={inputClass}
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value as UserRole })}
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </Field>
            <button type="submit" className="rounded-full bg-olive px-5 py-2.5 text-[12px] font-bold text-white">
              Enregistrer
            </button>
          </form>
        </Modal>
      )}

      {emailForm && (
        <Modal title="Ajouter un email" onClose={() => setEmailForm(null)}>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              void run(async () => {
                await upsertEmail({
                  email: emailForm.email.trim(),
                  name: emailForm.name.trim() || undefined,
                  source: emailForm.source,
                  accepted: emailForm.accepted,
                });
                setEmailForm(null);
              });
            }}
          >
            <Field label="Email">
              <input
                className={inputClass}
                type="email"
                required
                value={emailForm.email}
                onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
              />
            </Field>
            <Field label="Nom (optionnel)">
              <input
                className={inputClass}
                value={emailForm.name}
                onChange={(e) => setEmailForm({ ...emailForm, name: e.target.value })}
              />
            </Field>
            <Field label="Source">
              <select
                className={inputClass}
                value={emailForm.source}
                onChange={(e) =>
                  setEmailForm({
                    ...emailForm,
                    source: e.target.value as "newsletter" | "account",
                  })
                }
              >
                <option value="newsletter">Newsletter</option>
                <option value="account">Compte</option>
              </select>
            </Field>
            <label className="flex items-center gap-2 text-[13px] font-medium text-ink">
              <input
                type="checkbox"
                checked={emailForm.accepted}
                onChange={(e) => setEmailForm({ ...emailForm, accepted: e.target.checked })}
                className="h-4 w-4 accent-[#5a6b38]"
              />
              Accepte les emails
            </label>
            <button type="submit" className="rounded-full bg-olive px-5 py-2.5 text-[12px] font-bold text-white">
              Ajouter
            </button>
          </form>
        </Modal>
      )}

      {articleForm && (
        <Modal title={articleForm.id ? "Modifier article" : "Ajouter article"} onClose={() => setArticleForm(null)}>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!articleForm.categories.length) {
                alert("Choisissez au moins une catégorie.");
                return;
              }
              void run(async () => {
                await saveArticle({
                  ...articleForm,
                  keyPoints: linesToList(keyPointsText),
                  tags: tagsFromInput(articleTags),
                });
                setArticleForm(null);
              });
            }}
          >
            <LanguagePicker
              value={contentLanguage(articleForm.language)}
              onChange={(language) => {
                setStoredContentLanguage("article", articleForm.id, language);
                setArticleForm((prev) => (prev ? { ...prev, language } : prev));
              }}
            />
            <Field label="Catégories (une ou plusieurs)">
              <CategoryPicker
                value={articleForm.categories}
                onChange={(categories) => setArticleForm({ ...articleForm, categories })}
              />
            </Field>
            <ImageUrlField
              label="Image (URL ou appareil)"
              value={articleForm.image}
              folder="articles"
              onChange={(image) => setArticleForm({ ...articleForm, image })}
              onError={setError}
            />
            <Field label="Titre">
              <input
                className={inputClass}
                required
                dir={textDir(articleForm.language)}
                lang={contentLanguage(articleForm.language)}
                value={articleForm.title}
                onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
              />
            </Field>
            <Field label="Sous-titre">
              <input
                className={inputClass}
                dir={textDir(articleForm.language)}
                lang={contentLanguage(articleForm.language)}
                value={articleForm.subtitle}
                onChange={(e) => setArticleForm({ ...articleForm, subtitle: e.target.value })}
              />
            </Field>
            <Field label="Points clés à retenir (1 par ligne)">
              <textarea
                className={`${inputClass} min-h-[90px]`}
                dir={textDir(articleForm.language)}
                lang={contentLanguage(articleForm.language)}
                value={keyPointsText}
                onChange={(e) => setKeyPointsText(e.target.value)}
              />
            </Field>
            <Field label="Par...">
              <input
                className={inputClass}
                dir={textDir(articleForm.language)}
                lang={contentLanguage(articleForm.language)}
                value={articleForm.author}
                onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })}
                placeholder="Dr. Leila Benyamina"
              />
            </Field>
            <Field label="Introduction">
              <textarea
                className={`${inputClass} min-h-[90px]`}
                dir={textDir(articleForm.language)}
                lang={contentLanguage(articleForm.language)}
                value={articleForm.introduction}
                onChange={(e) => setArticleForm({ ...articleForm, introduction: e.target.value })}
              />
            </Field>

            <div className="space-y-3 rounded-xl border border-sand/70 p-3">
              <p className="text-[13px] font-semibold">Sections</p>
              {articleForm.sections.map((section, index) => (
                <div key={section.id} className="space-y-2 rounded-lg bg-cream/50 p-3">
                  <div className="flex justify-between gap-2">
                    <p className="text-[12px] font-bold text-muted">Section {index + 1}</p>
                    {articleForm.sections.length > 1 && (
                      <button
                        type="button"
                        className="text-[11px] font-semibold text-red-700"
                        onClick={() =>
                          setArticleForm({
                            ...articleForm,
                            sections: articleForm.sections.filter((s) => s.id !== section.id),
                          })
                        }
                      >
                        Retirer
                      </button>
                    )}
                  </div>
                  <input
                    className={inputClass}
                    placeholder="Titre"
                    dir={textDir(articleForm.language)}
                    lang={contentLanguage(articleForm.language)}
                    value={section.title}
                    onChange={(e) => {
                      const sections = articleForm.sections.map((s) =>
                        s.id === section.id ? { ...s, title: e.target.value } : s
                      );
                      setArticleForm({ ...articleForm, sections });
                    }}
                  />
                  <input
                    className={inputClass}
                    placeholder="Note (optionnel)"
                    dir={textDir(articleForm.language)}
                    lang={contentLanguage(articleForm.language)}
                    value={section.note}
                    onChange={(e) => {
                      const sections = articleForm.sections.map((s) =>
                        s.id === section.id ? { ...s, note: e.target.value } : s
                      );
                      setArticleForm({ ...articleForm, sections });
                    }}
                  />
                  <textarea
                    className={`${inputClass} min-h-[70px]`}
                    placeholder="Texte"
                    dir={textDir(articleForm.language)}
                    lang={contentLanguage(articleForm.language)}
                    value={section.text}
                    onChange={(e) => {
                      const sections = articleForm.sections.map((s) =>
                        s.id === section.id ? { ...s, text: e.target.value } : s
                      );
                      setArticleForm({ ...articleForm, sections });
                    }}
                  />
                  <ImageUrlField
                    label="Image section (URL ou appareil)"
                    value={section.image}
                    folder="articles"
                    onChange={(image) => {
                      const sections = articleForm.sections.map((s) =>
                        s.id === section.id ? { ...s, image } : s
                      );
                      setArticleForm({ ...articleForm, sections });
                    }}
                    onError={setError}
                  />
                </div>
              ))}
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-full border border-olive/30 bg-olive/10 px-4 py-2.5 text-[12px] font-bold tracking-wide text-olive transition-colors hover:bg-olive hover:text-white"
                onClick={() =>
                  setArticleForm({
                    ...articleForm,
                    sections: [...articleForm.sections, newSection()],
                  })
                }
              >
                + Section
              </button>
            </div>

            <Field label="Conseil">
              <textarea
                className={`${inputClass} min-h-[70px]`}
                dir={textDir(articleForm.language)}
                lang={contentLanguage(articleForm.language)}
                value={articleForm.tip}
                onChange={(e) => setArticleForm({ ...articleForm, tip: e.target.value })}
              />
            </Field>
            <Field label="Tags (séparés par des virgules)">
              <input className={inputClass} value={articleTags} onChange={(e) => setArticleTags(e.target.value)} />
            </Field>
            <p className="text-[11px] text-muted">La date est ajoutée automatiquement à l’enregistrement.</p>
            <button type="submit" className="rounded-full bg-olive px-5 py-2.5 text-[12px] font-bold text-white">
              Enregistrer
            </button>
          </form>
        </Modal>
      )}

      {ebookForm && (
        <Modal title={ebookForm.id ? "Modifier e-book" : "Ajouter e-book"} onClose={() => setEbookForm(null)}>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!ebookForm.categories.length) {
                alert("Choisissez au moins une catégorie.");
                return;
              }
              void run(async () => {
                await saveEbook({
                  ...ebookForm,
                  highlights: linesToList(highlightsText),
                  summary: linesToList(summaryText),
                  tags: tagsFromInput(ebookTags),
                  recipeMeta: ebookForm.isRecipe ? ebookForm.recipeMeta : undefined,
                });
                setEbookForm(null);
              });
            }}
          >
            <label className="flex items-center gap-2 text-[13px] font-semibold">
              <input
                type="checkbox"
                checked={ebookForm.featured}
                onChange={(e) => setEbookForm({ ...ebookForm, featured: e.target.checked })}
              />
              E-BOOK À LA UNE
            </label>
            <LanguagePicker
              value={contentLanguage(ebookForm.language)}
              onChange={(language) => {
                setStoredContentLanguage("ebook", ebookForm.id, language);
                setEbookForm((prev) => (prev ? { ...prev, language } : prev));
              }}
            />
            <Field label="Catégories (une ou plusieurs)">
              <CategoryPicker
                value={ebookForm.categories}
                onChange={(categories) => setEbookForm({ ...ebookForm, categories })}
              />
            </Field>
            <label className="flex items-center gap-2 text-[13px] font-semibold">
              <input
                type="checkbox"
                checked={ebookForm.isRecipe}
                onChange={(e) => setEbookForm({ ...ebookForm, isRecipe: e.target.checked })}
              />
              C&apos;est une recette
            </label>
            {ebookForm.isRecipe && (
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Temps">
                  <input className={inputClass} placeholder="25 MIN" value={ebookForm.recipeMeta?.time ?? ""} onChange={(e) => setEbookForm({ ...ebookForm, recipeMeta: { ...ebookForm.recipeMeta!, time: e.target.value } })} />
                </Field>
                <Field label="Difficulté">
                  <select
                    className={inputClass}
                    value={ebookForm.recipeMeta?.difficulty ?? "facile"}
                    onChange={(e) =>
                      setEbookForm({
                        ...ebookForm,
                        recipeMeta: {
                          ...ebookForm.recipeMeta!,
                          difficulty: e.target.value as "facile" | "moyen" | "difficile",
                        },
                      })
                    }
                  >
                    <option value="facile">facile</option>
                    <option value="moyen">moyen</option>
                    <option value="difficile">difficile</option>
                  </select>
                </Field>
                <Field label="Personnes">
                  <input className={inputClass} placeholder="2" value={ebookForm.recipeMeta?.people ?? ""} onChange={(e) => setEbookForm({ ...ebookForm, recipeMeta: { ...ebookForm.recipeMeta!, people: e.target.value } })} />
                </Field>
              </div>
            )}
            <Field label="Titre">
              <input
                className={inputClass}
                required
                dir={textDir(ebookForm.language)}
                lang={contentLanguage(ebookForm.language)}
                value={ebookForm.title}
                onChange={(e) => setEbookForm({ ...ebookForm, title: e.target.value })}
              />
            </Field>
            <Field label="Sous-titre">
              <input
                className={inputClass}
                dir={textDir(ebookForm.language)}
                lang={contentLanguage(ebookForm.language)}
                value={ebookForm.subtitle}
                onChange={(e) => setEbookForm({ ...ebookForm, subtitle: e.target.value })}
              />
            </Field>
            <Field label="Par...">
              <input
                className={inputClass}
                dir={textDir(ebookForm.language)}
                lang={contentLanguage(ebookForm.language)}
                value={ebookForm.author}
                onChange={(e) => setEbookForm({ ...ebookForm, author: e.target.value })}
              />
            </Field>
            <Field label="Livraison">
              <select
                className={inputClass}
                value={ebookForm.delivery}
                onChange={(e) => setEbookForm({ ...ebookForm, delivery: e.target.value as "immediate" | "email-after-pay" })}
              >
                <option value="immediate">Téléchargement immédiat</option>
                <option value="email-after-pay">Par mail après paiement</option>
              </select>
            </Field>
            <Field label="Nombre de pages">
              <input className={inputClass} value={ebookForm.pages} onChange={(e) => setEbookForm({ ...ebookForm, pages: e.target.value })} />
            </Field>
            <ImageUrlField
              label="Couverture (URL ou appareil)"
              value={ebookForm.image}
              folder="ebooks"
              onChange={(image) => setEbookForm({ ...ebookForm, image })}
              onError={setError}
            />
            <Field label="PDF — lien GitHub / URL">
              <input className={inputClass} value={ebookForm.pdfUrl} onChange={(e) => setEbookForm({ ...ebookForm, pdfUrl: e.target.value })} placeholder="https://github.com/.../file.pdf" />
            </Field>
            <Field label="PDF — fichier">
              <FilePickButton
                accept="application/pdf"
                label="CHOISIR UN PDF"
                onFile={(file) => {
                  void (async () => {
                    try {
                      const uploaded = await uploadAsset(file, "ebooks", "raw");
                      setEbookForm({
                        ...ebookForm,
                        pdfFileName: uploaded.fileName || file.name,
                        pdfUrl: uploaded.url,
                      });
                    } catch (err) {
                      setError(err instanceof Error ? err.message : "Échec upload PDF");
                    }
                  })();
                }}
              />
              {ebookForm.pdfFileName && (
                <p className="mt-1 text-[11px] text-muted">Fichier : {ebookForm.pdfFileName}</p>
              )}
            </Field>
            <Field label="Ce que vous allez trouver (1 par ligne)">
              <textarea
                className={`${inputClass} min-h-[80px]`}
                dir={textDir(ebookForm.language)}
                lang={contentLanguage(ebookForm.language)}
                value={highlightsText}
                onChange={(e) => setHighlightsText(e.target.value)}
              />
            </Field>
            <Field label="À propos de ce guide">
              <textarea
                className={`${inputClass} min-h-[80px]`}
                dir={textDir(ebookForm.language)}
                lang={contentLanguage(ebookForm.language)}
                value={ebookForm.about}
                onChange={(e) => setEbookForm({ ...ebookForm, about: e.target.value })}
              />
            </Field>
            <Field label="Sommaire (1 par ligne)">
              <textarea
                className={`${inputClass} min-h-[80px]`}
                dir={textDir(ebookForm.language)}
                lang={contentLanguage(ebookForm.language)}
                value={summaryText}
                onChange={(e) => setSummaryText(e.target.value)}
              />
            </Field>
            <Field label="Conseil">
              <textarea
                className={`${inputClass} min-h-[70px]`}
                dir={textDir(ebookForm.language)}
                lang={contentLanguage(ebookForm.language)}
                value={ebookForm.tip}
                onChange={(e) => setEbookForm({ ...ebookForm, tip: e.target.value })}
              />
            </Field>
            <Field label="Tags (séparés par des virgules)">
              <input className={inputClass} value={ebookTags} onChange={(e) => setEbookTags(e.target.value)} />
            </Field>
            <p className="text-[11px] text-muted">La date est ajoutée automatiquement à l’enregistrement.</p>
            <button type="submit" className="rounded-full bg-olive px-5 py-2.5 text-[12px] font-bold text-white">
              Enregistrer
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
