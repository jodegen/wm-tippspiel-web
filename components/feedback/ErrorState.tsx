"use client";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

/** Einheitlicher Fehlerzustand mit optionaler Wiederholung (FR-013). */
export function ErrorState({
  title = "Daten konnten nicht geladen werden",
  message = "Bitte versuche es später erneut.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-lg border border-surface-border bg-surface-subtle p-8 text-center"
    >
      <p className="text-lg font-semibold text-slate-800">{title}</p>
      <p className="text-sm text-slate-600">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-fg hover:bg-brand-muted"
        >
          Erneut versuchen
        </button>
      ) : null}
    </div>
  );
}
