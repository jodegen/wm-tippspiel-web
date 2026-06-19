import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { usePolling } from "@/hooks/usePolling";

function setHidden(value: boolean) {
  Object.defineProperty(document, "hidden", {
    configurable: true,
    get: () => value,
  });
}

describe("usePolling", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setHidden(false);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("ruft initial und nach jedem Intervall erneut auf", async () => {
    const fetcher = vi.fn().mockResolvedValue(["a"]);
    renderHook(() => usePolling(fetcher, 1000));

    expect(fetcher).toHaveBeenCalledTimes(1);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    expect(fetcher).toHaveBeenCalledTimes(2);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it("pausiert bei verstecktem Tab und aktualisiert bei Rückkehr sofort", async () => {
    const fetcher = vi.fn().mockResolvedValue([]);
    renderHook(() => usePolling(fetcher, 1000));
    expect(fetcher).toHaveBeenCalledTimes(1);

    setHidden(true);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });
    expect(fetcher).toHaveBeenCalledTimes(1); // kein Abruf im Hintergrund

    setHidden(false);
    await act(async () => {
      document.dispatchEvent(new Event("visibilitychange"));
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(fetcher).toHaveBeenCalledTimes(2); // sofort bei Rückkehr
  });

  it("behält den letzten erfolgreichen Stand bei einem Fehler", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(["ok"])
      .mockRejectedValueOnce(new Error("boom"));
    const { result } = renderHook(() => usePolling<string[]>(fetcher, 1000));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(result.current.data).toEqual(["ok"]);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    expect(result.current.data).toEqual(["ok"]); // unverändert
    expect(result.current.error).toBeTruthy();
  });
});
