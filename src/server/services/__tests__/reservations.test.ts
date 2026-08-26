import { describe, expect, it, vi } from "vitest";

import { localSlotToInstant } from "@/server/domain/reservations/datetime";
import { createReservationLockKey } from "@/server/db/advisory-lock";
import type { CreateReservationTransaction } from "@/server/repositories/reservations";
import { createReservation } from "../reservations";
import type { ReservationWriteRepository } from "@/server/repositories/reservations";

const input = {
  experienceSlug: "aire-de-colmena",
  date: "2026-12-15",
  startTime: "18:00",
  fullName: "María Pérez",
  phone: "+5492302123456",
  locality: "General Pico",
  peopleCount: 2,
  message: null,
} as const;

function setupRepository(overrides: Partial<ReservationWriteRepository> = {}) {
  return {
    hasActiveReservationForSlot: vi.fn().mockResolvedValue(false),
    hasBlockingAvailabilityBlock: vi.fn().mockResolvedValue(false),
    insertReservation: vi.fn().mockResolvedValue({ id: "reservation-id" }),
    ...overrides,
  } satisfies ReservationWriteRepository;
}

function setupTransaction() {
  return {
    execute: vi.fn().mockResolvedValue(undefined),
  } as unknown as CreateReservationTransaction;
}

describe("createReservation", () => {
  it.each(["aire-de-colmena", "amanecer", "aire-de-colmena-ninos"])("crea reservas para %s", async (experienceSlug) => {
    const repository = setupRepository();
    const result = await createReservation({ ...input, experienceSlug: experienceSlug as typeof input.experienceSlug }, {
      now: new Date("2026-12-15T19:59:59.000Z"),
      repository,
      transaction: (callback) => callback(setupTransaction()),
    });
    expect(result.experienceSlug).toBe(experienceSlug);
    expect(repository.insertReservation).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ experienceSlug }));
  });

  it("crea una reserva pública con status PENDIENTE_PAGO", async () => {
    const repository = setupRepository();
    const transaction = setupTransaction();

    const result = await createReservation(input, {
      now: new Date("2026-12-15T19:59:59.000Z"),
      repository,
      transaction: (callback) => callback(transaction),
    });

    expect(result).toEqual({
      reservationId: "reservation-id",
      status: "PENDIENTE_PAGO",
      experienceSlug: "aire-de-colmena",
      date: "2026-12-15",
      startTime: "18:00",
      endTime: "19:00",
      timezone: "America/Argentina/Buenos_Aires",
      message: expect.any(String),
    });
    expect(repository.insertReservation).toHaveBeenCalledWith(
      transaction,
      expect.objectContaining({
        experienceSlug: "aire-de-colmena",
        slotStart: localSlotToInstant("2026-12-15", "18:00"),
        fullName: "María Pérez",
        phone: "+5492302123456",
        locality: "General Pico",
        peopleCount: 2,
        status: "PENDIENTE_PAGO",
      }),
    );
    expect(transaction.execute).toHaveBeenCalledTimes(1);
  });

  it("usa una clave determinista por experiencia e instante absoluto", () => {
    const slot = localSlotToInstant("2026-12-15", "18:00");
    expect(createReservationLockKey(slot)).toBe(
      createReservationLockKey(new Date(slot.getTime())),
    );
    expect(createReservationLockKey(slot)).not.toBe(
      createReservationLockKey(localSlotToInstant("2026-12-15", "19:00")),
    );
  });

  it.each([
    ["2026-12-15T19:59:59.000Z", true],
    ["2026-12-15T20:00:00.000Z", false],
  ])("aplica anticipación después del lock con now=%s", async (now, allowed) => {
    const repository = setupRepository();
    const transaction = setupTransaction();
    const operation = createReservation(input, {
      now: new Date(now),
      repository,
      transaction: (callback) => callback(transaction),
    });

    if (allowed) {
      await expect(operation).resolves.toMatchObject({ status: "PENDIENTE_PAGO" });
    } else {
      await expect(operation).rejects.toMatchObject({ code: "BOOKING_WINDOW_CLOSED" });
      expect(repository.insertReservation).not.toHaveBeenCalled();
    }
  });

  it("rechaza bloqueos y reservas activas antes del insert", async () => {
    const blocked = setupRepository({ hasBlockingAvailabilityBlock: vi.fn().mockResolvedValue(true) });
    await expect(createReservation(input, { repository: blocked, transaction: (callback) => callback(setupTransaction()) })).rejects.toMatchObject({ code: "SLOT_BLOCKED" });
    expect(blocked.insertReservation).not.toHaveBeenCalled();

    const reserved = setupRepository({ hasActiveReservationForSlot: vi.fn().mockResolvedValue(true) });
    await expect(createReservation(input, { repository: reserved, transaction: (callback) => callback(setupTransaction()) })).rejects.toMatchObject({ code: "SLOT_UNAVAILABLE" });
    expect(reserved.insertReservation).not.toHaveBeenCalled();
  });

  it("mapea la violación del índice parcial a SLOT_UNAVAILABLE", async () => {
    const repository = setupRepository({
      insertReservation: vi.fn().mockRejectedValue({
        code: "23505",
        constraint: "reservations_active_slot_unique_idx",
      }),
    });

    await expect(
      createReservation(input, {
        repository,
        transaction: (callback) => callback(setupTransaction()),
      }),
    ).rejects.toEqual(expect.objectContaining({ code: "SLOT_UNAVAILABLE" }));
  });

  it("no abre transacción fuera de temporada", async () => {
    const transaction = vi.fn();
    await expect(
      createReservation({ ...input, date: "2027-05-15" }, { transaction }),
    ).rejects.toMatchObject({ code: "OUT_OF_SEASON" });
    expect(transaction).not.toHaveBeenCalled();
  });
});
