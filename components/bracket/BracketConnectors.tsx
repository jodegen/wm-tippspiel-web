"use client";

import { useEffect, useState, type RefObject } from "react";

interface Edge {
  from: number;
  to: number;
}

/**
 * Zeichnet die Verbindungslinien (FR-007) als SVG-Overlay über den Spalten.
 * Misst die Positionen der Spielkarten (`[data-fifa]`) relativ zum Scroll-
 * Container und verbindet jedes Spiel mit seinem Folgespiel (orthogonale Elbow-
 * Linie). Reines SVG/CSS — keine zusätzliche Abhängigkeit.
 */
export function BracketConnectors({
  containerRef,
  edges,
  revision,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  edges: Edge[];
  /** Wert, dessen Änderung ein Neuzeichnen erzwingt (z. B. die Bracket-Daten). */
  revision?: unknown;
}) {
  const [paths, setPaths] = useState<string[]>([]);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const compute = () => {
      const crect = container.getBoundingClientRect();
      const rectOf = (no: number) => {
        const el = container.querySelector<HTMLElement>(`[data-fifa="${no}"]`);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          left: r.left - crect.left + container.scrollLeft,
          right: r.right - crect.left + container.scrollLeft,
          midY: (r.top + r.bottom) / 2 - crect.top + container.scrollTop,
        };
      };

      const next: string[] = [];
      for (const e of edges) {
        const a = rectOf(e.from);
        const b = rectOf(e.to);
        if (!a || !b) continue;
        const x1 = a.right;
        const y1 = a.midY;
        const x2 = b.left;
        const y2 = b.midY;
        const midX = x1 + (x2 - x1) / 2;
        next.push(`M ${x1} ${y1} H ${midX} V ${y2} H ${x2}`);
      }
      setSize({ w: container.scrollWidth, h: container.scrollHeight });
      setPaths(next);
    };

    compute();
    const observer = new ResizeObserver(compute);
    observer.observe(container);
    window.addEventListener("resize", compute);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [containerRef, edges, revision]);

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 text-border"
      width={size.w}
      height={size.h}
      aria-hidden
    >
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth={1.5} />
      ))}
    </svg>
  );
}
