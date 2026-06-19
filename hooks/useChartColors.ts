"use client";

import { useEffect, useState } from "react";

const FALLBACK = {
  primary: "#2f6df6",
  success: "#16a34a",
  warning: "#f59e0b",
  muted: "#71717a",
  grid: "#e4e4e7",
};

export type ChartColors = typeof FALLBACK;

/** Liest die Theme-Farben aus den CSS-Variablen und aktualisiert bei Dark-Mode-Wechsel. */
export function useChartColors(): ChartColors {
  const [colors, setColors] = useState<ChartColors>(FALLBACK);

  useEffect(() => {
    const read = () => {
      const s = getComputedStyle(document.documentElement);
      const g = (v: string, fb: string) => {
        const val = s.getPropertyValue(v).trim();
        return val ? `hsl(${val})` : fb;
      };
      setColors({
        primary: g("--primary", FALLBACK.primary),
        success: g("--success", FALLBACK.success),
        warning: g("--warning", FALLBACK.warning),
        muted: g("--muted-foreground", FALLBACK.muted),
        grid: g("--border", FALLBACK.grid),
      });
    };
    read();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);

  return colors;
}
