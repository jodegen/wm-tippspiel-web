import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container>
      <Skeleton className="mb-2 h-8 w-44" />
      <Skeleton className="mb-6 h-4 w-72" />
      <div className="flex gap-8 overflow-hidden">
        {Array.from({ length: 5 }).map((_, col) => (
          <div key={col} className="flex flex-col gap-3">
            {Array.from({ length: Math.max(1, 8 >> col) }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-44" />
            ))}
          </div>
        ))}
      </div>
    </Container>
  );
}
