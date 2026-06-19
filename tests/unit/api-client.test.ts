import { afterEach, describe, expect, it, vi } from "vitest";
import { apiGet, ApiError } from "@/lib/api/client";

function mockFetch(impl: typeof fetch) {
  vi.stubGlobal("fetch", impl);
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("apiGet error mapping", () => {
  it("gibt geparste Daten bei 200 zurück", async () => {
    mockFetch(
      vi.fn(async () =>
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      ) as unknown as typeof fetch,
    );
    await expect(apiGet<{ ok: boolean }>("/x")).resolves.toEqual({ ok: true });
  });

  it("mappt 404 auf ApiError kind=not-found", async () => {
    mockFetch(
      vi.fn(async () => new Response("", { status: 404 })) as unknown as typeof fetch,
    );
    await expect(apiGet("/missing")).rejects.toMatchObject({
      name: "ApiError",
      kind: "not-found",
      status: 404,
    });
  });

  it("mappt 500 auf ApiError kind=http", async () => {
    mockFetch(
      vi.fn(async () => new Response("", { status: 500 })) as unknown as typeof fetch,
    );
    await expect(apiGet("/boom")).rejects.toMatchObject({ kind: "http", status: 500 });
  });

  it("mappt Netzwerkfehler auf ApiError kind=network", async () => {
    mockFetch(
      vi.fn(async () => {
        throw new Error("offline");
      }) as unknown as typeof fetch,
    );
    await expect(apiGet("/x")).rejects.toMatchObject({ kind: "network" });
  });

  it("mappt ungültiges JSON auf ApiError kind=parse", async () => {
    mockFetch(
      vi.fn(async () => new Response("not json", { status: 200 })) as unknown as typeof fetch,
    );
    const error = await apiGet("/x").catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).kind).toBe("parse");
  });
});
