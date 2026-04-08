import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Cinzel = serif elegante para títulos (estilo esotérico/premium)
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Mestre Liu Artur — Rituais & Eventos Esotéricos",
    template: "%s | Mestre Liu Artur",
  },
  description:
    "Rituais, eventos e conteúdos esotéricos com o Mestre Liu Artur. Transforme sua vida através do poder ancestral.",
  keywords: ["ritual", "esotérico", "umbanda", "prosperidade", "magia", "Mestre Liu Artur"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Mestre Liu Artur",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${cinzel.variable} dark`}>
      <body className="bg-[#0a0a0f] font-sans text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
