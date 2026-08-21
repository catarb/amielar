import { describe, expect, it, vi } from "vitest";

import { ReservationDomainError } from "@/server/domain/reservations/errors";
import { GET, handleAvailabilityRequest } from "../route";

describe("GET /api/disponibilidad", () => {
  it("devuelve 400 si falta date", async () => {
    const response = await GET(new Request("http://localhost/api/disponibilidad"));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: { code: "INVALID_DATE", message: "La fecha no es válida." },
    });
  });

  it("devuelve 400 para fecha inválida", async () => {
    const response = await handleAvailabilityRequest(
      new Request("http://localhost/api/disponibilidad?date=2026-02-30"),
      vi.fn().mockRejectedValue(new ReservationDomainError("INVALID_DATE", "internal")),
    );
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: { code: "INVALID_DATE", message: "La fecha no es válida." },
    });
  });

  it("devuelve 422 fuera de temporada", async () => {
    const response = await handleAvailabilityRequest(
      new Request("http://localhost/api/disponibilidad?date=2027-05-15"),
      vi.fn().mockRejectedValue(new ReservationDomainError("OUT_OF_SEASON", "internal")),
    );
    expect(response.status).toBe(422);
    expect(await response.json()).toEqual({
      error: { code: "OUT_OF_SEASON", message: "La fecha está fuera de temporada." },
    });
  });

  it("devuelve solamente el contrato público", async () => {
    const response = await handleAvailabilityRequest(
      new Request("http://localhost/api/disponibilidad?date=2026-12-15"),
      vi.fn().mockResolvedValue({
        date: "2026-12-15",
        timezone: "America/Argentina/Buenos_Aires",
        experience: "aire-de-colmena",
        slots: [{ startTime: "06:00", endTime: "07:00" }],
      }),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({
      date: "2026-12-15",
      timezone: "America/Argentina/Buenos_Aires",
      experience: "aire-de-colmena",
      slots: [{ startTime: "06:00", endTime: "07:00" }],
    });
  });

  it("oculta errores de PostgreSQL y devuelve 500 genérico", async () => {
    const response = await handleAvailabilityRequest(
      new Request("http://localhost/api/disponibilidad?date=2026-12-15"),
      vi.fn().mockRejectedValue(new Error("DATABASE_URL password leaked")),
    );
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body).toEqual({
      error: { code: "INTERNAL_ERROR", message: "No se pudo consultar la disponibilidad." },
    });
    expect(JSON.stringify(body)).not.toContain("DATABASE_URL");
  });
});
