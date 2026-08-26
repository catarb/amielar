import { and, eq, gt, isNull, lt } from "drizzle-orm";

import { ACTIVE_RESERVATION_STATUSES } from "@/server/domain/reservations/constants";
import type { ExperienceSlug } from "@/server/domain/reservations/experiences";
import { availabilityBlocks, reservations } from "@/server/db/schema";

export type Database = typeof import("@/server/db/client").db;
export type CreateReservationTransaction = Parameters<Parameters<Database["transaction"]>[0]>[0];

export type ReservationInsert = {
  experienceSlug: ExperienceSlug;
  slotStart: Date;
  fullName: string;
  phone: string;
  locality: string;
  peopleCount: number;
  message: string | null;
  status: "PENDIENTE_PAGO" | "CONFIRMADA";
  confirmedAt?: Date | null;
};

export type ReservationWriteRepository = {
  hasActiveReservationForSlot: (
    transaction: CreateReservationTransaction,
    slotStart: Date,
  ) => Promise<boolean>;
  hasBlockingAvailabilityBlock: (
    transaction: CreateReservationTransaction,
    slotStart: Date,
    slotEnd: Date,
  ) => Promise<boolean>;
  insertReservation: (
    transaction: CreateReservationTransaction,
    values: ReservationInsert,
  ) => Promise<{ id: string }>;
};

export function createReservationWriteRepository(): ReservationWriteRepository {
  return {
    async hasActiveReservationForSlot(transaction, slotStart) {
      const rows = await transaction
        .select({ id: reservations.id })
        .from(reservations)
        .where(
          and(
            eq(reservations.slotStart, slotStart),
            isNull(reservations.deletedAt),
            eq(reservations.status, ACTIVE_RESERVATION_STATUSES[0]),
          ),
        )
        .limit(1);

      if (rows.length > 0) return true;

      const confirmedRows = await transaction
        .select({ id: reservations.id })
        .from(reservations)
        .where(
          and(
            eq(reservations.slotStart, slotStart),
            isNull(reservations.deletedAt),
            eq(reservations.status, ACTIVE_RESERVATION_STATUSES[1]),
          ),
        )
        .limit(1);

      return confirmedRows.length > 0;
    },

    async hasBlockingAvailabilityBlock(transaction, slotStart, slotEnd) {
      const rows = await transaction
        .select({ id: availabilityBlocks.id })
        .from(availabilityBlocks)
        .where(
          and(
            lt(availabilityBlocks.startsAt, slotEnd),
            gt(availabilityBlocks.endsAt, slotStart),
          ),
        )
        .limit(1);

      return rows.length > 0;
    },

    async insertReservation(transaction, values) {
      const [row] = await transaction
        .insert(reservations)
        .values(values)
        .returning({ id: reservations.id });

      if (!row) throw new Error("Reservation insert did not return an id.");
      return row;
    },
  };
}

export async function getPostgresReservationWriteRepository(): Promise<ReservationWriteRepository> {
  return createReservationWriteRepository();
}
