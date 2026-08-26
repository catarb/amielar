import { describe, expect, it, vi } from "vitest";

import { handleAdminReservationDeleteRequest, handleAdminReservationPatchRequest } from "../route";
import { AdminReservationActionError } from "@/server/services/admin-reservation-actions";

const id = "11111111-1111-4111-8111-111111111111";
const request = (body?: string, origin?: string) => new Request(`http://localhost/api/admin/reservas/${id}`, { method: "PATCH", headers: { ...(origin ? { origin } : {}), ...(body !== undefined ? { "content-type": "application/json" } : {}) }, body });

describe("admin mutation routes", () => {
  it("aplica autenticaciÃ³n antes de Origin", async () => {
    const response = await handleAdminReservationPatchRequest(request(JSON.stringify({ action: "confirm" })), id, async () => false, () => false);
    expect(response.status).toBe(401);
  });

  it("rechaza Origin ausente, incorrecto y configuraciÃ³n invÃ¡lida", async () => {
    for (const originCheck of [() => false, () => false]) {
      const response = await handleAdminReservationPatchRequest(request(JSON.stringify({ action: "confirm" })), id, async () => true, originCheck);
      expect(response.status).toBe(403);
      expect((await response.json()).error.code).toBe("CSRF_VALIDATION_FAILED");
    }
  });

  it("valida JSON, body, UUID y transiciones", async () => {
    expect((await handleAdminReservationPatchRequest(request("{" , "https://localhost:3000"), id, async () => true, () => true)).status).toBe(400);
    expect((await handleAdminReservationPatchRequest(request(JSON.stringify({ action: "confirm", extra: true }), "https://localhost:3000"), id, async () => true, () => true)).status).toBe(422);
    const invalidIdRequest = new Request("http://localhost/api/admin/reservas/not-uuid", { method: "PATCH", headers: { origin: "https://localhost:3000" }, body: JSON.stringify({ action: "confirm" }) });
    expect((await handleAdminReservationPatchRequest(invalidIdRequest, "not-uuid", async () => true, () => true)).status).toBe(400);
    const conflict = await handleAdminReservationPatchRequest(request(JSON.stringify({ action: "confirm" }), "https://localhost:3000"), id, async () => true, () => true, async () => { throw new AdminReservationActionError("INVALID_STATUS_TRANSITION", "La reserva cancelada no puede volver a confirmarse."); });
    expect(conflict.status).toBe(409);
  });

  it("procesa PATCH y DELETE con Origin vÃ¡lido", async () => {
    const patch = await handleAdminReservationPatchRequest(request(JSON.stringify({ action: "confirm" }), "https://localhost:3000"), id, async () => true, () => true, async () => ({ id, status: "CONFIRMADA" } as never));
    expect(patch.status).toBe(200);
    const del = await handleAdminReservationDeleteRequest(new Request(`http://localhost/api/admin/reservas/${id}`, { method: "DELETE", headers: { origin: "https://localhost:3000" } }), id, async () => true, () => true, async () => undefined);
    expect(del.status).toBe(200);
  });
  it("rechaza un PATCH sobredimensionado antes del service", async () => {
    const actionRunner = vi.fn();
    const response = await handleAdminReservationPatchRequest(request("x".repeat(5000), "https://localhost:3000"), id, async () => true, () => true, actionRunner);
    expect(response.status).toBe(413);
    expect((await response.json()).error.code).toBe("PAYLOAD_TOO_LARGE");
    expect(actionRunner).not.toHaveBeenCalled();
  });
});
