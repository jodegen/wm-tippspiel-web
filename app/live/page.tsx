import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { LiveMatches } from "./LiveMatches";

export const metadata: Metadata = { title: "Live" };

export default function LivePage() {
  return (
    <Container>
      <h1 className="mb-1 text-2xl font-bold">Live</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Laufende Spiele, automatische Aktualisierung.
      </p>
      <LiveMatches />
    </Container>
  );
}
