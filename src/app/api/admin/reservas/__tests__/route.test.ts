import { describe, expect, it, vi } from "vitest";

import { handleAdminReservationDetailRequest } from "../[id]/route";
import { handleAdminReservationCreateRequest, handleAdminReservationsRequest } from "../route";

const validId = "11111111-1111-4111-8111-111111111111";

function request(path: string): Request {
  return new Request(`http://localhost${path}`);
}

const createBody = {
  experienceSlug: "aire-de-colmena",
  date: "2026-12-15",
  startTime: "18:00",
  fullName: "Ana Prueba",
  phone: "+5492304000000",
  locality: "General Pico",
  peopleCount: 2,
  message: null,
  status: "PENDIENTE_PAGO",
};

function createRequest(body: unknown, origin = "http://localhost") {
  return new Request("http://localhost/api/admin/reservas", { method: "POST", headers: { "content-type": "application/json", origin }, body: JSON.stringify(body) });
}

describe("admin reservation APIs", () => {
  it("rechaza listado y detalle sin sesión", async () => {
    const authenticate = vi.fn().mockResolvedValue(false);
    expect((await handleAdminReservationsRequest(request("/api/admin/reservas"), authenticate)).status).toBe(401);
    expect((await handleAdminReservationDetailRequest(request(`/api/admin/reservas/${validId}`), validId, authenticate)).status).toBe(401);
  });

  it("lista con filtros válidos y no cachea datos administrativos", async () => {
    const list = vi.fn().mockResolvedValue({ items: [], pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 }, timezone: "America/Argentina/Buenos_Aires" });
    const response = await handleAdminReservationsRequest(request("/api/admin/reservas?status=PENDIENTE_PAGO&date=2026-12-15&q=Ana&page=2"), async () => true, list);
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(list).toHaveBeenCalledWith({ experienceSlug: undefined, status: "PENDIENTE_PAGO", date: "2026-12-15", query: "Ana", page: 2 });
  });

  it("rechaza filtros inválidos", async () => {
    expect((await handleAdminReservationsRequest(request("/api/admin/reservas?status=NO"), async () => true)).status).toBe(400);
    expect((await handleAdminReservationsRequest(request("/api/admin/reservas?date=2026-99-99"), async () => true)).status).toBe(400);
    expect((await handleAdminReservationsRequest(request("/api/admin/reservas?page=no"), async () => true)).status).toBe(400);
  });

  it("valida detalle, devuelve 404 y 200", async () => {
    expect((await handleAdminReservationDetailRequest(request("/api/admin/reservas/no-es-un-uuid"), "no-es-un-uuid", async () => true)).status).toBe(400);
    expect((await handleAdminReservationDetailRequest(request(`/api/admin/reservas/${validId}`), validId, async () => true, async () => null)).status).toBe(404);
    const detail = { id: validId, experienceSlug: "aire-de-colmena" as const, status: "PENDIENTE_PAGO" as const, date: "2026-12-15", startTime: "18:00", endTime: "19:00", fullName: "Ana Prueba", phone: "+5492304000000", locality: "General Pico", peopleCount: 2, message: null, createdAt: "2026-08-21T12:00:00.000Z", confirmedAt: null, cancelledAt: null };
    const response = await handleAdminReservationDetailRequest(request(`/api/admin/reservas/${validId}`), validId, async () => true, async () => detail);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(detail);
  });

  it("protege la creación con sesión y Origin", async () => {
    const origin = vi.fn(() => true);
    expect((await handleAdminReservationCreateRequest(createRequest(createBody), async () => false, origin)).status).toBe(401);
    expect(origin).not.toHaveBeenCalled();
    expect((await handleAdminReservationCreateRequest(createRequest(createBody), async () => true, () => false)).status).toBe(403);
  });

  it("rechaza JSON, payload estricto, estado cancelado y cantidad inválida", async () => {
    const create = vi.fn();
    expect((await handleAdminReservationCreateRequest(new Request("http://localhost/api/admin/reservas", { method: "POST", headers: { origin: "http://localhost" }, body: "{" }), async () => true, () => true, create)).status).toBe(400);
    expect((await handleAdminReservationCreateRequest(createRequest({ ...createBody, extra: true }), async () => true, () => true, create)).status).toBe(422);
    expect((await handleAdminReservationCreateRequest(createRequest({ ...createBody, status: "CANCELADA" }), async () => true, () => true, create)).status).toBe(422);
    expect((await handleAdminReservationCreateRequest(createRequest({ ...createBody, peopleCount: 3 }), async () => true, () => true, create)).status).toBe(422);
    expect(create).not.toHaveBeenCalled();
  });

  it("crea reservas pendientes o confirmadas y mapea conflictos", async () => {
    const create = vi.fn().mockResolvedValue({ reservationId: "reservation-id", status: "PENDIENTE_PAGO" });
    const pending = await handleAdminReservationCreateRequest(createRequest(createBody), async () => true, () => true, create);
    expect(pending.status).toBe(201);
    expect(create).toHaveBeenCalledWith(expect.objectContaining({ status: "PENDIENTE_PAGO" }));

    create.mockResolvedValue({ reservationId: "confirmed-id", status: "CONFIRMADA" });
    const confirmed = await handleAdminReservationCreateRequest(createRequest({ ...createBody, status: "CONFIRMADA" }), async () => true, () => true, create);
    expect(confirmed.status).toBe(201);

    create.mockRejectedValue(new (await import("@/server/services/reservation-errors")).ReservationServiceError("SLOT_UNAVAILABLE", "internal"));
    const conflict = await handleAdminReservationCreateRequest(createRequest(createBody), async () => true, () => true, create);
    expect(conflict.status).toBe(409);
    expect((await conflict.json()).error.message).toBe("Ese horario acaba de dejar de estar disponible.");
  });
});
