"use client";

import { useState, type FormEvent } from "react";
import { upsertEmail } from "@/lib/dashboard-store";
import { requestEmail } from "@/lib/email-client";

export function FooterNewsletterForm() {
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
        setError(err instanceof Error ? err.message : "Erreur d'inscription.");
      }
    })();
  };

  return (
    <form className="mt-3 flex flex-col gap-2 sm:flex-row" onSubmit={onSubmit}>
      <label htmlFor="newsletter-email" className="sr-only">
        Adresse e-mail
      </label>
      <input
        id="newsletter-email"
        type="email"
        name="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={done ? "Merci !" : "Votre adresse e-mail"}
        className="w-full rounded-md border-0 bg-white px-4 py-2.5 text-[13px] text-ink placeholder:text-muted outline-none focus:ring-2 focus:ring-sand"
      />
      <button
        type="submit"
        className="shrink-0 rounded-md bg-sand-dark px-4 py-2.5 text-[11px] font-bold tracking-[0.06em] text-ink transition-colors hover:bg-sand"
      >
        S&apos;INSCRIRE
      </button>
      {error && <p className="basis-full text-[11px] text-red-700">{error}</p>}
    </form>
  );
}
