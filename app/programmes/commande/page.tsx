import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsletterBanner } from "@/components/NewsletterBanner";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { PlanOrderForm, PlanOrderMissing } from "@/components/PlanOrderForm";
import { getPlanById } from "@/lib/programmes";

export const metadata: Metadata = {
  title: "Demande de formule — WELLNEST",
  description: "Finalisez votre formule nutritionnelle WELLNEST.",
};

type PageProps = {
  searchParams: Promise<{ plan?: string }>;
};

export default async function PlanOrderPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const planId = typeof params.plan === "string" ? params.plan : "";
  const plan = getPlanById(planId);
  const valid = plan && !plan.isFree;

  return (
    <>
      <Header />
      <main className="flex-1 max-[999px]:pb-16">
        <div className="bg-white pb-12 pt-4">
          <div className="mx-auto max-w-[960px] px-4 sm:px-6">
            <nav className="mb-5 flex items-center gap-1.5 text-[12px] text-muted" aria-label="Fil d'Ariane">
              <Link href="/" className="hover:text-olive">
                Accueil
              </Link>
              <span className="text-ink/30">›</span>
              <Link href="/programmes" className="hover:text-olive">
                Programmes
              </Link>
              <span className="text-ink/30">›</span>
              <span className="font-medium text-ink">Demande</span>
            </nav>

            <h1 className="font-display text-[1.85rem] font-semibold text-ink sm:text-4xl">
              Finaliser votre formule
            </h1>
            <p className="mt-2 max-w-xl text-[13px] text-muted">
              Laissez votre nom et numéro. L&apos;équipe WELLNEST vous recontacte pour activer le
              programme choisi.
            </p>

            <div className="mt-8">
              {valid && plan ? <PlanOrderForm plan={plan} /> : <PlanOrderMissing planId={planId} />}
            </div>
          </div>
        </div>
        <NewsletterBanner />
      </main>
      <Footer />
      <MobileBottomNav active="Programmes" />
    </>
  );
}
