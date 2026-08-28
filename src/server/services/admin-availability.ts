import { acquireSlotAdvisoryLocks } from "@/server/db/advisory-lock";
import { ACTIVE_RESERVATION_STATUSES, EXPERIENCE_SLUG, TIMEZONE } from "@/server/domain/reservations/constants";
import { assertValidDate, getSlotEnd, localDateToDayRange, localSlotToInstant } from "@/server/domain/reservations/datetime";
import { generateSlotsForDate } from "@/server/domain/reservations/slots";
import { isDateInSeason } from "@/server/domain/reservations/season";
import { ReservationDomainError } from "@/server/domain/reservations/errors";
import { getPostgresAdminAvailabilityRepository, type AdminAvailabilityRepository } from "@/server/repositories/admin-availability";
import { formatInTimeZone } from "date-fns-tz";

export type AdminSlotState = "AVAILABLE" | "RESERVED" | "BLOCKED" | "RESERVED_AND_BLOCKED";
export type AdminAvailability = { date: string; timezone: typeof TIMEZONE; slots: Array<{ startTime: string; endTime: string; state: AdminSlotState; reservationId?: string; reservationStatus?: string }>; blocks: Array<{ id: string; startTime: string; endTime: string; reason: string | null }> };
export type AdminAvailabilityMonth = { month: string; timezone: typeof TIMEZONE; days: Array<{ date: string; inSeason: boolean; totalSlots: number; availableCount: number; reservedCount: number; blockedCount: number }> };

export class AdminAvailabilityError extends Error { constructor(public readonly code: "OUT_OF_SEASON" | "BLOCK_OVERLAPS_EXISTING" | "BLOCK_IMPACTS_RESERVATIONS" | "BLOCK_NOT_FOUND", message: string, public readonly impact?: { count: number; slots: string[] }) { super(message); } }

function ensureSeason(date: string) { assertValidDate(date); if (!isDateInSeason(date)) throw new AdminAvailabilityError("OUT_OF_SEASON", "Fuera de temporada."); }
function active(row: { deletedAt: Date | null; status: string }) { return !row.deletedAt && ACTIVE_RESERVATION_STATUSES.includes(row.status as never); }

export async function getAdminAvailability(date: string, repository?: AdminAvailabilityRepository): Promise<AdminAvailability> {
  ensureSeason(date); const source = repository ?? await getPostgresAdminAvailabilityRepository(); const slots = generateSlotsForDate(date); const start = slots[0].startsAt; const end = getSlotEnd(slots.at(-1)!.startsAt); const [rs, bs] = await Promise.all([source.findReservations(start, end), source.findBlocks(start, end)]);
  return { date, timezone: TIMEZONE, slots: slots.map((slot) => { const reservation = rs.find((r) => active(r) && r.slotStart.getTime() === slot.startsAt.getTime()); const blocked = bs.some((b) => b.startsAt < slot.endsAt && b.endsAt > slot.startsAt); return { startTime: slot.startTime, endTime: slot.endTime, state: reservation && blocked ? "RESERVED_AND_BLOCKED" : reservation ? "RESERVED" : blocked ? "BLOCKED" : "AVAILABLE", ...(reservation ? { reservationId: reservation.id, reservationStatus: reservation.status } : {}) }; }), blocks: bs.map((b) => ({ id: b.id, startTime: formatInTimeZone(b.startsAt, TIMEZONE, "HH:mm"), endTime: formatInTimeZone(b.endsAt, TIMEZONE, "HH:mm"), reason: b.reason })) };
}

export async function getAdminAvailabilityMonth(month: string, repository?: AdminAvailabilityRepository): Promise<AdminAvailabilityMonth> {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) throw new ReservationDomainError("INVALID_DATE", `Invalid month: ${month}`);
  const [year, monthNumber] = month.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  const firstDate = `${month}-01`;
  const nextMonth = monthNumber === 12 ? `${year + 1}-01-01` : `${year}-${String(monthNumber + 1).padStart(2, "0")}-01`;
  const { start } = localDateToDayRange(firstDate);
  const { end } = localDateToDayRange(nextMonth);
  const source = repository ?? await getPostgresAdminAvailabilityRepository();
  const [reservations, blocks] = await Promise.all([source.findReservationsForRange(start, end), source.findBlocksForRange(start, end)]);
  return { month, timezone: TIMEZONE, days: Array.from({ length: daysInMonth }, (_, index) => {
    const date = `${month}-${String(index + 1).padStart(2, "0")}`;
    if (!isDateInSeason(date)) return { date, inSeason: false, totalSlots: 0, availableCount: 0, reservedCount: 0, blockedCount: 0 };
    const slots = generateSlotsForDate(date);
    const reserved = slots.filter((slot) => reservations.some((row) => active(row) && row.slotStart.getTime() === slot.startsAt.getTime()));
    const blocked = slots.filter((slot) => blocks.some((block) => block.startsAt < slot.endsAt && block.endsAt > slot.startsAt));
    return { date, inSeason: true, totalSlots: slots.length, availableCount: slots.length - new Set([...reserved.map((slot) => slot.startTime), ...blocked.map((slot) => slot.startTime)]).size, reservedCount: reserved.length, blockedCount: blocked.length };
  }) };
}

export type BlockInput = { date: string; startTime: string; endTime: string; reason: string | null; confirmImpact: boolean };
function range(input: BlockInput) { ensureSeason(input.date); const start = localSlotToInstant(input.date, input.startTime); const end = input.endTime === "22:00" ? localSlotToInstant(input.date, "21:00") : localSlotToInstant(input.date, input.endTime); const actualEnd = input.endTime === "22:00" ? getSlotEnd(end) : end; if (actualEnd <= start) throw new ReservationDomainError("INVALID_START_TIME", "Rango inválido."); return { start, end: actualEnd }; }

export async function createAdminAvailabilityBlock(input: BlockInput, repository?: AdminAvailabilityRepository) {
  const { start, end } = range(input); const source = repository ?? await getPostgresAdminAvailabilityRepository(); const slots = generateSlotsForDate(input.date).filter((s) => s.startsAt >= start && s.startsAt < end); const reason = input.reason?.trim() || null;
  return source.transaction(async (tx) => { await acquireSlotAdvisoryLocks(tx, EXPERIENCE_SLUG, slots.map((s) => s.startsAt)); if (await source.findOverlappingBlock(tx, start, end)) throw new AdminAvailabilityError("BLOCK_OVERLAPS_EXISTING", "Ya existe un bloqueo que se superpone con ese horario."); const rs = await source.findReservationsInTransaction(tx, start, end); const impacted = rs.filter(active); if (impacted.length && !input.confirmImpact) throw new AdminAvailabilityError("BLOCK_IMPACTS_RESERVATIONS", "El bloqueo incluye horarios que ya tienen reservas.", { count: impacted.length, slots: impacted.map((r) => formatInTimeZone(r.slotStart, TIMEZONE, "HH:mm")) }); return source.insertBlock(tx, start, end, reason); });
}

export async function deleteAdminAvailabilityBlock(id: string, repository?: AdminAvailabilityRepository) { const source = repository ?? await getPostgresAdminAvailabilityRepository(); const meta = await source.findBlock(id); if (!meta) throw new AdminAvailabilityError("BLOCK_NOT_FOUND", "Bloqueo inexistente."); const slots = generateSlotsForDate(formatInTimeZone(meta.startsAt, TIMEZONE, "yyyy-MM-dd")).filter((s) => s.startsAt < meta.endsAt && getSlotEnd(s.startsAt) > meta.startsAt); return source.transaction(async (tx) => { await acquireSlotAdvisoryLocks(tx, EXPERIENCE_SLUG, slots.map((s) => s.startsAt)); if (!await source.findBlockInTransaction(tx, id)) throw new AdminAvailabilityError("BLOCK_NOT_FOUND", "Bloqueo inexistente."); await source.deleteBlock(tx, id); }); }
