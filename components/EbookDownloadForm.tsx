"use client";

import { useState, type FormEvent } from "react";
import { ebookUi, type ContentLanguage } from "@/lib/content-language";
import type { Pricing } from "@/lib/ebooks";

/** Wellnest WhatsApp business number (digits only, country code included). */
const WELLNEST_WHATSAPP = "213555589118";

type Props = {
  ebookId: string;
  ebookTitle: string;
  pricing?: Pricing;
  language?: ContentLanguage | string | null;
  variant?: "primary" | "inverse";
};

function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "").trim();
}

function isValidWhatsApp(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

export function EbookDownloadForm({
  ebookId,
  ebookTitle,
  pricing = "free",
  language,
  variant = "primary",
}: Props) {
  const ui = ebookUi(language);
  const isPaid = pricing === "paid";
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const onSubmitFree = (e: FormEvent) => {
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
          setMessage(data?.error || ui.sendError);
          return;
        }
        setStatus("done");
        setMessage(ui.sentOk);
        setEmail("");
      } catch {
        setStatus("error");
        setMessage(ui.sendError);
      }
    })();
  };

  const onSubmitPaid = (e: FormEvent) => {
    e.preventDefault();
    const phone = normalizePhone(whatsapp);
    if (!isValidWhatsApp(phone)) {
      setStatus("error");
      setMessage(ui.whatsappInvalid);
      return;
    }

    setStatus("loading");
    setMessage("");

    const text =
      language === "ar"
        ? `مرحباً WELLNEST، أرغب في الحصول على الدليل المدفوع «${ebookTitle}». رقم واتسابي: ${phone}`
        : `Bonjour WELLNEST, je souhaite obtenir le e-book payant « ${ebookTitle} ». Mon numéro WhatsApp : ${phone}`;

    window.open(
      `https://wa.me/${WELLNEST_WHATSAPP}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );

    setStatus("done");
    setMessage(ui.sentOkWhatsApp);
    setWhatsapp("");
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
        {isPaid
          ? ui.downloadPaid
          : variant === "inverse"
            ? ui.downloadNow
            : ui.downloadEbook}
        <span aria-hidden>{isPaid ? "→" : "↓"}</span>
      </button>
    );
  }

  return (
    <div className={variant === "inverse" ? "mt-0" : ""}>
      {status === "done" ? (
        <p
          className={
            variant === "inverse" ? "text-[13px] text-white/90" : "text-[13px] text-olive"
          }
        >
          {message}
        </p>
      ) : isPaid ? (
        <form
          className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-center"
          onSubmit={onSubmitPaid}
        >
          <label htmlFor={`ebook-wa-${ebookId}-${variant}`} className="sr-only">
            {ui.whatsappLabel}
          </label>
          <input
            id={`ebook-wa-${ebookId}-${variant}`}
            type="tel"
            name="whatsapp"
            required
            inputMode="tel"
            autoComplete="tel"
            value={whatsapp}
            onChange={(e) => {
              setWhatsapp(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder={ui.whatsappPlaceholder}
            className={inputClass}
          />
          <button type="submit" disabled={status === "loading"} className={buttonClass}>
            {status === "loading" ? ui.sending : ui.sendWhatsApp}
          </button>
        </form>
      ) : (
        <form
          className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-center"
          onSubmit={onSubmitFree}
        >
          <label htmlFor={`ebook-email-${ebookId}-${variant}`} className="sr-only">
            {ui.emailLabel}
          </label>
          <input
            id={`ebook-email-${ebookId}-${variant}`}
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={ui.emailPlaceholder}
            className={inputClass}
          />
          <button type="submit" disabled={status === "loading"} className={buttonClass}>
            {status === "loading" ? ui.sending : ui.receiveByEmail}
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
