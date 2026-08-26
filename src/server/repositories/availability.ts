import { and, gt, gte, lt } from "drizzle-orm";

import type {
  AvailabilityBlock,
  DomainReservation,
} from "@/server/domain/reservations/types";
import { availabilityBlocks, reservations } from "@/server/db/schema";

export type AvailabilityRepository = {
  findReservations: (dayStart: Date, dayEnd: Date) => Promise<DomainReservation[]>;
  findBlocks: (dayStart: Date, dayEnd: Date) => Promise<AvailabilityBlock[]>;
};

type Database = typeof import("@/server/db/client").db;

export function createAvailabilityRepository(database: Database): AvailabilityRepository {
  return {
    async findReservations(dayStart, dayEnd) {
      const rows = await database
        .select({
          experienceSlug: reservations.experienceSlug,
          slotStart: reservations.slotStart,
          status: reservations.status,
          deletedAt: reservations.deletedAt,
        })
        .from(reservations)
        .where(
          and(
            gte(reservations.slotStart, dayStart),
            lt(reservations.slotStart, dayEnd),
          ),
        );

      return rows;
    },

    async findBlocks(dayStart, dayEnd) {
      const rows = await database
        .select({
          startsAt: availabilityBlocks.startsAt,
          endsAt: availabilityBlocks.endsAt,
        })
        .from(availabilityBlocks)
        .where(
          and(
            lt(availabilityBlocks.startsAt, dayEnd),
            gt(availabilityBlocks.endsAt, dayStart),
          ),
        );

      return rows;
    },
  };
}

export async function getPostgresAvailabilityRepository(): Promise<AvailabilityRepository> {
  const { db } = await import("@/server/db/client");
  return createAvailabilityRepository(db);
}
