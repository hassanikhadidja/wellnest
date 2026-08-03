import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { QuestionnaireForm } from "@/components/QuestionnaireForm";
import { NewsletterBanner } from "@/components/NewsletterBanner";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export const metadata: Metadata = {
  title: "Questionnaire Diététique & Analyse Nutri-Profil — WELLNEST",
  description:
    "Répondez à quelques questions pour recevoir des recommandations nutritionnelles personnalisées.",
};

type PageProps = {
  searchParams: Promise<{ next?: string; plan?: string }>;
};

export default async function QuestionnairePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const nextPath = typeof params.next === "string" && params.next.startsWith("/") ? params.next : null;
  const planId = typeof params.plan === "string" ? params.plan : null;

  return (
    <>
      <Header />
      <main className="flex-1 max-[999px]:pb-16">
        <QuestionnaireForm nextPath={nextPath} planId={planId} />
        <NewsletterBanner />
      </main>
      <Footer />
      <MobileBottomNav active="Accueil" />
    </>
  );
}
