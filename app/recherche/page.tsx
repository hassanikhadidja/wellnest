import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { SearchResults } from "@/components/SearchResults";
import { NewsletterBanner } from "@/components/NewsletterBanner";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export const metadata: Metadata = {
  title: "Recherche — WELLNEST",
  description: "Recherchez des articles, guides et recettes sur Wellnest.",
};

export default function RecherchePage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-[999px]:pb-16">
        <Suspense fallback={<div className="bg-white px-4 py-10 text-center text-muted">Chargement…</div>}>
          <SearchResults />
        </Suspense>
        <NewsletterBanner />
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
