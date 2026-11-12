import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GapSkill — Competências que aproximam talento e trabalho",
  description: "Analise oportunidades de emprego, identifique lacunas de competências e descubra o que desenvolver a seguir.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
