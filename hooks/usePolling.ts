"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface PollingState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  /** Erzwingt eine sofortige erneute Abfrage. */
  refresh: () => void;
}

/**
 * Generischer Polling-Hook.
 *
 * - Ruft `fetcher` initial und danach alle `intervalMs` auf.
 * - Pausiert, solange der Tab im Hintergrund ist (`document.hidden`), und
 *   aktualisiert sofort bei Rückkehr in den Vordergrund (schont das Backend).
 * - Behält bei einem fehlgeschlagenen Abruf den zuletzt erfolgreichen Stand.
 */
export function usePolling<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  intervalMs = 45_000,
): PollingState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const refresh = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const tick = async () => {
      if (typeof document !== "undefined" && document.hidden) return;
      try {
        const result = await fetcherRef.current(controller.signal);
        if (active) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (active && !controller.signal.aborted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void tick();
    const intervalId = setInterval(() => void tick(), intervalMs);

    const onVisibility = () => {
      if (typeof document !== "undefined" && !document.hidden) void tick();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      active = false;
      controller.abort();
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [intervalMs, nonce]);

  return { data, error, isLoading, refresh };
}
