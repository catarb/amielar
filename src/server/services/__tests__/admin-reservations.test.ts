import { describe, expect, it, vi } from "vitest";

import { localDateToDayRange } from "@/server/domain/reservations/datetime";
import {
  ADMIN_RESERVATIONS_PAGE_SIZE,
  listAdminReservations,
  parseAdminReservationFilters,
} from "../admin-reservations";
import type { AdminReservationRow } from "@/server/repositories/admin-reservations";

const row = (overrides: Partial<AdminReservationRow> = {}): AdminReservationRow => ({
  id: "11111111-1111-4111-8111-111111111111",
  status: "PENDIENTE_PAGO" as const,
  slotStart: new Date("2026-12-15T21:00:00.000Z"),
  fullName: "Ana Prueba",
  phone: "+5492304000000",
  locality: "General Pico",
  peopleCount: 2,
  message: null,
  createdAt: new Date("2026-08-21T12:00:00.000Z"),
  confirmedAt: null,
  cancelledAt: null,
  ...overrides,
});

describe("admin reservation service", () => {
  it("convierte horario a Argentina y calcula paginaciÃ³n", async () => {
    const repository = { list: vi.fn().mockResolvedValue({ rows: [row()], total: 21 }), findById: vi.fn() };
    const result = await listAdminReservations({ page: 2 }, repository);
    expect(result.items[0]).toMatchObject({ date: "2026-12-15", startTime: "18:00", endTime: "19:00" });
    expect(result.pagination).toEqual({ page: 2, pageSize: ADMIN_RESERVATIONS_PAGE_SIZE, total: 21, totalPages: 2 });
    expect(repository.list).toHaveBeenCalledWith(expect.objectContaining({ page: 2, pageSize: 20 }));
  });

  it("calcula el rango de fecha en timezone argentino", () => {
    const parsed = parseAdminReservationFilters(new URLSearchParams("date=2026-12-15"));
    expect(parsed).toEqual({ filters: { status: undefined, date: "2026-12-15", query: undefined, page: 1 } });
    if (!("filters" in parsed)) throw new Error("expected valid filters");
    const range = localDateToDayRange(parsed.filters.date!);
    expect(range.start.toISOString()).toBe("2026-12-15T03:00:00.000Z");
    expect(range.end.toISOString()).toBe("2026-12-16T03:00:00.000Z");
  });

  it("valida status, fecha, bÃºsqueda y pÃ¡gina", () => {
    expect(parseAdminReservationFilters(new URLSearchParams("status=UNKNOWN"))).toEqual({ error: "INVALID_FILTER" });
    expect(parseAdminReservationFilters(new URLSearchParams("date=2026-02-30"))).toEqual({ error: "INVALID_DATE" });
    expect(parseAdminReservationFilters(new URLSearchParams("page=0"))).toEqual({ error: "INVALID_PAGE" });
    expect(parseAdminReservationFilters(new URLSearchParams("q=%20%20Ana%20%20"))).toEqual({ filters: { status: undefined, date: undefined, query: "Ana", page: 1 } });
  });

  it("permite consultar detalle existente y devuelve null para soft-delete ausente", async () => {
    const repository = { list: vi.fn(), findById: vi.fn().mockResolvedValueOnce(row({ message: "Llegamos temprano" })).mockResolvedValueOnce(null) };
    const { getAdminReservationById } = await import("../admin-reservations");
    await expect(getAdminReservationById(row().id, repository)).resolves.toMatchObject({ message: "Llegamos temprano" });
    await expect(getAdminReservationById(row().id, repository)).resolves.toBeNull();
  });
});
