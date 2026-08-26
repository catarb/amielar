import { describe, expect, it, vi } from "vitest";

import { handleAdminAvailabilityRequest } from "../route";

const request = (path: string) => new Request(`http://localhost${path}`);

describe("GET admin disponibilidad", () => {
  it("autentica antes de consultar", async () => {
    const load = vi.fn();
    const response = await handleAdminAvailabilityRequest(request("/api/admin/disponibilidad?date=2026-12-15"), async () => false, load);
    expect(response.status).toBe(401);
    expect(load).not.toHaveBeenCalled();
  });

  it("devuelve datos sin cachear", async () => {
    const load = vi.fn().mockResolvedValue({ date: "2026-12-15", timezone: "America/Argentina/Buenos_Aires", slots: [], blocks: [] });
    const response = await handleAdminAvailabilityRequest(request("/api/admin/disponibilidad?date=2026-12-15"), async () => true, load);
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });
});
