import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "WM-Tippspiel",
    template: "%s · WM-Tippspiel",
  },
  description:
    "Öffentliche Übersicht zum WM-Tippspiel: Spielplan, Rangliste, Profile und Live-Spiele.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-dvh font-sans">
        <a href="#main" className="skip-link">
          Zum Inhalt springen
        </a>
        <Providers>
          <Header />
          <main id="main">{children}</main>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
