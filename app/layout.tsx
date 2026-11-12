import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "GapSkill | Inteligência de Competências",
    template: "%s | GapSkill",
  },
  description: "Diagnóstico de competências baseado em requisitos publicados no mercado de trabalho. Identifique lacunas e planeie o seu desenvolvimento profissional.",
  applicationName: "GapSkill",
  keywords: ["competências", "desenvolvimento profissional", "mercado de trabalho", "formação", "Moçambique"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-MZ">
      <body>{children}</body>
    </html>
  );
}
