import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Serif_TC, Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import StoreHydrator from "@/components/shared/StoreHydrator";
import DecorativeBackground from "@/components/shared/DecorativeBackground";
import PageTour from "@/components/onboarding/PageTour";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["500","600","700"], variable: "--font-cormorant" });
const notoSerifTC = Noto_Serif_TC({ subsets: ["latin"], weight: ["500","600","700"], variable: "--font-noto-serif-tc" });
const notoSansTC = Noto_Sans_TC({ subsets: ["latin"], weight: ["400","500","700"], variable: "--font-noto-sans-tc" });

export const metadata: Metadata = {
  title: "Folio",
  description: "在書頁之間，遇見懂你的靈魂",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant" className={`${cormorant.variable} ${notoSerifTC.variable} ${notoSansTC.variable}`}>
      <body className="bg-parchment text-walnut">
        <StoreHydrator />
        <DecorativeBackground />
        <div className="max-w-[480px] mx-auto min-h-screen relative z-10">
          {children}
        </div>
        <PageTour />
      </body>
    </html>
  );
}
