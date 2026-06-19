import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  rows?: number;
  label?: string;
}

/** Einheitlicher Ladezustand (Skeleton). */
export function LoadingSkeleton({ rows = 4, label = "Lädt …" }: LoadingSkeletonProps) {
  return (
    <div aria-busy="true" aria-label={label} className="flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
  );
}
