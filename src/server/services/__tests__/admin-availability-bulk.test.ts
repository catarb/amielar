import { describe, expect, it, vi } from "vitest";
import { updateAdminAvailabilityBulk } from "../admin-availability";
import { localSlotToInstant } from "@/server/domain/reservations/datetime";
import { formatInTimeZone } from "date-fns-tz";
import { TIMEZONE } from "@/server/domain/reservations/constants";
import type { AdminAvailabilityRepository } from "@/server/repositories/admin-availability";

type Block = { id: string; startsAt: Date; endsAt: Date; reason: string | null };
function fixture(initial: Block[] = [], reservationDate?: string) {
  const blocks = [...initial];
  let nextId = 0;
  const source = {
    transaction: vi.fn(async (callback: (tx: { execute: ReturnType<typeof vi.fn> }) => Promise<unknown>) => {
      const snapshot = [...blocks];
      try { return await callback({ execute: vi.fn() }); }
      catch (error) { blocks.splice(0, blocks.length, ...snapshot); throw error; }
    }),
    findReservationsInTransaction: vi.fn(async (_tx, start: Date) => reservationDate && start.getTime() === localSlotToInstant(reservationDate, "10:00").getTime() ? [{ id: "reservation", slotStart: start, status: "CONFIRMADA", deletedAt: null }] : []),
    findOverlappingBlock: vi.fn(async (_tx, start: Date, end: Date) => blocks.find((block) => block.startsAt < end && block.endsAt > start) ?? null),
    insertBlock: vi.fn(async (_tx, start: Date, end: Date, reason: string | null) => { const block = { id: `new-${nextId++}`, startsAt: start, endsAt: end, reason }; blocks.push(block); return block; }),
    deleteBlock: vi.fn(async (_tx, id: string) => { const index = blocks.findIndex((block) => block.id === id); if (index >= 0) blocks.splice(index, 1); }),
  };
  return { blocks, source: source as unknown as AdminAvailabilityRepository, spies: source };
}

describe("updateAdminAvailabilityBulk", () => {
  it.each([0, 1, 2, 3, 4, 5, 6])("selecciona solamente el día de semana %i", async (weekday) => {
    const { blocks, source } = fixture();
    await updateAdminAvailabilityBulk({ month: "2026-11", weekday, ranges: [{ startTime: "06:00", endTime: "07:00", action: "BLOCKED" }] }, source);
    expect(blocks.length).toBeGreaterThan(0);
    expect(blocks.every((block) => {
      const local = formatInTimeZone(block.startsAt, TIMEZONE, "yyyy-MM-dd");
      return local.startsWith("2026-11") && new Date(`${local}T00:00:00Z`).getUTCDay() === weekday;
    })).toBe(true);
  });
  it("afecta únicamente los lunes del mes y la franja elegida, sin duplicar bloqueos", async () => {
    const { blocks, source, spies } = fixture();
    const input = { month: "2026-10", weekday: 1, ranges: [{ startTime: "10:00", endTime: "12:00", action: "BLOCKED" as const }] };
    expect(await updateAdminAvailabilityBulk(input, source)).toEqual({ updated: 8, reserved: 0, unchanged: 0 });
    expect(blocks).toHaveLength(8);
    expect(blocks.map((block) => block.startsAt.toISOString().slice(0, 10))).toEqual(["2026-10-05", "2026-10-05", "2026-10-12", "2026-10-12", "2026-10-19", "2026-10-19", "2026-10-26", "2026-10-26"]);
    expect(await updateAdminAvailabilityBulk(input, source)).toEqual({ updated: 0, reserved: 0, unchanged: 8 });
    expect(spies.insertBlock).toHaveBeenCalledTimes(8);
  });

  it("protege reservas y conserva las horas exteriores al habilitar varios rangos", async () => {
    const date = "2026-10-05";
    const { blocks, source } = fixture([{ id: "original", startsAt: localSlotToInstant(date, "06:00"), endsAt: localSlotToInstant(date, "14:00"), reason: "Viaje" }], date);
    const result = await updateAdminAvailabilityBulk({ month: "2026-10", weekday: 1, ranges: [
      { startTime: "09:00", endTime: "11:00", action: "AVAILABLE" },
      { startTime: "12:00", endTime: "13:00", action: "AVAILABLE" },
    ] }, source);
    expect(result.reserved).toBe(1);
    expect(blocks.some((block) => block.startsAt <= localSlotToInstant(date, "10:00") && block.endsAt >= localSlotToInstant(date, "11:00"))).toBe(true);
    expect(blocks.some((block) => block.startsAt <= localSlotToInstant(date, "06:00") && block.endsAt >= localSlotToInstant(date, "09:00"))).toBe(true);
    expect(blocks.some((block) => block.startsAt <= localSlotToInstant(date, "13:00") && block.endsAt >= localSlotToInstant(date, "14:00"))).toBe(true);
    expect(blocks.some((block) => block.startsAt <= localSlotToInstant(date, "09:00") && block.endsAt > localSlotToInstant(date, "09:00"))).toBe(false);
  });

  it("bloquea y habilita un mes sin tocar el siguiente ni horarios reservados", async () => {
    const { blocks, source } = fixture([], "2026-10-05");
    const input = { month: "2026-10", ranges: [{ startTime: "06:00", endTime: "22:00", action: "BLOCKED" as const }] };
    const blocked = await updateAdminAvailabilityBulk(input, source);
    expect(blocked).toEqual({ updated: 495, reserved: 1, unchanged: 0 });
    expect(blocks.every((block) => formatInTimeZone(block.startsAt, TIMEZONE, "yyyy-MM") === "2026-10")).toBe(true);
    const enabled = await updateAdminAvailabilityBulk({ ...input, ranges: [{ ...input.ranges[0], action: "AVAILABLE" }] }, source);
    expect(enabled).toEqual({ updated: 495, reserved: 1, unchanged: 0 });
    expect(blocks).toHaveLength(0);
  });

  it("rechaza rangos superpuestos o fuera de horario antes de escribir", async () => {
    const { source, spies } = fixture();
    await expect(updateAdminAvailabilityBulk({ month: "2026-10", ranges: [{ startTime: "05:00", endTime: "10:00", action: "BLOCKED" }] }, source)).rejects.toThrow();
    await expect(updateAdminAvailabilityBulk({ month: "2026-10", ranges: [
      { startTime: "10:00", endTime: "13:00", action: "BLOCKED" },
      { startTime: "12:00", endTime: "14:00", action: "AVAILABLE" },
    ] }, source)).rejects.toThrow();
    expect(spies.transaction).not.toHaveBeenCalled();
  });

  it("revierte la transacción completa ante un error de escritura", async () => {
    const original = { id: "original", startsAt: localSlotToInstant("2026-10-05", "10:00"), endsAt: localSlotToInstant("2026-10-05", "11:00"), reason: null };
    const { blocks, source, spies } = fixture([original]);
    spies.insertBlock.mockImplementationOnce(async () => { throw new Error("database unavailable"); });
    await expect(updateAdminAvailabilityBulk({ month: "2026-10", weekday: 1, ranges: [
      { startTime: "10:00", endTime: "11:00", action: "AVAILABLE" },
      { startTime: "11:00", endTime: "12:00", action: "BLOCKED" },
    ] }, source)).rejects.toThrow("database unavailable");
    expect(blocks).toEqual([original]);
  });
});
