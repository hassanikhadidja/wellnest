import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { EbookDetail } from "@/components/EbookDetail";
import { NewsletterBanner } from "@/components/NewsletterBanner";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ebooks, resolveEbookById } from "@/lib/ebooks";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return ebooks.map((ebook) => ({ id: ebook.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const ebook = await resolveEbookById(id);
  if (!ebook) return { title: "E-book — WELLNEST" };
  return {
    title: `${ebook.title} — WELLNEST`,
    description: ebook.description,
  };
}

export default async function EbookDetailPage({ params }: Props) {
  const { id } = await params;
  const ebook = await resolveEbookById(id);
  if (!ebook) notFound();

  return (
    <>
      <Header />
      <main className="flex-1 max-[999px]:pb-16">
        <EbookDetail ebook={ebook} />
        <NewsletterBanner />
      </main>
      <Footer />
      <MobileBottomNav active="Ressources" />
    </>
  );
}
