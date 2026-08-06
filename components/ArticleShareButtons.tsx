"use client";

import { useState } from "react";

type Props = {
  title: string;
  language?: "fr" | "ar";
};

export function ArticleShareButtons({ title, language = "fr" }: Props) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function shareWhatsApp() {
    const url = window.location.href;
    const text = `${title}\n${url}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  const copyLabel =
    language === "ar"
      ? copied
        ? "تم النسخ"
        : "نسخ الرابط"
      : copied
        ? "Lien copié"
        : "Copier le lien";

  return (
    <div className="flex items-center gap-2" dir="ltr">
      <button
        type="button"
        onClick={() => void copyLink()}
        aria-label={copyLabel}
        title={copyLabel}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-olive text-white transition-colors hover:bg-olive-dark"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
          <path
            d="M8.2 11.8C8.7 12.3 9.4 12.6 10.1 12.6C10.8 12.6 11.5 12.3 12 11.8L14.3 9.5C15.3 8.5 15.3 6.9 14.3 5.9C13.3 4.9 11.7 4.9 10.7 5.9L10.2 6.4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M11.8 8.2C11.3 7.7 10.6 7.4 9.9 7.4C9.2 7.4 8.5 7.7 8 8.2L5.7 10.5C4.7 11.5 4.7 13.1 5.7 14.1C6.7 15.1 8.3 15.1 9.3 14.1L9.8 13.6"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <button
        type="button"
        onClick={shareWhatsApp}
        aria-label="WhatsApp"
        title="WhatsApp"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-olive text-white transition-colors hover:bg-olive-dark"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M10 2.2C5.8 2.2 2.4 5.5 2.4 9.6C2.4 11.1 2.9 12.5 3.7 13.6L2.5 17.3L6.3 16.1C7.4 16.8 8.7 17.2 10 17.2C14.2 17.2 17.6 13.9 17.6 9.8C17.6 5.7 14.2 2.2 10 2.2ZM13.7 12.3C13.5 12.8 12.6 13.2 12.1 13.3C11.7 13.3 11.2 13.5 9.5 12.8C7.4 11.9 6 9.8 5.9 9.6C5.8 9.5 5 8.4 5 7.3C5 6.2 5.6 5.7 5.8 5.5C6 5.3 6.2 5.2 6.4 5.2H6.7C6.9 5.2 7.1 5.2 7.3 5.7C7.5 6.2 8 7.4 8.1 7.5C8.2 7.7 8.2 7.9 8.1 8C8 8.2 7.9 8.3 7.8 8.5C7.6 8.6 7.5 8.8 7.7 9.1C7.9 9.4 8.4 10.2 9.1 10.8C10 11.6 10.7 11.8 11 11.9C11.3 12 11.5 12 11.6 11.8C11.8 11.6 12.3 11 12.5 10.7C12.7 10.4 12.9 10.5 13.2 10.6C13.5 10.7 14.9 11.4 15.2 11.5C15.5 11.7 15.7 11.7 15.8 12C15.8 12.2 15.8 12.7 15.6 13.2" />
        </svg>
      </button>
      {copied && (
        <span className="text-[11px] font-semibold text-olive">{copyLabel}</span>
      )}
    </div>
  );
}
