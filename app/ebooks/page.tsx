import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { EbooksPageClient } from "@/components/EbooksPageClient";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { resolveEbooks } from "@/lib/ebooks";

export const metadata: Metadata = {
  title: "Nos e-books — WELLNEST",
  description:
    "Des guides pratiques et complets à télécharger pour vous accompagner à chaque étape.",
};

export const revalidate = 60;

export default async function EbooksPage() {
  const initialEbooks = await resolveEbooks();
  const initialFeatured =
    initialEbooks.find((ebook) => ebook.featured) ?? initialEbooks[0] ?? null;

  return (
    <>
      <Header />
      <main className="flex-1 max-[999px]:pb-16">
        <EbooksPageClient
          initialEbooks={initialEbooks}
          initialFeatured={initialFeatured}
        />
      </main>
      <Footer />
      <MobileBottomNav active="Ressources" />
    </>
  );
}
