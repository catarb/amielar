import { sql } from "drizzle-orm";

import type { CreateReservationTransaction } from "@/server/repositories/reservations";

export function createReservationLockKey(
  experienceSlug: string,
  slotStart: Date,
): string {
  return `${experienceSlug}:${slotStart.toISOString()}`;
}

export async function acquireSlotAdvisoryLock(
  transaction: CreateReservationTransaction,
  experienceSlug: string,
  slotStart: Date,
): Promise<void> {
  const lockKey = createReservationLockKey(experienceSlug, slotStart);
  await transaction.execute(
    sql`select pg_advisory_xact_lock(hashtextextended(${lockKey}, 0))`,
  );
}
