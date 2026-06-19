import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container>
      <Skeleton className="mb-2 h-5 w-44" />
      <Skeleton className="mb-2 h-24 w-full" />
      <Skeleton className="mb-8 h-4 w-56" />
      <Skeleton className="mb-3 h-6 w-40" />
      <Skeleton className="h-40 w-full" />
    </Container>
  );
}
