import { describe, expect, it, vi } from "vitest";
import { handleAdminAvailabilityBulkRequest } from "../route";

const request = (body: unknown) => new Request("http://localhost/api/admin/disponibilidad/masiva", {
  method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
});
const valid = { month: "2026-10", weekday: 1, ranges: [{ startTime: "10:00", endTime: "18:00", action: "AVAILABLE" }] };

describe("bulk availability route", () => {
  it("requiere autenticación y origen válido", async () => {
    const update = vi.fn();
    expect((await handleAdminAvailabilityBulkRequest(request(valid), async () => false, () => true, update)).status).toBe(401);
    expect((await handleAdminAvailabilityBulkRequest(request(valid), async () => true, () => false, update)).status).toBe(403);
    expect(update).not.toHaveBeenCalled();
  });
  it("envía una única intención validada al servicio", async () => {
    const update = vi.fn().mockResolvedValue({ updated: 8, reserved: 1, unchanged: 0 });
    const response = await handleAdminAvailabilityBulkRequest(request(valid), async () => true, () => true, update);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ updated: 8, reserved: 1, unchanged: 0 });
    expect(update).toHaveBeenCalledOnce();
    expect(update).toHaveBeenCalledWith(valid);
  });
  it("rechaza carga inválida sin invocar el servicio", async () => {
    const update = vi.fn();
    expect((await handleAdminAvailabilityBulkRequest(request({ ...valid, weekday: 7 }), async () => true, () => true, update)).status).toBe(422);
    expect(update).not.toHaveBeenCalled();
  });
});
