export async function requestEmail(
  path: "/api/email/newsletter" | "/api/email/questionnaire" | "/api/email/ebook",
  body: Record<string, unknown>
): Promise<void> {
  try {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      console.error(`Email request failed (${path}):`, data?.error || res.statusText);
    }
  } catch (err) {
    console.error(`Email request error (${path}):`, err);
  }
}
