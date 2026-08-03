"use client";

import { useState, type FormEvent } from "react";

type Props = {
  ebookId: string;
  variant?: "primary" | "inverse";
};

export function EbookDownloadForm({ ebookId, variant = "primary" }: Props) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void (async () => {
      setStatus("loading");
      setMessage("");
      try {
        const res = await fetch("/api/email/ebook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), ebookId }),
        });
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        if (!res.ok) {
          setStatus("error");
          setMessage(data?.error || "Impossible d'envoyer le e-book.");
          return;
        }
        setStatus("done");
        setMessage("Le lien de téléchargement a été envoyé à votre e-mail.");
        setEmail("");
      } catch {
        setStatus("error");
        setMessage("Impossible d'envoyer le e-book.");
      }
    })();
  };

  const buttonClass =
    variant === "inverse"
      ? "inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[11px] font-bold tracking-[0.06em] text-olive transition-colors hover:bg-cream"
      : "inline-flex w-full items-center justify-center gap-2 rounded-full bg-olive px-6 py-3.5 text-[12px] font-bold tracking-[0.06em] text-white transition-colors hover:bg-olive-dark sm:w-auto";

  const inputClass =
    variant === "inverse"
      ? "min-w-0 flex-1 rounded-full border-0 bg-white/95 px-4 py-2.5 text-[13px] text-ink placeholder:text-muted outline-none"
      : "min-w-0 flex-1 rounded-full border border-sand bg-white px-4 py-2.5 text-[13px] text-ink placeholder:text-muted outline-none focus:border-olive";

  if (!open && status !== "done") {
    return (
      <button type="button" className={buttonClass} onClick={() => setOpen(true)}>
        {variant === "inverse" ? "TÉLÉCHARGER MAINTENANT" : "TÉLÉCHARGER LE E-BOOK"}
        <span aria-hidden>↓</span>
      </button>
    );
  }

  return (
    <div className={variant === "inverse" ? "mt-0" : ""}>
      {status === "done" ? (
        <p
          className={
            variant === "inverse"
              ? "text-[13px] text-white/90"
              : "text-[13px] text-olive"
          }
        >
          {message}
        </p>
      ) : (
        <form className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-center" onSubmit={onSubmit}>
          <label htmlFor={`ebook-email-${ebookId}-${variant}`} className="sr-only">
            Adresse e-mail
          </label>
          <input
            id={`ebook-email-${ebookId}-${variant}`}
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre e-mail"
            className={inputClass}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className={buttonClass}
          >
            {status === "loading" ? "ENVOI…" : "RECEVOIR PAR E-MAIL"}
          </button>
        </form>
      )}
      {status === "error" && (
        <p
          className={
            variant === "inverse"
              ? "mt-2 text-[12px] text-red-200"
              : "mt-2 text-[12px] text-red-700"
          }
        >
          {message}
        </p>
      )}
    </div>
  );
}
