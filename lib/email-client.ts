export async function requestEmail(
  path:
    | "/api/email/newsletter"
    | "/api/email/questionnaire"
    | "/api/email/ebook"
    | "/api/email/account",
  body: Record<string, unknown>
): Promise<boolean> {
  try {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      console.error(`Email request failed (${path}):`, data?.error || res.statusText);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Email request error (${path}):`, err);
    return false;
  }
}
