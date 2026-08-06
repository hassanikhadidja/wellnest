import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { CtaBanner } from "@/components/CtaBanner";
import { DashboardPreview } from "@/components/DashboardPreview";
import { Resources } from "@/components/Resources";
import { HealthyRecipes } from "@/components/HealthyRecipes";
import { NewsletterBanner } from "@/components/NewsletterBanner";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { HashScroll } from "@/components/HashScroll";
import { resolveArticles } from "@/lib/articles";
import { resolveHealthyRecipes } from "@/lib/ebooks";

export const revalidate = 60;

export default async function Home() {
  const [initialArticles, initialRecipes] = await Promise.all([
    resolveArticles(),
    resolveHealthyRecipes(),
  ]);

  return (
    <>
      <HashScroll />
      <Header />
      <main className="flex-1 max-[999px]:pb-16">
        <Hero />
        <Features />
        <CtaBanner />
        <DashboardPreview initialArticles={initialArticles} />
        <Resources />
        <HealthyRecipes initialRecipes={initialRecipes} />
        <NewsletterBanner />
      </main>
      <Footer />
      <MobileBottomNav active="Accueil" />
    </>
  );
}
