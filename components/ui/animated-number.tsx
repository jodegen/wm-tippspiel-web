"use client";

import { useEffect, useRef, useState } from "react";

/** Zählt bei Wertänderung weich von alt nach neu (ease-out). */
export function AnimatedNumber({
  value,
  durationMs = 500,
  delayMs = 0,
  startFrom,
  className,
}: {
  value: number;
  durationMs?: number;
  /** Verzögerung vor dem Start (z. B. nach einer Einblend-Animation). */
  delayMs?: number;
  /** Startwert für eine Animation beim Mounten (z. B. 0 → Endwert). */
  startFrom?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(startFrom ?? value);
  const fromRef = useRef(startFrom ?? value);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;

    let raf = 0;
    let start: number | undefined;
    const step = (t: number) => {
      if (start === undefined) start = t;
      const p = Math.min((t - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(step);
      else fromRef.current = to;
    };
    const timeout = setTimeout(() => {
      raf = requestAnimationFrame(step);
    }, delayMs);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [value, durationMs, delayMs]);

  return <span className={className}>{display}</span>;
}
