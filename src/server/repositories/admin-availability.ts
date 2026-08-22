import { and, eq, gt, gte, lt } from "drizzle-orm";
import { EXPERIENCE_SLUG } from "@/server/domain/reservations/constants";
import { availabilityBlocks, reservations } from "@/server/db/schema";
import type { CreateReservationTransaction, Database } from "./reservations";

export type AdminAvailabilityRepository = ReturnType<typeof createAdminAvailabilityRepository>;
export type AdminAvailabilityTransaction = CreateReservationTransaction;

export function createAdminAvailabilityRepository(database: Database) {
  const reservationFields = { id: reservations.id, slotStart: reservations.slotStart, status: reservations.status, deletedAt: reservations.deletedAt, experienceSlug: reservations.experienceSlug };
  const blockFields = { id: availabilityBlocks.id, startsAt: availabilityBlocks.startsAt, endsAt: availabilityBlocks.endsAt, reason: availabilityBlocks.reason };
  return {
    async findReservations(start: Date, end: Date) { return database.select(reservationFields).from(reservations).where(and(eq(reservations.experienceSlug, EXPERIENCE_SLUG), gte(reservations.slotStart, start), lt(reservations.slotStart, end))); },
    async findBlocks(start: Date, end: Date) { return database.select(blockFields).from(availabilityBlocks).where(and(lt(availabilityBlocks.startsAt, end), gt(availabilityBlocks.endsAt, start))); },
    async findBlock(id: string) { const [row] = await database.select(blockFields).from(availabilityBlocks).where(eq(availabilityBlocks.id, id)).limit(1); return row ?? null; },
    async transaction<T>(callback: (tx: AdminAvailabilityTransaction) => Promise<T>) { return database.transaction(callback); },
    async findReservationsInTransaction(tx: AdminAvailabilityTransaction, start: Date, end: Date) { return tx.select(reservationFields).from(reservations).where(and(eq(reservations.experienceSlug, EXPERIENCE_SLUG), gte(reservations.slotStart, start), lt(reservations.slotStart, end))); },
    async findOverlappingBlock(tx: AdminAvailabilityTransaction, start: Date, end: Date) { const [row] = await tx.select(blockFields).from(availabilityBlocks).where(and(lt(availabilityBlocks.startsAt, end), gt(availabilityBlocks.endsAt, start))).limit(1); return row ?? null; },
    async insertBlock(tx: AdminAvailabilityTransaction, start: Date, end: Date, reason: string | null) { const [row] = await tx.insert(availabilityBlocks).values({ startsAt: start, endsAt: end, reason }).returning(blockFields); return row; },
    async deleteBlock(tx: AdminAvailabilityTransaction, id: string) { const [row] = await tx.delete(availabilityBlocks).where(eq(availabilityBlocks.id, id)).returning(blockFields); return row ?? null; },
    async findBlockInTransaction(tx: AdminAvailabilityTransaction, id: string) { const [row] = await tx.select(blockFields).from(availabilityBlocks).where(eq(availabilityBlocks.id, id)).limit(1); return row ?? null; },
  };
}

export async function getPostgresAdminAvailabilityRepository(): Promise<AdminAvailabilityRepository> { const { db } = await import("@/server/db/client"); return createAdminAvailabilityRepository(db); }
