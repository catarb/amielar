import { instantToLocalSlot, getSlotEnd, localDateToDayRange } from "@/server/domain/reservations/datetime";
import { RESERVATION_STATUSES, TIMEZONE, type ReservationStatus } from "@/server/domain/reservations/constants";
import { ReservationDomainError } from "@/server/domain/reservations/errors";
import {
  getPostgresAdminReservationRepository,
  type AdminReservationRepository,
  type AdminReservationRow,
} from "@/server/repositories/admin-reservations";

export const ADMIN_RESERVATIONS_PAGE_SIZE = 20;

export type AdminReservationFilters = {
  status?: ReservationStatus;
  date?: string;
  query?: string;
  page: number;
};

export type AdminReservationListItem = {
  id: string;
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

export type ParsedAdminFilters = { filters: AdminReservationFilters } | { error: "INVALID_FILTER" | "INVALID_DATE" | "INVALID_PAGE" };

export function parseAdminReservationFilters(searchParams: URLSearchParams): ParsedAdminFilters {
  const rawStatus = searchParams.get("status");
  const rawDate = searchParams.get("date");
  const rawQuery = searchParams.get("q");
  const rawPage = searchParams.get("page");

  let status: ReservationStatus | undefined;
  if (rawStatus) {
    if (!RESERVATION_STATUSES.includes(rawStatus as ReservationStatus)) return { error: "INVALID_FILTER" };
    status = rawStatus as ReservationStatus;
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
  return { filters: { status, date: rawDate || undefined, query: query || undefined, page } };
}

function toListItem(row: AdminReservationRow): AdminReservationListItem {
  const slot = instantToLocalSlot(row.slotStart);
  return {
    id: row.id,
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

function toDetail(row: AdminReservationRow): AdminReservationDetail {
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
  return row ? toDetail(row) : null;
}
