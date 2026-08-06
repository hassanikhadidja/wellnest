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
 * Resolve FR/AR for content.
 * Explicit "ar" (API or local) always wins. Arabic script in the body also wins
 * over a default/incorrect API "fr" (backend used to omit language, then defaulted to fr).
 */
export function resolveContentLanguage(
  kind: ContentKind,
  id: string | undefined | null,
  apiValue?: string | null,
  ...textHints: Array<string | undefined | null>
): ContentLanguage {
  const stored = getStoredContentLanguage(kind, id);

  if (apiValue === "ar" || stored === "ar") return "ar";
  if (hasArabicScript(...textHints)) return "ar";
  if (apiValue === "fr" || stored === "fr") return "fr";
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

const FR_MONTHS: Record<string, number> = {
  janvier: 0,
  fevrier: 1,
  février: 1,
  mars: 2,
  avril: 3,
  mai: 4,
  juin: 5,
  juillet: 6,
  aout: 7,
  août: 7,
  septembre: 8,
  octobre: 9,
  novembre: 10,
  decembre: 11,
  décembre: 11,
};

function parseFlexibleDate(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const iso = Date.parse(trimmed);
  if (!Number.isNaN(iso) && /^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    return new Date(iso);
  }

  const fr = trimmed.match(
    /^(\d{1,2})\s+([A-Za-zÀ-ÿ]+)\s+(\d{4})$/u
  );
  if (fr) {
    const day = Number(fr[1]);
    const month = FR_MONTHS[fr[2].toLowerCase()];
    const year = Number(fr[3]);
    if (month !== undefined && day >= 1 && day <= 31) {
      return new Date(year, month, day);
    }
  }

  // Already scrambled by bidi / odd order: "août 2026 6"
  const scrambled = trimmed.match(
    /^([A-Za-zÀ-ÿ]+)\s+(\d{4})\s+(\d{1,2})$/u
  );
  if (scrambled) {
    const month = FR_MONTHS[scrambled[1].toLowerCase()];
    const year = Number(scrambled[2]);
    const day = Number(scrambled[3]);
    if (month !== undefined && day >= 1 && day <= 31) {
      return new Date(year, month, day);
    }
  }

  return null;
}

/** Format a content date for FR/AR and keep a stable day-month-year order. */
export function localizeContentDate(
  date: string | undefined,
  language: ContentLanguage
): string {
  if (!date) return "";
  if (language === "ar" && hasArabicScript(date)) return date;

  const parsed = parseFlexibleDate(date);
  if (!parsed) return date;

  return parsed.toLocaleDateString(language === "ar" ? "ar" : "fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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
      ctaTextPaid: "هذا الدليل مدفوع. أرسلي رقم واتسابك لنرسل لكِ معلومات الدفع والتحميل.",
      downloadNow: "حمّلي الآن",
      downloadEbook: "حمّلي الكتاب الإلكتروني",
      downloadPaid: "اطلبي عبر واتساب",
      receiveByEmail: "استلمي عبر البريد",
      sendWhatsApp: "أرسلي عبر واتساب",
      sending: "جاري الإرسال…",
      emailPlaceholder: "بريدك الإلكتروني",
      emailLabel: "البريد الإلكتروني",
      whatsappPlaceholder: "رقم واتسابك (مثال: 0555…)",
      whatsappLabel: "رقم واتساب",
      sentOk: "تم إرسال رابط التحميل إلى بريدك الإلكتروني.",
      sentOkWhatsApp: "شكراً! سنرسل لكِ معلومات هذا الدليل عبر واتساب.",
      sendError: "تعذّر إرسال الكتاب الإلكتروني.",
      whatsappInvalid: "أدخلي رقم واتساب صالحاً.",
      paidBadge: "مدفوع",
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
    ctaTextPaid:
      "Ce e-book est payant. Envoyez votre numéro WhatsApp pour recevoir les infos de paiement et de téléchargement.",
    downloadNow: "TÉLÉCHARGER MAINTENANT",
    downloadEbook: "TÉLÉCHARGER LE E-BOOK",
    downloadPaid: "DEMANDER VIA WHATSAPP",
    receiveByEmail: "RECEVOIR PAR E-MAIL",
    sendWhatsApp: "ENVOYER SUR WHATSAPP",
    sending: "ENVOI…",
    emailPlaceholder: "Votre e-mail",
    emailLabel: "Adresse e-mail",
    whatsappPlaceholder: "Votre numéro WhatsApp (ex: 0555…)",
    whatsappLabel: "Numéro WhatsApp",
    sentOk: "Le lien de téléchargement a été envoyé à votre e-mail.",
    sentOkWhatsApp: "Merci ! Les infos de ce e-book vous seront envoyées sur WhatsApp.",
    sendError: "Impossible d'envoyer le e-book.",
    whatsappInvalid: "Entrez un numéro WhatsApp valide.",
    paidBadge: "Payant",
  };
}
