import { acquireSlotAdvisoryLock } from "@/server/db/advisory-lock";
import { EXPERIENCE_SLUG, type ReservationStatus } from "@/server/domain/reservations/constants";
import {
  getPostgresAdminReservationMutationRepository,
  type AdminReservationMutationRepository,
  type AdminReservationMutationRow,
} from "@/server/repositories/admin-reservations";
import { adminReservationRowToDetail, type AdminReservationDetail } from "./admin-reservations";

export class AdminReservationActionError extends Error {
  constructor(public readonly code: "RESERVATION_NOT_FOUND" | "INVALID_STATUS_TRANSITION", message: string) {
    super(message);
    this.name = "AdminReservationActionError";
  }
}

function assertCurrent(row: AdminReservationMutationRow | null): AdminReservationMutationRow {
  if (!row || row.deletedAt) throw new AdminReservationActionError("RESERVATION_NOT_FOUND", "Reservation not found.");
  return row;
}

async function mutateReservation(
  id: string,
  action: "confirm" | "cancel" | "delete",
  repository?: AdminReservationMutationRepository,
): Promise<AdminReservationDetail> {
  const dataSource = repository ?? (await getPostgresAdminReservationMutationRepository());
  const metadata = assertCurrent(await dataSource.findMutationById(id));
  return dataSource.transaction(async (transaction) => {
    await acquireSlotAdvisoryLock(transaction, EXPERIENCE_SLUG, metadata.slotStart);
    const current = assertCurrent(await dataSource.findMutationInTransaction(transaction, id));

    if (action === "delete") {
      const deleted = await dataSource.softDelete(transaction, id);
      if (!deleted) throw new AdminReservationActionError("RESERVATION_NOT_FOUND", "Reservation not found.");
      return adminReservationRowToDetail(deleted);
    }

    if (action === "confirm") {
      if (current.status === "CANCELADA") {
        throw new AdminReservationActionError("INVALID_STATUS_TRANSITION", "La reserva cancelada no puede volver a confirmarse.");
      }
      if (current.status === "CONFIRMADA") return adminReservationRowToDetail(current);
      const confirmed = await dataSource.updateStatus(transaction, id, "CONFIRMADA");
      if (!confirmed) throw new AdminReservationActionError("RESERVATION_NOT_FOUND", "Reservation not found.");
      return adminReservationRowToDetail(confirmed);
    }

    if (current.status === "CANCELADA") return adminReservationRowToDetail(current);
    const cancelled = await dataSource.updateStatus(transaction, id, "CANCELADA");
    if (!cancelled) throw new AdminReservationActionError("RESERVATION_NOT_FOUND", "Reservation not found.");
    return adminReservationRowToDetail(cancelled);
  });
}

export function confirmAdminReservation(id: string, repository?: AdminReservationMutationRepository) {
  return mutateReservation(id, "confirm", repository);
}

export function cancelAdminReservation(id: string, repository?: AdminReservationMutationRepository) {
  return mutateReservation(id, "cancel", repository);
}

export async function deleteAdminReservation(id: string, repository?: AdminReservationMutationRepository): Promise<void> {
  await mutateReservation(id, "delete", repository);
}

export type { ReservationStatus };
