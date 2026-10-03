import { describe, expect, it, vi } from "vitest";
import { getAdminAvailabilityMonth, toggleAdminAvailabilitySlot } from "../admin-availability";
import type { AdminAvailabilityRepository } from "@/server/repositories/admin-availability";
import { localSlotToInstant } from "@/server/domain/reservations/datetime";

function repository(): AdminAvailabilityRepository {
  return {
    findReservations: vi.fn(), findBlocks: vi.fn(), findBlock: vi.fn(), transaction: vi.fn(), findReservationsInTransaction: vi.fn(), findOverlappingBlock: vi.fn(), insertBlock: vi.fn(), deleteBlock: vi.fn(), findBlockInTransaction: vi.fn(),
    findReservationsForRange: vi.fn().mockResolvedValue([{ id: "r1", slotStart: localSlotToInstant("2026-09-15", "10:00"), status: "CONFIRMADA", deletedAt: null, experienceSlug: "aire-de-colmena" }]),
    findBlocksForRange: vi.fn().mockResolvedValue([{ id: "b1", startsAt: localSlotToInstant("2026-09-15", "11:00"), endsAt: localSlotToInstant("2026-09-15", "12:00"), reason: null }]),
  } as unknown as AdminAvailabilityRepository;
}

describe("getAdminAvailabilityMonth", () => {
  it("resume una consulta mensual y distingue temporada, reservas y bloqueos", async () => {
    const source = repository(); const result = await getAdminAvailabilityMonth("2026-09", source);
    expect(result.days).toHaveLength(30); expect(result.days[14]).toMatchObject({ date: "2026-09-15", totalSlots: 16, availableCount: 14, reservedCount: 1, blockedCount: 1 });
    expect(source.findReservationsForRange).toHaveBeenCalledTimes(1); expect(source.findBlocksForRange).toHaveBeenCalledTimes(1);
  });
  it("marca abril como temporada y mayo como fuera de temporada", async () => {
    const result = await getAdminAvailabilityMonth("2026-05", repository()); expect(result.days[0]).toMatchObject({ inSeason: false, totalSlots: 0 });
  });
});

describe("toggleAdminAvailabilitySlot", () => {
  const date = "2026-09-15";
  function source(initialBlocks: Array<{ id: string; startsAt: Date; endsAt: Date; reason: string | null }> = [], reserved = false) {
    const blocks = [...initialBlocks];
    const repository = {
      transaction: vi.fn(async (callback: (tx: { execute: ReturnType<typeof vi.fn> }) => Promise<unknown>) => callback({ execute: vi.fn() })),
      findReservationsInTransaction: vi.fn().mockImplementation(async () => reserved ? [{ id: "reservation", status: "CONFIRMADA", deletedAt: null, slotStart: localSlotToInstant(date, "10:00") }] : []),
      findOverlappingBlock: vi.fn().mockImplementation(async (_tx, start: Date, end: Date) => blocks.find((block) => block.startsAt < end && block.endsAt > start) ?? null),
      insertBlock: vi.fn().mockImplementation(async (_tx, startsAt: Date, endsAt: Date, reason: string | null) => { const block = { id: `block-${blocks.length}`, startsAt, endsAt, reason }; blocks.push(block); return block; }),
      deleteBlock: vi.fn().mockImplementation(async (_tx, id: string) => { const index = blocks.findIndex((block) => block.id === id); if (index >= 0) blocks.splice(index, 1); }),
    };
    return { blocks, repository: repository as unknown as AdminAvailabilityRepository };
  }

  it("bloquea un horario disponible y conserva la escritura en el repositorio", async () => {
    const { blocks, repository } = source();
    await expect(toggleAdminAvailabilitySlot({ date, startTime: "10:00", expectedState: "AVAILABLE" }, repository)).resolves.toEqual({ state: "BLOCKED" });
    expect(blocks).toMatchObject([{ startsAt: localSlotToInstant(date, "10:00"), endsAt: localSlotToInstant(date, "11:00") }]);
  });

  it("libera solo la hora elegida y preserva las otras horas y el motivo", async () => {
    const { blocks, repository } = source([{ id: "original", startsAt: localSlotToInstant(date, "09:00"), endsAt: localSlotToInstant(date, "12:00"), reason: "Viaje" }]);
    await expect(toggleAdminAvailabilitySlot({ date, startTime: "10:00", expectedState: "BLOCKED" }, repository)).resolves.toEqual({ state: "AVAILABLE" });
    expect(blocks).toMatchObject([
      { startsAt: localSlotToInstant(date, "09:00"), endsAt: localSlotToInstant(date, "10:00"), reason: "Viaje" },
      { startsAt: localSlotToInstant(date, "11:00"), endsAt: localSlotToInstant(date, "12:00"), reason: "Viaje" },
    ]);
  });

  it("rechaza reservas activas y estados desactualizados sin escribir", async () => {
    const reserved = source([], true);
    await expect(toggleAdminAvailabilitySlot({ date, startTime: "10:00", expectedState: "AVAILABLE" }, reserved.repository)).rejects.toMatchObject({ code: "SLOT_RESERVED" });
    expect(reserved.blocks).toHaveLength(0);
    const stale = source();
    await expect(toggleAdminAvailabilitySlot({ date, startTime: "10:00", expectedState: "BLOCKED" }, stale.repository)).rejects.toMatchObject({ code: "SLOT_STATE_CHANGED" });
    expect(stale.blocks).toHaveLength(0);
  });
});
