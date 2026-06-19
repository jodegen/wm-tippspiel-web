import { Container } from "@/components/layout/Container";
import { EmptyState } from "@/components/feedback/EmptyState";

export default function NotFound() {
  return (
    <Container>
      <EmptyState
        title="Nicht gefunden"
        message="Die angeforderte Seite oder Ressource existiert nicht."
      />
    </Container>
  );
}
