import { describe, expect, it, vi } from "vitest";

import { handleAdminBlockCreateRequest } from "../route";

const bodyRequest = (body: string, origin = "http://localhost") => new Request("http://localhost/api/admin/bloqueos", { method: "POST", headers: { "content-type": "application/json", origin }, body });

describe("POST admin bloqueos", () => {
  it("evalúa autenticación antes de Origin", async () => {
    const origin = vi.fn(() => true);
    const response = await handleAdminBlockCreateRequest(bodyRequest("{}"), async () => false, origin);
    expect(response.status).toBe(401);
    expect(origin).not.toHaveBeenCalled();
  });

  it("rechaza Origin no permitido y JSON inválido", async () => {
    expect((await handleAdminBlockCreateRequest(bodyRequest("{}"), async () => true, () => false)).status).toBe(403);
    expect((await handleAdminBlockCreateRequest(bodyRequest("{", "http://localhost"), async () => true, () => true)).status).toBe(400);
  });

  it("valida el payload estricto y crea con 201", async () => {
    const create = vi.fn().mockResolvedValue({ id: "11111111-1111-4111-8111-111111111111", startsAt: new Date("2026-12-15T09:00:00.000Z"), endsAt: new Date("2026-12-15T10:00:00.000Z"), reason: null });
    expect((await handleAdminBlockCreateRequest(bodyRequest(JSON.stringify({ date: "2026-12-15", startTime: "18:00", endTime: "19:00", extra: true })), async () => true, () => true, create)).status).toBe(422);
    const response = await handleAdminBlockCreateRequest(bodyRequest(JSON.stringify({ date: "2026-12-15", startTime: "18:00", endTime: "19:00" })), async () => true, () => true, create);
    expect(response.status).toBe(201);
    expect(create).toHaveBeenCalledWith({ date: "2026-12-15", startTime: "18:00", endTime: "19:00", reason: null, confirmImpact: false });
  });

  it("rechaza un body sobredimensionado antes del service", async () => {
    const create = vi.fn();
    const response = await handleAdminBlockCreateRequest(bodyRequest("x".repeat(9000)), async () => true, () => true, create);
    expect(response.status).toBe(413);
    expect((await response.json()).error.code).toBe("PAYLOAD_TOO_LARGE");
    expect(create).not.toHaveBeenCalled();
  });
});
