import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { ArticlesListing } from "@/components/ArticlesListing";
import { NewsletterBanner } from "@/components/NewsletterBanner";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { resolveArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Tous les articles — WELLNEST",
  description:
    "Découvrez nos conseils, guides et actualités pour une vie plus saine à chaque étape.",
};

export const revalidate = 60;

export default async function ArticlesPage() {
  const initialArticles = await resolveArticles();

  return (
    <>
      <Header />
      <main className="flex-1 max-[999px]:pb-16">
        <ArticlesListing initialArticles={initialArticles} />
        <NewsletterBanner />
      </main>
      <Footer />
      <MobileBottomNav active="Ressources" />
    </>
  );
}
