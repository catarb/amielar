import { describe, expect, it, vi } from "vitest";

import { handleAdminReservationDetailRequest } from "../[id]/route";
import { handleAdminReservationsRequest } from "../route";

const validId = "11111111-1111-4111-8111-111111111111";

function request(path: string): Request {
  return new Request(`http://localhost${path}`);
}

describe("admin reservation APIs", () => {
  it("rechaza listado y detalle sin sesiÃ³n", async () => {
    const authenticate = vi.fn().mockResolvedValue(false);
    expect((await handleAdminReservationsRequest(request("/api/admin/reservas"), authenticate)).status).toBe(401);
    expect((await handleAdminReservationDetailRequest(request(`/api/admin/reservas/${validId}`), validId, authenticate)).status).toBe(401);
  });

  it("lista con filtros vÃ¡lidos y no cachea datos administrativos", async () => {
    const list = vi.fn().mockResolvedValue({ items: [], pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 }, timezone: "America/Argentina/Buenos_Aires" });
    const response = await handleAdminReservationsRequest(request("/api/admin/reservas?status=PENDIENTE_PAGO&date=2026-12-15&q=Ana&page=2"), async () => true, list);
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(list).toHaveBeenCalledWith({ status: "PENDIENTE_PAGO", date: "2026-12-15", query: "Ana", page: 2 });
  });

  it("rechaza filtros invÃ¡lidos", async () => {
    expect((await handleAdminReservationsRequest(request("/api/admin/reservas?status=NO"), async () => true)).status).toBe(400);
    expect((await handleAdminReservationsRequest(request("/api/admin/reservas?date=2026-99-99"), async () => true)).status).toBe(400);
    expect((await handleAdminReservationsRequest(request("/api/admin/reservas?page=no"), async () => true)).status).toBe(400);
  });

  it("valida detalle, devuelve 404 y 200", async () => {
    expect((await handleAdminReservationDetailRequest(request("/api/admin/reservas/no-es-un-uuid"), "no-es-un-uuid", async () => true)).status).toBe(400);
    expect((await handleAdminReservationDetailRequest(request(`/api/admin/reservas/${validId}`), validId, async () => true, async () => null)).status).toBe(404);
    const detail = { id: validId, status: "PENDIENTE_PAGO" as const, date: "2026-12-15", startTime: "18:00", endTime: "19:00", fullName: "Ana Prueba", phone: "+5492304000000", locality: "General Pico", peopleCount: 2, message: null, createdAt: "2026-08-21T12:00:00.000Z", confirmedAt: null, cancelledAt: null };
    const response = await handleAdminReservationDetailRequest(request(`/api/admin/reservas/${validId}`), validId, async () => true, async () => detail);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(detail);
  });
});
