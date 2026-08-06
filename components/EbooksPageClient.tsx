"use client";

import { Suspense, useState } from "react";
import { EbooksListing } from "@/components/EbooksListing";
import { NewsletterBanner } from "@/components/NewsletterBanner";
import { ebooksPageUi, type ContentLanguage } from "@/lib/content-language";
import type { Ebook } from "@/lib/ebooks";

export function EbooksPageClient({
  initialEbooks = [],
  initialFeatured = null,
}: {
  initialEbooks?: Ebook[];
  initialFeatured?: Ebook | null;
}) {
  const [uiLanguage, setUiLanguage] = useState<ContentLanguage>("fr");
  const loadingLabel = ebooksPageUi(uiLanguage).loading;

  return (
    <>
      <Suspense
        fallback={
          <div className="bg-white px-4 py-10 text-center text-muted">{loadingLabel}</div>
        }
      >
        <EbooksListing
          initialEbooks={initialEbooks}
          initialFeatured={initialFeatured}
          onUiLanguageChange={setUiLanguage}
        />
      </Suspense>
      <NewsletterBanner language={uiLanguage} />
    </>
  );
}
