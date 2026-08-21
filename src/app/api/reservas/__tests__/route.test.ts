import { describe, expect, it, vi } from "vitest";

import { ReservationDomainError } from "@/server/domain/reservations/errors";
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
