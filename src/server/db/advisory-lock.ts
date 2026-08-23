import { sql } from "drizzle-orm";

import type { CreateReservationTransaction } from "@/server/repositories/reservations";

export function createReservationLockKey(
  slotStart: Date,
): string {
  return `amielar-calendar:${slotStart.toISOString()}`;
}

export async function acquireSlotAdvisoryLock(
  transaction: CreateReservationTransaction,
  slotStartOrExperience: Date | string,
  maybeSlotStart?: Date,
): Promise<void> {
  const slotStart = maybeSlotStart ?? slotStartOrExperience;
  if (typeof slotStart === "string") throw new Error("A slot start is required.");
  const lockKey = createReservationLockKey(slotStart);
  await transaction.execute(
    sql`select pg_advisory_xact_lock(hashtextextended(${lockKey}, 0))`,
  );
}

export async function acquireSlotAdvisoryLocks(
  transaction: CreateReservationTransaction,
  slotStartsOrExperience: readonly Date[] | string,
  maybeSlotStarts?: readonly Date[],
): Promise<void> {
  const slotStarts = maybeSlotStarts ?? slotStartsOrExperience;
  if (typeof slotStarts === "string") throw new Error("Slot starts are required.");
  const ordered = [...new Map(slotStarts.map((slot) => [createReservationLockKey(slot), slot])).values()]
    .sort((a, b) => a.getTime() - b.getTime());
  for (const slotStart of ordered) await acquireSlotAdvisoryLock(transaction, slotStart);
}
