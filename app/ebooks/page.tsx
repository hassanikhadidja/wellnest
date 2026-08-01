import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { EbooksListing } from "@/components/EbooksListing";
import { NewsletterBanner } from "@/components/NewsletterBanner";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export const metadata: Metadata = {
  title: "Nos e-books — WELLNEST",
  description:
    "Des guides pratiques et complets à télécharger pour vous accompagner à chaque étape.",
};

export default function EbooksPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-[999px]:pb-16">
        <Suspense fallback={<div className="bg-white px-4 py-10 text-center text-muted">Chargement…</div>}>
          <EbooksListing />
        </Suspense>
        <NewsletterBanner />
      </main>
      <Footer />
      <MobileBottomNav active="Ressources" />
    </>
  );
}
