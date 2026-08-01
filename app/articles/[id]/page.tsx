import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { ArticleDetail } from "@/components/ArticleDetail";
import { NewsletterBanner } from "@/components/NewsletterBanner";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { articles, resolveArticleById } from "@/lib/articles";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return articles.map((article) => ({ id: article.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = await resolveArticleById(id);
  if (!article) return { title: "Article — WELLNEST" };
  return {
    title: `${article.title} — WELLNEST`,
    description: article.excerpt,
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { id } = await params;
  const article = await resolveArticleById(id);
  if (!article) notFound();

  return (
    <>
      <Header />
      <main className="flex-1 max-[999px]:pb-16">
        <ArticleDetail article={article} />
        <NewsletterBanner />
      </main>
      <Footer />
      <MobileBottomNav active="Ressources" />
    </>
  );
}
