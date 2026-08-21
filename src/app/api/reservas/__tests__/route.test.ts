import { describe, expect, it, vi } from "vitest";

import { ReservationDomainError } from "@/server/domain/reservations/errors";
import { createRateLimiter } from "@/server/security/rate-limit";
import { ReservationServiceError } from "@/server/services/reservation-errors";
import { handleReservationRequest } from "../route";

const validBody = {
  date: "2026-12-15",
  startTime: "18:00",
  fullName: "María Pérez",
  phone: "+5492302123456",
  locality: "General Pico",
  peopleCount: 2,
  message: "Hola",
};

describe("POST /api/reservas", () => {
  it("acepta honeypot vacío u omitido y rechaza honeypot completo sin llamar al service", async () => {
    const save = vi.fn().mockResolvedValue({ reservationId: "id" });
    const empty = await handleReservationRequest(
      new Request("http://localhost/api/reservas", { method: "POST", body: JSON.stringify({ ...validBody, website: "" }) }),
      save,
    );
    expect(empty.status).toBe(201);

    const filled = await handleReservationRequest(
      new Request("http://localhost/api/reservas", { method: "POST", body: JSON.stringify({ ...validBody, website: "https://spam.example" }) }),
      save,
    );
    expect(filled.status).toBe(400);
    expect(await filled.json()).toEqual({ error: { code: "INVALID_REQUEST", message: "La solicitud no es válida." } });
    expect(save).toHaveBeenCalledTimes(1);
  });

  it("rechaza body mayor a 16 KiB sin llamar al service", async () => {
    const save = vi.fn();
    const response = await handleReservationRequest(
      new Request("http://localhost/api/reservas", { method: "POST", body: JSON.stringify({ ...validBody, message: "x".repeat(20_000) }) }),
      save,
    );
    expect(response.status).toBe(413);
    expect(await response.json()).toEqual({ error: { code: "PAYLOAD_TOO_LARGE", message: "La solicitud es demasiado grande." } });
    expect(save).not.toHaveBeenCalled();
  });

  it("rechaza Content-Length excesivo temprano", async () => {
    const save = vi.fn();
    const response = await handleReservationRequest(
      new Request("http://localhost/api/reservas", { method: "POST", headers: { "content-length": "20000" }, body: JSON.stringify(validBody) }),
      save,
    );
    expect(response.status).toBe(413);
    expect(save).not.toHaveBeenCalled();
  });

  it("devuelve 429 y Retry-After después del décimo intento por IP", async () => {
    const limiter = createRateLimiter({ max: 10, now: () => 1000, windowMs: 60_000 });
    const save = vi.fn().mockResolvedValue({ reservationId: "id" });
    const request = () => new Request("http://localhost/api/reservas", {
      method: "POST",
      headers: { "x-forwarded-for": "203.0.113.10" },
      body: JSON.stringify(validBody),
    });
    for (let attempt = 0; attempt < 10; attempt += 1) {
      expect((await handleReservationRequest(request(), save, limiter)).status).toBe(201);
    }
    const response = await handleReservationRequest(request(), save, limiter);
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("60");
    expect((await response.json()).error.code).toBe("RATE_LIMITED");
  });

  it("devuelve 400 para JSON inválido", async () => {
    const response = await handleReservationRequest(
      new Request("http://localhost/api/reservas", { method: "POST", body: "{" }),
      vi.fn(),
    );
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: { code: "INVALID_JSON", message: "La solicitud no es válida." },
    });
  });

  it("devuelve 422 con campos públicos simples", async () => {
    const response = await handleReservationRequest(
      new Request("http://localhost/api/reservas", {
        method: "POST",
        body: JSON.stringify({ ...validBody, peopleCount: 3, status: "CONFIRMADA" }),
      }),
      vi.fn(),
    );
    expect(response.status).toBe(422);
    expect(await response.json()).toMatchObject({
      error: { code: "VALIDATION_ERROR", fields: expect.any(Object) },
    });
  });

  it.each([
    [new ReservationDomainError("OUT_OF_SEASON", "internal"), 422, "OUT_OF_SEASON"],
    [new ReservationDomainError("INVALID_START_TIME", "internal"), 422, "INVALID_START_TIME"],
    [new ReservationServiceError("BOOKING_WINDOW_CLOSED", "internal"), 409, "BOOKING_WINDOW_CLOSED"],
    [new ReservationServiceError("SLOT_BLOCKED", "internal"), 409, "SLOT_BLOCKED"],
    [new ReservationServiceError("SLOT_UNAVAILABLE", "internal"), 409, "SLOT_UNAVAILABLE"],
  ])("mapea errores de dominio %s", async (error, status, code) => {
    const response = await handleReservationRequest(
      new Request("http://localhost/api/reservas", { method: "POST", body: JSON.stringify(validBody) }),
      vi.fn().mockRejectedValue(error),
    );
    expect(response.status).toBe(status);
    expect((await response.json()).error.code).toBe(code);
  });

  it("devuelve 201 sin datos personales", async () => {
    const response = await handleReservationRequest(
      new Request("http://localhost/api/reservas", { method: "POST", body: JSON.stringify(validBody) }),
      vi.fn().mockResolvedValue({
        reservationId: "uuid",
        status: "PENDIENTE_PAGO",
        date: "2026-12-15",
        startTime: "18:00",
        endTime: "19:00",
        timezone: "America/Argentina/Buenos_Aires",
        message: "Recibimos tu reserva.",
      }),
    );
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({
      reservationId: "uuid",
      status: "PENDIENTE_PAGO",
      date: "2026-12-15",
      startTime: "18:00",
      endTime: "19:00",
      timezone: "America/Argentina/Buenos_Aires",
      message: "Recibimos tu reserva.",
    });
  });

  it("oculta errores internos", async () => {
    const response = await handleReservationRequest(
      new Request("http://localhost/api/reservas", { method: "POST", body: JSON.stringify(validBody) }),
      vi.fn().mockRejectedValue(new Error("DATABASE_URL password leaked")),
    );
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body).toEqual({
      error: { code: "INTERNAL_ERROR", message: "No se pudo procesar la reserva." },
    });
    expect(JSON.stringify(body)).not.toContain("DATABASE_URL");
  });
});
