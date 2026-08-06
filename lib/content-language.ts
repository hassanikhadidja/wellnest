export const CONTENT_LANGUAGES = [
  { id: "fr", label: "Français", short: "FR" },
  { id: "ar", label: "العربية", short: "AR" },
] as const;

export type ContentLanguage = (typeof CONTENT_LANGUAGES)[number]["id"];
export type ContentKind = "article" | "ebook";

const LANG_STORE_KEY = "wellnest-content-language-v1";

export function contentLanguage(value?: string | null): ContentLanguage {
  return value === "ar" ? "ar" : "fr";
}

export function contentLanguageLabel(value?: string | null): string {
  return contentLanguage(value) === "ar" ? "العربية" : "Français";
}

function readLanguageMap(): Record<string, ContentLanguage> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LANG_STORE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const out: Record<string, ContentLanguage> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (value === "ar" || value === "fr") out[key] = value;
    }
    return out;
  } catch {
    return {};
  }
}

function writeLanguageMap(map: Record<string, ContentLanguage>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LANG_STORE_KEY, JSON.stringify(map));
  } catch {
    // ignore quota / private mode
  }
}

function languageStoreKey(kind: ContentKind, id: string) {
  return `${kind}:${id}`;
}

/** Explicit FR/AR override when the API does not persist `language`. */
export function getStoredContentLanguage(
  kind: ContentKind,
  id?: string | null
): ContentLanguage | undefined {
  if (!id) return undefined;
  return readLanguageMap()[languageStoreKey(kind, id)];
}

export function setStoredContentLanguage(
  kind: ContentKind,
  id: string | undefined | null,
  language: ContentLanguage
) {
  if (!id || typeof window === "undefined") return;
  const map = readLanguageMap();
  map[languageStoreKey(kind, id)] = contentLanguage(language);
  writeLanguageMap(map);
}

/** True when text contains Arabic letters (used when API omits language). */
export function hasArabicScript(...texts: Array<string | undefined | null>): boolean {
  return /[\u0600-\u06FF]/.test(texts.filter(Boolean).join(" "));
}

/**
 * Prefer explicit API/local language, then detect Arabic in content text,
 * otherwise French. Detection is required because the backend may drop `language`.
 */
export function resolveContentLanguage(
  kind: ContentKind,
  id: string | undefined | null,
  apiValue?: string | null,
  ...textHints: Array<string | undefined | null>
): ContentLanguage {
  if (apiValue === "ar" || apiValue === "fr") return apiValue;
  const stored = getStoredContentLanguage(kind, id);
  if (stored) return stored;
  if (hasArabicScript(...textHints)) return "ar";
  return "fr";
}

/** Infer language for a public article/ebook object (SSR-safe). */
export function inferContentLanguage(
  item: {
    id?: string;
    language?: string | null;
    title?: string;
    subtitle?: string;
    excerpt?: string;
    introduction?: string;
    description?: string;
    tip?: string;
    keyPoints?: string[];
    highlights?: string[];
  },
  kind: ContentKind = "article"
): ContentLanguage {
  return resolveContentLanguage(
    kind,
    item.id,
    item.language,
    item.title,
    item.subtitle,
    item.excerpt,
    item.introduction,
    item.description,
    item.tip,
    ...(item.keyPoints ?? []),
    ...(item.highlights ?? [])
  );
}

export function localizeAuthorRole(role: string | undefined, language: ContentLanguage): string {
  const value = (role || "").trim();
  if (language !== "ar") return value || "Nutritionniste";
  if (!value || /nutritionniste/i.test(value) || /nutrition/i.test(value)) {
    return "أخصائية تغذية";
  }
  if (/recette/i.test(value)) return "وصفة";
  if (hasArabicScript(value)) return value;
  return "أخصائية تغذية";
}

export function localizeReadTime(readTime: string | undefined, language: ContentLanguage): string {
  if (language !== "ar") return readTime || "";
  if (!readTime) return "";
  if (hasArabicScript(readTime)) return readTime;
  const minutes = readTime.match(/\d+/)?.[0];
  return minutes ? `${minutes} دقائق قراءة` : "دقائق قراءة";
}

export function articleUi(language?: string | null) {
  if (contentLanguage(language) === "ar") {
    return {
      by: "بقلم",
      keyPoints: "النقاط الأساسية للتذكر",
      introduction: "مقدمة",
      tip: "نصيحة",
      sharePrompt: "هل أفادكِ هذا المقال؟ شاركيها مع أمهات أخريات.",
    };
  }
  return {
    by: "Par",
    keyPoints: "Points clés à retenir",
    introduction: "Introduction",
    tip: "Conseil",
    sharePrompt: "Cet article vous a-t-il été utile ? Partagez-le avec d'autres futures mamans.",
  };
}

export function ebookUi(language?: string | null) {
  if (contentLanguage(language) === "ar") {
    return {
      by: "بقلم",
      highlights: "ماذا ستجدين",
      about: "حول هذا الدليل",
      contents: "المحتويات",
      tip: "نصيحة",
      ctaTitle: "هل أنتِ مستعدة للبدء؟",
      ctaText: "حمّلي هذا الكتاب الإلكتروني وطبّقي النصائح ابتداءً من اليوم.",
      downloadNow: "حمّلي الآن",
      downloadEbook: "حمّلي الكتاب الإلكتروني",
      receiveByEmail: "استلمي عبر البريد",
      sending: "جاري الإرسال…",
      emailPlaceholder: "بريدك الإلكتروني",
      emailLabel: "البريد الإلكتروني",
      sentOk: "تم إرسال رابط التحميل إلى بريدك الإلكتروني.",
      sendError: "تعذّر إرسال الكتاب الإلكتروني.",
    };
  }
  return {
    by: "Par",
    highlights: "Ce que vous allez trouver",
    about: "À propos de ce guide",
    contents: "Sommaire",
    tip: "Conseil",
    ctaTitle: "Prêt(e) à commencer ?",
    ctaText: "Téléchargez ce e-book et appliquez les conseils dès aujourd'hui.",
    downloadNow: "TÉLÉCHARGER MAINTENANT",
    downloadEbook: "TÉLÉCHARGER LE E-BOOK",
    receiveByEmail: "RECEVOIR PAR E-MAIL",
    sending: "ENVOI…",
    emailPlaceholder: "Votre e-mail",
    emailLabel: "Adresse e-mail",
    sentOk: "Le lien de téléchargement a été envoyé à votre e-mail.",
    sendError: "Impossible d'envoyer le e-book.",
  };
}
