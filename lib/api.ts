const DEFAULT_API = "http://127.0.0.1:5002";

/**
 * Browser calls go through the Next.js `/backend` rewrite (same origin → no CORS).
 * Server-side calls use the absolute API URL from env.
 */
export function getApiBase() {
  if (typeof window !== "undefined") {
    return "/backend";
  }
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  return fromEnv || DEFAULT_API;
}

const TOKEN_KEY = "wellnest-auth-token";
const USER_KEY = "wellnest-auth-user";
export const AUTH_CHANGED_EVENT = "wellnest-auth-changed";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt?: string;
  /** Whether the user accepts newsletter / marketing emails */
  newsletterAccepted?: boolean;
};

function notifyAuthChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    if (!parsed.id || !parsed.email || !parsed.name) return null;
    return {
      id: String(parsed.id),
      name: String(parsed.name),
      email: String(parsed.email),
      role: parsed.role === "admin" ? "admin" : "user",
      createdAt: parsed.createdAt ? String(parsed.createdAt) : undefined,
      newsletterAccepted:
        typeof parsed.newsletterAccepted === "boolean"
          ? parsed.newsletterAccepted
          : undefined,
    };
  } catch {
    return null;
  }
}

export function setCurrentUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(USER_KEY);
  } catch {
    // ignore
  }
  notifyAuthChanged();
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  } catch {
    // ignore
  }
  notifyAuthChanged();
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
  formData?: FormData;
};

export async function api<T = unknown>(
  path: string,
  { method = "GET", body, auth = false, formData }: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {};
  if (!formData) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${getApiBase()}${path}`, {
    method,
    headers,
    body: formData ? formData : body !== undefined ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json().catch(() => ({})) : await res.text();

  if (!res.ok) {
    const msg =
      typeof data === "object" && data && "msg" in data
        ? String((data as { msg: string }).msg)
        : typeof data === "object" && data && "message" in data
          ? String((data as { message: string }).message)
          : `Erreur API (${res.status})`;
    throw new ApiError(res.status, msg);
  }

  return data as T;
}
