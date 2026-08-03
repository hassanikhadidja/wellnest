const NEWSLETTER_KEY = "wellnest-newsletter-opt-in";

function newsletterStorageKey(email: string) {
  return `${NEWSLETTER_KEY}:${email.trim().toLowerCase()}`;
}

/** Local cache of newsletter acceptance, synced with API from profile / dashboard. */
export function getNewsletterOptIn(email: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(newsletterStorageKey(email)) === "1";
  } catch {
    return false;
  }
}

export function setNewsletterOptIn(email: string, value: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(newsletterStorageKey(email), value ? "1" : "0");
  } catch {
    // ignore
  }
}

export function readAcceptedFlag(value: unknown, fallback = true): boolean {
  if (typeof value === "boolean") return value;
  if (value === "false" || value === 0 || value === "0") return false;
  if (value === "true" || value === 1 || value === "1") return true;
  return fallback;
}
