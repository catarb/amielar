import { describe, expect, it, vi } from "vitest";

import { handleHealthRequest } from "../route";

describe("GET /api/health", () => {
  it("returns a cache-disabled ok response when PostgreSQL is available", async () => {
    const response = await handleHealthRequest(vi.fn().mockResolvedValue(undefined));
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({ status: "ok" });
  });

  it("returns a generic unavailable response when PostgreSQL fails", async () => {
    const response = await handleHealthRequest(vi.fn().mockRejectedValue(new Error("DATABASE_URL password leaked")));
    expect(response.status).toBe(503);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({ status: "unavailable" });
  });
});
