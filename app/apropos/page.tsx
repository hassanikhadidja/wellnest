import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { AboutPage } from "@/components/AboutPage";
import { NewsletterBanner } from "@/components/NewsletterBanner";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export const metadata: Metadata = {
  title: "À propos — WELLNEST",
  description:
    "Découvrez WELLNEST — بيت العافية : nutrition saine pour chaque étape de la vie, de la grossesse à l'adolescence.",
};

export default function AproposRoute() {
  return (
    <>
      <Header />
      <main className="flex-1 max-[999px]:pb-16">
        <AboutPage />
        <NewsletterBanner />
      </main>
      <Footer />
      <MobileBottomNav active="Accueil" />
    </>
  );
}
