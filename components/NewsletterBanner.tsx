"use client";

import { useState, type FormEvent } from "react";
import { newsletterUi, type ContentLanguage } from "@/lib/content-language";
import { upsertEmail } from "@/lib/dashboard-store";
import { requestEmail } from "@/lib/email-client";

export function NewsletterBanner({
  language = "fr",
}: {
  language?: ContentLanguage | string | null;
}) {
  const ui = newsletterUi(language);
  const isAr = language === "ar";
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void (async () => {
      setError("");
      try {
        const submitted = email.trim();
        await upsertEmail({ email: submitted, source: "newsletter", accepted: true });
        await requestEmail("/api/email/newsletter", {
          email: submitted,
          source: "newsletter",
        });
        setEmail("");
        setDone(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : ui.error);
      }
    })();
  };

  return (
    <section
      id="newsletter"
      className="hidden justify-center bg-white px-4 pt-3 pb-0 max-[999px]:flex"
      aria-labelledby="newsletter-banner-title"
      lang={isAr ? "ar" : "fr"}
    >
      <div
        className="relative h-[89px] w-[384px] max-w-full shrink-0 overflow-hidden rounded-md"
        style={{
          backgroundImage:
            "url(https://res.cloudinary.com/tui0hpy4/image/upload/v1785536504/Design_sans_titre_-_2026-07-31T232135.438_asjebk.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Always pin copy on the green (left) side — do not flip the whole banner in RTL */}
        <div className="relative flex h-full flex-col justify-center px-4 py-2">
          <div
            className={`max-w-[220px] ${isAr ? "text-right" : "text-left"}`}
            dir={isAr ? "rtl" : "ltr"}
          >
            <h2
              id="newsletter-banner-title"
              className="font-display text-[15px] font-semibold leading-tight tracking-wide text-white"
            >
              {ui.title}
            </h2>
            <p className="mt-0.5 text-[10px] leading-tight text-white/85">
              {done ? ui.thanks : error ? error : ui.subtitle}
            </p>
            <form className="mt-1.5 flex gap-1.5" onSubmit={onSubmit} dir="ltr">
              <label htmlFor="newsletter-banner-email" className="sr-only">
                {ui.emailLabel}
              </label>
              <input
                id="newsletter-banner-email"
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={ui.emailPlaceholder}
                dir={isAr ? "rtl" : "ltr"}
                className="min-w-0 flex-1 rounded border-0 bg-white px-2 py-1 text-[10px] text-ink placeholder:text-muted outline-none focus:ring-1 focus:ring-sand"
              />
              <button
                type="submit"
                className="shrink-0 rounded bg-sand-dark px-2 py-1 text-[9px] font-bold tracking-[0.04em] text-ink transition-colors hover:bg-sand"
              >
                {ui.submit}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
