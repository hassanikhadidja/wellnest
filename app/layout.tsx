import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const naskh = Noto_Naskh_Arabic({
  variable: "--font-naskh",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "WELLNEST — بيت العافية —",
  description:
    "Nutrition saine pour chaque étape de la vie. De la naissance à l'adolescence. Programmes personnalisés, analyses et guides pratiques pour toute la famille.",
  icons: {
    icon: "/wellnest-icon.png",
    apple: "/wellnest-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${dmSans.variable} ${cormorant.variable} ${naskh.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-ink">{children}</body>
    </html>
  );
}
