import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { DashboardPanel } from "@/components/DashboardPanel";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export const metadata: Metadata = {
  title: "Dashboard — WELLNEST",
  description: "Tableau de bord WELLNEST : utilisateurs, articles, e-books et emails.",
};

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-[999px]:pb-16">
        <DashboardPanel />
      </main>
      <MobileBottomNav />
    </>
  );
}
