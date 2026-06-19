interface EmptyStateProps {
  title?: string;
  message?: string;
}

/** Einheitlicher Leerzustand für leere Datenmengen / Filter ohne Treffer (FR-014). */
export function EmptyState({
  title = "Keine Daten vorhanden",
  message,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-surface-border bg-surface-subtle p-8 text-center">
      <p className="text-base font-medium text-slate-700">{title}</p>
      {message ? <p className="text-sm text-slate-500">{message}</p> : null}
    </div>
  );
}
