"use client";

import { useState } from "react";
import { ArticlesListing } from "@/components/ArticlesListing";
import { NewsletterBanner } from "@/components/NewsletterBanner";
import type { Article } from "@/lib/articles";
import type { ContentLanguage } from "@/lib/content-language";

export function ArticlesPageClient({
  initialArticles = [],
}: {
  initialArticles?: Article[];
}) {
  const [uiLanguage, setUiLanguage] = useState<ContentLanguage>("fr");

  return (
    <>
      <ArticlesListing
        initialArticles={initialArticles}
        onUiLanguageChange={setUiLanguage}
      />
      <NewsletterBanner language={uiLanguage} />
    </>
  );
}
