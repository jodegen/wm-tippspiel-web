interface LoadingSkeletonProps {
  rows?: number;
  label?: string;
}

/** Einheitlicher Ladezustand (Skeleton). */
export function LoadingSkeleton({ rows = 5, label = "Lädt …" }: LoadingSkeletonProps) {
  return (
    <div aria-busy="true" aria-label={label} className="flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-16 w-full animate-pulse rounded-lg bg-surface-subtle"
        />
      ))}
    </div>
  );
}
