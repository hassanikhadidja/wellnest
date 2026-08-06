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

/** Prefer API value, then local override, then French. */
export function resolveContentLanguage(
  kind: ContentKind,
  id: string | undefined | null,
  apiValue?: string | null
): ContentLanguage {
  if (apiValue === "ar" || apiValue === "fr") return apiValue;
  const stored = getStoredContentLanguage(kind, id);
  if (stored) return stored;
  return "fr";
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
