import { describe, expect, it, vi } from "vitest";

import { localDateToDayRange } from "@/server/domain/reservations/datetime";
import {
  ADMIN_RESERVATIONS_PAGE_SIZE,
  adminReservationDashboardFromResult,
  listAdminReservations,
  parseAdminReservationFilters,
  createAdminReservation,
} from "../admin-reservations";
import type { AdminReservationRow } from "@/server/repositories/admin-reservations";

const row = (overrides: Partial<AdminReservationRow> = {}): AdminReservationRow => ({
  id: "11111111-1111-4111-8111-111111111111",
  experienceSlug: "aire-de-colmena",
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
  const createInput = { experienceSlug: "aire-de-colmena" as const, date: "2026-12-15", startTime: "18:00", fullName: " Ana   Prueba ", phone: "+54 9 2304-000-000", locality: " General   Pico ", peopleCount: 2, message: "", status: "PENDIENTE_PAGO" as const };

  function createRepository(overrides = {}) {
    return { hasActiveReservationForSlot: vi.fn().mockResolvedValue(false), hasBlockingAvailabilityBlock: vi.fn().mockResolvedValue(false), insertReservation: vi.fn().mockResolvedValue({ id: "reservation-id" }), ...overrides };
  }

  it("crea una reserva administrativa sin aplicar lead time y usa el lock", async () => {
    const repository = createRepository(); const execute = vi.fn().mockResolvedValue(undefined);
    const result = await createAdminReservation(createInput, { now: new Date("2026-12-15T20:30:00.000Z"), repository, transaction: (callback) => callback({ execute } as never) });
    expect(result).toEqual({ reservationId: "reservation-id", status: "PENDIENTE_PAGO" });
    expect(execute).toHaveBeenCalledTimes(1);
    expect(repository.insertReservation).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ status: "PENDIENTE_PAGO", confirmedAt: null, slotStart: new Date("2026-12-15T21:00:00.000Z") }));
  });

  it("asigna confirmedAt solo a reservas confirmadas y rechaza bloqueos u ocupación", async () => {
    const confirmed = createRepository();
    await createAdminReservation({ ...createInput, status: "CONFIRMADA" }, { now: new Date("2026-12-15T20:30:00.000Z"), repository: confirmed, transaction: (callback) => callback({ execute: vi.fn() } as never) });
    expect(confirmed.insertReservation).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ status: "CONFIRMADA", confirmedAt: new Date("2026-12-15T20:30:00.000Z") }));
    const blocked = createRepository({ hasBlockingAvailabilityBlock: vi.fn().mockResolvedValue(true) });
    await expect(createAdminReservation(createInput, { repository: blocked, transaction: (callback) => callback({ execute: vi.fn() } as never) })).rejects.toMatchObject({ code: "SLOT_BLOCKED" });
    const reserved = createRepository({ hasActiveReservationForSlot: vi.fn().mockResolvedValue(true) });
    await expect(createAdminReservation(createInput, { repository: reserved, transaction: (callback) => callback({ execute: vi.fn() } as never) })).rejects.toMatchObject({ code: "SLOT_UNAVAILABLE" });
  });
  it("resume estados activos y ordena las próximas reservas recibidas", () => {
    const result = adminReservationDashboardFromResult({
      counts: { PENDIENTE_PAGO: 2, CONFIRMADA: 1 },
      upcomingCount: 5,
      rows: [row({ id: "first", slotStart: new Date("2026-12-15T21:00:00.000Z") }), row({ id: "second", status: "CONFIRMADA", slotStart: new Date("2026-12-16T21:00:00.000Z") })],
    });
    expect(result.pendingCount).toBe(2);
    expect(result.confirmedCount).toBe(1);
    expect(result.upcomingCount).toBe(5);
    expect(result.upcoming.map((item) => item.id)).toEqual(["first", "second"]);
    expect(result.upcoming[0].date).toBe("2026-12-15");
  });

  it("convierte horario a Argentina y calcula paginación", async () => {
    const repository = { list: vi.fn().mockResolvedValue({ rows: [row()], total: 21 }), findById: vi.fn() };
    const result = await listAdminReservations({ page: 2 }, repository);
    expect(result.items[0]).toMatchObject({ date: "2026-12-15", startTime: "18:00", endTime: "19:00" });
    expect(result.pagination).toEqual({ page: 2, pageSize: ADMIN_RESERVATIONS_PAGE_SIZE, total: 21, totalPages: 2 });
    expect(repository.list).toHaveBeenCalledWith(expect.objectContaining({ page: 2, pageSize: 20 }));
  });

  it("calcula el rango de fecha en timezone argentino", () => {
    const parsed = parseAdminReservationFilters(new URLSearchParams("date=2026-12-15"));
    expect(parsed).toEqual({ filters: { experienceSlug: undefined, status: undefined, date: "2026-12-15", query: undefined, page: 1 } });
    if (!("filters" in parsed)) throw new Error("expected valid filters");
    const range = localDateToDayRange(parsed.filters.date!);
    expect(range.start.toISOString()).toBe("2026-12-15T03:00:00.000Z");
    expect(range.end.toISOString()).toBe("2026-12-16T03:00:00.000Z");
  });

  it("valida status, fecha, búsqueda y página", () => {
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
