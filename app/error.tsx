"use client";

import { Container } from "@/components/layout/Container";
import { ErrorState } from "@/components/feedback/ErrorState";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container>
      <ErrorState
        title="Es ist ein Fehler aufgetreten"
        message="Die Seite konnte nicht geladen werden."
        onRetry={reset}
      />
    </Container>
  );
}
