import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsletterBanner } from "@/components/NewsletterBanner";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { BilanResult } from "@/components/BilanResult";

export const metadata: Metadata = {
  title: "Bilan 1 jour — WELLNEST",
  description:
    "Votre journée type gratuite : repas, recettes et liste de courses après le questionnaire Nutri-Profil.",
};

export default function BilanPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-[999px]:pb-16">
        <BilanResult />
        <NewsletterBanner />
      </main>
      <Footer />
      <MobileBottomNav active="Accueil" />
    </>
  );
}
