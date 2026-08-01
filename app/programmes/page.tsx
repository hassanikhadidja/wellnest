import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { ProgrammesPage } from "@/components/ProgrammesPage";
import { NewsletterBanner } from "@/components/NewsletterBanner";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export const metadata: Metadata = {
  title: "Programmes personnalisés — WELLNEST",
  description:
    "Plans nutritionnels personnalisés : essai 3 jours gratuit, puis 1 semaine, 1 mois ou 3 mois en dinars algériens. Questionnaire gratuit obligatoire.",
};

type PageProps = {
  searchParams: Promise<{ plan?: string }>;
};

export default async function ProgrammesRoute({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialPlan = typeof params.plan === "string" ? params.plan : null;

  return (
    <>
      <Header />
      <main className="flex-1 max-[999px]:pb-16">
        <ProgrammesPage initialPlan={initialPlan} />
        <NewsletterBanner />
      </main>
      <Footer />
      <MobileBottomNav active="Programmes" />
    </>
  );
}
