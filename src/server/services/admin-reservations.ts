import { instantToLocalSlot, getSlotEnd, localDateToDayRange, localSlotToInstant } from "@/server/domain/reservations/datetime";
import { isDateInSeason } from "@/server/domain/reservations/season";
import { RESERVATION_STATUSES, TIMEZONE, type ReservationStatus } from "@/server/domain/reservations/constants";
import { isExperienceSlug, type ExperienceSlug } from "@/server/domain/reservations/experiences";
import { ReservationDomainError } from "@/server/domain/reservations/errors";
import {
  getPostgresAdminReservationRepository,
  getPostgresAdminReservationDashboardRepository,
  type AdminReservationDashboardRepository,
  type AdminReservationDashboardResult,
  type AdminReservationRepository,
  type AdminReservationRow,
} from "@/server/repositories/admin-reservations";
import { acquireSlotAdvisoryLock } from "@/server/db/advisory-lock";
import { isActiveSlotUniqueViolation } from "./reservations";
import { ReservationServiceError } from "./reservation-errors";
import {
  getPostgresReservationWriteRepository,
  type ReservationWriteRepository,
} from "@/server/repositories/reservations";
import {
  normalizeMessage,
  normalizePhone,
  normalizeWhitespace,
  type CreateAdminReservationInput,
} from "@/server/validation/reservations";

export const ADMIN_RESERVATIONS_PAGE_SIZE = 20;

export type AdminReservationFilters = {
  experienceSlug?: ExperienceSlug;
  status?: ReservationStatus;
  date?: string;
  query?: string;
  page: number;
};

export type AdminReservationListItem = {
  id: string;
  experienceSlug: ExperienceSlug;
  status: ReservationStatus;
  date: string;
  startTime: string;
  endTime: string;
  fullName: string;
  phone: string;
  locality: string;
  peopleCount: number;
};

export type AdminReservationDetail = AdminReservationListItem & {
  message: string | null;
  createdAt: string;
  confirmedAt: string | null;
  cancelledAt: string | null;
};

export type AdminReservationList = {
  items: AdminReservationListItem[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
  timezone: typeof TIMEZONE;
};

export type AdminReservationDashboard = {
  pendingCount: number;
  confirmedCount: number;
  upcomingCount: number;
  upcoming: AdminReservationListItem[];
};

export type ParsedAdminFilters = { filters: AdminReservationFilters } | { error: "INVALID_FILTER" | "INVALID_DATE" | "INVALID_PAGE" };

export type AdminReservationCreateOptions = {
  now?: Date;
  repository?: ReservationWriteRepository;
  transaction?: <T>(callback: (transaction: import("@/server/repositories/reservations").CreateReservationTransaction) => Promise<T>) => Promise<T>;
};

export async function createAdminReservation(
  input: CreateAdminReservationInput,
  options: AdminReservationCreateOptions = {},
): Promise<{ reservationId: string; status: "PENDIENTE_PAGO" | "CONFIRMADA" }> {
  if (!isDateInSeason(input.date)) {
    throw new ReservationDomainError("OUT_OF_SEASON", "La fecha está fuera de temporada.");
  }

  const normalized = {
    ...input,
    fullName: normalizeWhitespace(input.fullName),
    phone: normalizePhone(input.phone),
    locality: normalizeWhitespace(input.locality),
    message: normalizeMessage(input.message ?? undefined),
  };
  const slotStart = localSlotToInstant(normalized.date, normalized.startTime);
  const slotEnd = getSlotEnd(slotStart);
  const now = options.now ?? new Date();
  const repository = options.repository ?? (await getPostgresReservationWriteRepository());
  const transactionRunner = options.transaction ?? (async <T>(callback: (transaction: import("@/server/repositories/reservations").CreateReservationTransaction) => Promise<T>) => {
    const { db } = await import("@/server/db/client");
    return db.transaction(callback);
  });

  try {
    const reservationId = await transactionRunner(async (transaction) => {
      await acquireSlotAdvisoryLock(transaction, slotStart);
      if (await repository.hasBlockingAvailabilityBlock(transaction, slotStart, slotEnd)) {
        throw new ReservationServiceError("SLOT_BLOCKED", "Ese horario está bloqueado.");
      }
      if (await repository.hasActiveReservationForSlot(transaction, slotStart)) {
        throw new ReservationServiceError("SLOT_UNAVAILABLE", "Ese horario ya no está disponible.");
      }
      try {
        const row = await repository.insertReservation(transaction, {
          experienceSlug: normalized.experienceSlug,
          slotStart,
          fullName: normalized.fullName,
          phone: normalized.phone,
          locality: normalized.locality,
          peopleCount: normalized.peopleCount,
          message: normalized.message,
          status: normalized.status,
          confirmedAt: normalized.status === "CONFIRMADA" ? now : null,
        });
        return row.id;
      } catch (error) {
        if (isActiveSlotUniqueViolation(error)) {
          throw new ReservationServiceError("SLOT_UNAVAILABLE", "Ese horario ya no está disponible.");
        }
        throw error;
      }
    });
    return { reservationId, status: normalized.status };
  } catch (error) {
    if (isActiveSlotUniqueViolation(error)) {
      throw new ReservationServiceError("SLOT_UNAVAILABLE", "Ese horario ya no está disponible.");
    }
    throw error;
  }
}

export function parseAdminReservationFilters(searchParams: URLSearchParams): ParsedAdminFilters {
  const rawStatus = searchParams.get("status");
  const rawExperience = searchParams.get("experience");
  const rawDate = searchParams.get("date");
  const rawQuery = searchParams.get("q");
  const rawPage = searchParams.get("page");

  let status: ReservationStatus | undefined;
  if (rawStatus) {
    if (!RESERVATION_STATUSES.includes(rawStatus as ReservationStatus)) return { error: "INVALID_FILTER" };
    status = rawStatus as ReservationStatus;
  }

  let experienceSlug: ExperienceSlug | undefined;
  if (rawExperience) {
    if (!isExperienceSlug(rawExperience)) return { error: "INVALID_FILTER" };
    experienceSlug = rawExperience;
  }

  if (rawDate !== null) {
    try {
      localDateToDayRange(rawDate);
    } catch (error) {
      if (error instanceof ReservationDomainError && error.code === "INVALID_DATE") return { error: "INVALID_DATE" };
      return { error: "INVALID_DATE" };
    }
  }

  let page = 1;
  if (rawPage !== null && !/^\d+$/.test(rawPage)) return { error: "INVALID_PAGE" };
  if (rawPage !== null) {
    page = Number(rawPage);
    if (!Number.isSafeInteger(page) || page < 1) return { error: "INVALID_PAGE" };
  }

  const query = rawQuery?.trim();
  if (query && query.length > 100) return { error: "INVALID_FILTER" };
  return { filters: { experienceSlug, status, date: rawDate || undefined, query: query || undefined, page } };
}

function toListItem(row: AdminReservationRow): AdminReservationListItem {
  const slot = instantToLocalSlot(row.slotStart);
  return {
    id: row.id,
    experienceSlug: row.experienceSlug,
    status: row.status,
    date: slot.date,
    startTime: slot.startTime,
    endTime: instantToLocalSlot(getSlotEnd(row.slotStart)).startTime,
    fullName: row.fullName,
    phone: row.phone,
    locality: row.locality,
    peopleCount: row.peopleCount,
  };
}

export function adminReservationDashboardFromResult(result: AdminReservationDashboardResult): AdminReservationDashboard {
  return {
    pendingCount: result.counts.PENDIENTE_PAGO,
    confirmedCount: result.counts.CONFIRMADA,
    upcomingCount: result.upcomingCount,
    upcoming: result.rows.map(toListItem),
  };
}

export async function getAdminReservationDashboard(
  repository?: AdminReservationDashboardRepository,
  now = new Date(),
): Promise<AdminReservationDashboard> {
  const dataSource = repository ?? (await getPostgresAdminReservationDashboardRepository());
  return adminReservationDashboardFromResult(await dataSource.getSummary(now));
}

export function adminReservationRowToDetail(row: AdminReservationRow): AdminReservationDetail {
  return {
    ...toListItem(row),
    message: row.message,
    createdAt: row.createdAt.toISOString(),
    confirmedAt: row.confirmedAt?.toISOString() ?? null,
    cancelledAt: row.cancelledAt?.toISOString() ?? null,
  };
}

export async function listAdminReservations(
  filters: AdminReservationFilters,
  repository?: AdminReservationRepository,
): Promise<AdminReservationList> {
  const dataSource = repository ?? (await getPostgresAdminReservationRepository());
  const result = await dataSource.list({
    experienceSlug: filters.experienceSlug,
    status: filters.status,
    dateRange: filters.date ? localDateToDayRange(filters.date) : undefined,
    query: filters.query,
    page: filters.page,
    pageSize: ADMIN_RESERVATIONS_PAGE_SIZE,
  });
  return {
    items: result.rows.map(toListItem),
    pagination: {
      page: filters.page,
      pageSize: ADMIN_RESERVATIONS_PAGE_SIZE,
      total: result.total,
      totalPages: Math.ceil(result.total / ADMIN_RESERVATIONS_PAGE_SIZE),
    },
    timezone: TIMEZONE,
  };
}

export async function getAdminReservationById(
  id: string,
  repository?: AdminReservationRepository,
): Promise<AdminReservationDetail | null> {
  const dataSource = repository ?? (await getPostgresAdminReservationRepository());
  const row = await dataSource.findById(id);
  return row ? adminReservationRowToDetail(row) : null;
}
