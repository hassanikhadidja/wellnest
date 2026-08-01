import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { AuthForm } from "@/components/AuthForm";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export const metadata: Metadata = {
  title: "Connexion — WELLNEST",
  description: "Connectez-vous ou créez votre compte WELLNEST.",
};

export default function AuthPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-[999px]:pb-16">
        <AuthForm />
      </main>
      <MobileBottomNav active="Profil" />
    </>
  );
}
