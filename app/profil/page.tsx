import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { ProfilePage } from "@/components/ProfilePage";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export const metadata: Metadata = {
  title: "Mon profil — WELLNEST",
  description: "Votre espace WELLNEST : informations, newsletter et programmes.",
};

export default function ProfilRoute() {
  return (
    <>
      <Header />
      <main className="flex-1 max-[999px]:pb-16">
        <ProfilePage />
      </main>
      <MobileBottomNav active="Profil" />
    </>
  );
}
