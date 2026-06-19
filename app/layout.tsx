import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
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
      <body className="min-h-full font-sans antialiased">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
