"use client";

import { Toaster as SonnerToaster } from "sonner";

/** App-weite Toast-Ausgabe; folgt der System-Theme-Einstellung. */
export function Toaster() {
  return (
    <SonnerToaster
      theme="system"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group rounded-lg border bg-popover text-popover-foreground shadow-lg",
        },
      }}
    />
  );
}
