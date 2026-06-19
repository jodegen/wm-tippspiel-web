import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
}

/** Einheitlicher Leerzustand für leere Datenmengen / Filter ohne Treffer (FR-014). */
export function EmptyState({ title = "Keine Daten vorhanden", message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed bg-card p-10 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Inbox className="h-5 w-5" aria-hidden />
      </div>
      <div>
        <p className="font-medium">{title}</p>
        {message ? (
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        ) : null}
      </div>
    </div>
  );
}
