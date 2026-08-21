import { and, asc, count, eq, gte, ilike, isNull, lt, or, sql } from "drizzle-orm";

import { EXPERIENCE_SLUG, RESERVATION_STATUSES, type ReservationStatus } from "@/server/domain/reservations/constants";
import { reservations } from "@/server/db/schema";
import type { CreateReservationTransaction, Database } from "./reservations";

export type AdminReservationFilters = {
  status?: ReservationStatus;
  dateRange?: { start: Date; end: Date };
  query?: string;
  page: number;
  pageSize: number;
};

export type AdminReservationRow = {
  id: string;
  status: ReservationStatus;
  slotStart: Date;
  fullName: string;
  phone: string;
  locality: string;
  peopleCount: number;
  message: string | null;
  createdAt: Date;
  confirmedAt: Date | null;
  cancelledAt: Date | null;
};

export type AdminReservationMutationRow = AdminReservationRow & { deletedAt: Date | null };

export type AdminReservationListResult = {
  rows: AdminReservationRow[];
  total: number;
};

function buildWhere(filters: AdminReservationFilters) {
  const conditions = [isNull(reservations.deletedAt), eq(reservations.experienceSlug, EXPERIENCE_SLUG)];
  if (filters.status) conditions.push(eq(reservations.status, filters.status));
  if (filters.dateRange) {
    conditions.push(gte(reservations.slotStart, filters.dateRange.start));
    conditions.push(lt(reservations.slotStart, filters.dateRange.end));
  }
  if (filters.query) {
    const pattern = `%${filters.query}%`;
    conditions.push(or(
      ilike(reservations.fullName, pattern),
      ilike(reservations.phone, pattern),
      ilike(reservations.locality, pattern),
    )!);
  }
  return and(...conditions);
}

const reservationSelection = {
  id: reservations.id,
  status: reservations.status,
  slotStart: reservations.slotStart,
  fullName: reservations.fullName,
  phone: reservations.phone,
  locality: reservations.locality,
  peopleCount: reservations.peopleCount,
  message: reservations.message,
  createdAt: reservations.createdAt,
  confirmedAt: reservations.confirmedAt,
  cancelledAt: reservations.cancelledAt,
};

const mutationSelection = { ...reservationSelection, deletedAt: reservations.deletedAt };

export function createAdminReservationRepository(database: Database) {
  return {
    async list(filters: AdminReservationFilters): Promise<AdminReservationListResult> {
      const where = buildWhere(filters);
      const [rows, totalRows] = await Promise.all([
        database
          .select(reservationSelection)
          .from(reservations)
          .where(where)
          .orderBy(asc(reservations.slotStart), asc(reservations.createdAt), asc(reservations.id))
          .limit(filters.pageSize)
          .offset((filters.page - 1) * filters.pageSize),
        database.select({ total: count() }).from(reservations).where(where),
      ]);

      return { rows: rows as AdminReservationRow[], total: Number(totalRows[0]?.total ?? 0) };
    },

    async findById(id: string): Promise<AdminReservationRow | null> {
      const [row] = await database
        .select(reservationSelection)
        .from(reservations)
        .where(and(eq(reservations.id, id), isNull(reservations.deletedAt), eq(reservations.experienceSlug, EXPERIENCE_SLUG)))
        .limit(1);
      return (row as AdminReservationRow | undefined) ?? null;
    },
  };
}

export type AdminReservationRepository = ReturnType<typeof createAdminReservationRepository>;

export type AdminReservationTransaction = CreateReservationTransaction;

export function createAdminReservationMutationRepository(database: Database) {
  const readMutation = async (source: Database | AdminReservationTransaction, id: string): Promise<AdminReservationMutationRow | null> => {
    const [row] = await source
      .select(mutationSelection)
      .from(reservations)
      .where(and(eq(reservations.id, id), eq(reservations.experienceSlug, EXPERIENCE_SLUG)))
      .limit(1);
    return (row as AdminReservationMutationRow | undefined) ?? null;
  };

  return {
    findMutationById(id: string) { return readMutation(database, id); },
    findMutationInTransaction(transaction: AdminReservationTransaction, id: string) { return readMutation(transaction, id); },
    transaction<T>(callback: (transaction: AdminReservationTransaction) => Promise<T>) { return database.transaction(callback); },
    async updateStatus(transaction: AdminReservationTransaction, id: string, status: ReservationStatus) {
      const values = status === "CONFIRMADA"
        ? { status, confirmedAt: sql`now()`, updatedAt: sql`now()` }
        : { status, cancelledAt: sql`now()`, updatedAt: sql`now()` };
      const [row] = await transaction.update(reservations).set(values).where(and(eq(reservations.id, id), isNull(reservations.deletedAt))).returning(mutationSelection);
      return (row as AdminReservationMutationRow | undefined) ?? null;
    },
    async softDelete(transaction: AdminReservationTransaction, id: string) {
      const [row] = await transaction.update(reservations).set({ deletedAt: sql`now()`, updatedAt: sql`now()` }).where(and(eq(reservations.id, id), isNull(reservations.deletedAt))).returning(mutationSelection);
      return (row as AdminReservationMutationRow | undefined) ?? null;
    },
  };
}

export type AdminReservationMutationRepository = ReturnType<typeof createAdminReservationMutationRepository>;

export async function getPostgresAdminReservationRepository(): Promise<AdminReservationRepository> {
  const { db } = await import("@/server/db/client");
  return createAdminReservationRepository(db);
}

export async function getPostgresAdminReservationMutationRepository(): Promise<AdminReservationMutationRepository> {
  const { db } = await import("@/server/db/client");
  return createAdminReservationMutationRepository(db);
}

export { RESERVATION_STATUSES };
