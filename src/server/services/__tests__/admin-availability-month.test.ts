import { describe, expect, it, vi } from "vitest";
import { getAdminAvailabilityMonth } from "../admin-availability";
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
