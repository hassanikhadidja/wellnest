const KEY = "wellnest-email-acceptance";

type AcceptanceMap = Record<string, boolean>;

function readMap(): AcceptanceMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as AcceptanceMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeMap(map: AcceptanceMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

function norm(email: string) {
  return email.trim().toLowerCase();
}

/** Explicit Oui/Non overrides for dashboard emails (API does not persist accepted). */
export function getEmailAcceptance(email: string): boolean | undefined {
  const map = readMap();
  const value = map[norm(email)];
  return typeof value === "boolean" ? value : undefined;
}

export function setEmailAcceptance(email: string, accepted: boolean) {
  const map = readMap();
  map[norm(email)] = accepted;
  writeMap(map);
}

export function clearEmailAcceptance(email: string) {
  const map = readMap();
  delete map[norm(email)];
  writeMap(map);
}

export function resolveEmailAcceptance(email: string, fallback: boolean): boolean {
  const override = getEmailAcceptance(email);
  return typeof override === "boolean" ? override : fallback;
}
