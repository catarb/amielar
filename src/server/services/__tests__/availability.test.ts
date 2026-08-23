import { describe, expect, it, vi } from "vitest";
import { fromZonedTime } from "date-fns-tz";

import { EXPERIENCE_SLUG, TIMEZONE } from "@/server/domain/reservations/constants";
import { localSlotToInstant } from "@/server/domain/reservations/datetime";
import { ReservationDomainError } from "@/server/domain/reservations/errors";
import { getAvailabilityForDate } from "@/server/services/availability";
import type { AvailabilityRepository } from "@/server/repositories/availability";

function makeRepository(
  reservations: Awaited<ReturnType<AvailabilityRepository["findReservations"]>> = [],
  blocks: Awaited<ReturnType<AvailabilityRepository["findBlocks"]>> = [],
): AvailabilityRepository {
  return {
    findReservations: vi.fn().mockResolvedValue(reservations),
    findBlocks: vi.fn().mockResolvedValue(blocks),
  };
}

const date = "2026-12-15";
const now = new Date("2026-12-14T00:00:00.000Z");

describe("getAvailabilityForDate", () => {
  it("calcula el rango diario argentino y devuelve solo disponibilidad pública", async () => {
    const repository = makeRepository();
    const result = await getAvailabilityForDate(date, now, repository);

    expect(repository.findReservations).toHaveBeenCalledWith(
      new Date("2026-12-15T03:00:00.000Z"),
      new Date("2026-12-16T03:00:00.000Z"),
    );
    expect(repository.findBlocks).toHaveBeenCalledWith(
      new Date("2026-12-15T03:00:00.000Z"),
      new Date("2026-12-16T03:00:00.000Z"),
    );
    expect(result).toEqual({
      date,
      timezone: TIMEZONE,
      slots: expect.arrayContaining([{ startTime: "06:00", endTime: "07:00" }]),
    });
    expect(Object.keys(result.slots[0])).toEqual(["startTime", "endTime"]);
  });

  it("coordina reservas activas, canceladas, soft delete y bloqueos", async () => {
    const repository = makeRepository(
      [
        { experienceSlug: EXPERIENCE_SLUG, slotStart: localSlotToInstant(date, "18:00"), status: "PENDIENTE_PAGO", deletedAt: null },
        { experienceSlug: EXPERIENCE_SLUG, slotStart: localSlotToInstant(date, "19:00"), status: "CANCELADA", deletedAt: null },
        { experienceSlug: EXPERIENCE_SLUG, slotStart: localSlotToInstant(date, "20:00"), status: "CONFIRMADA", deletedAt: new Date() },
      ],
      [{ startsAt: localSlotToInstant(date, "10:00"), endsAt: localSlotToInstant(date, "12:00") }],
    );

    const result = await getAvailabilityForDate(date, now, repository);
    const times = result.slots.map((slot) => slot.startTime);

    expect(times).not.toEqual(expect.arrayContaining(["10:00", "11:00", "18:00"]));
    expect(times).toEqual(expect.arrayContaining(["12:00", "19:00", "20:00"]));
  });

  it("devuelve cero slots para un día completamente bloqueado", async () => {
    const repository = makeRepository([], [
      { startsAt: localSlotToInstant(date, "06:00"), endsAt: localSlotToInstant(date, "21:00") },
      { startsAt: localSlotToInstant(date, "21:00"), endsAt: fromZonedTime(`${date} 22:00:00`, "America/Argentina/Buenos_Aires") },
    ]);

    const result = await getAvailabilityForDate(date, now, repository);
    expect(result.slots).toEqual([]);
  });

  it("no consulta PostgreSQL para una fecha inválida o fuera de temporada", async () => {
    const repository = makeRepository();

    await expect(getAvailabilityForDate("2026-02-30", now, repository)).rejects.toMatchObject({ code: "INVALID_DATE" });
    await expect(getAvailabilityForDate("2027-05-15", now, repository)).rejects.toMatchObject({ code: "OUT_OF_SEASON" });
    expect(repository.findReservations).not.toHaveBeenCalled();
    expect(repository.findBlocks).not.toHaveBeenCalled();
  });

  it("conserva los errores de dominio", async () => {
    const repository = makeRepository();
    await expect(getAvailabilityForDate("2026-02-30", now, repository)).rejects.toBeInstanceOf(ReservationDomainError);
  });
});
