import { describe, expect, it, vi } from "vitest";

import {
  AdminReservationActionError,
  cancelAdminReservation,
  confirmAdminReservation,
  deleteAdminReservation,
} from "../admin-reservation-actions";
import type { AdminReservationMutationRepository, AdminReservationMutationRow } from "@/server/repositories/admin-reservations";

const base = (status: AdminReservationMutationRow["status"]): AdminReservationMutationRow => ({
  id: "11111111-1111-4111-8111-111111111111",
  status,
  slotStart: new Date("2026-12-15T21:00:00.000Z"),
  fullName: "Ana Prueba",
  phone: "+5492304000000",
  locality: "General Pico",
  peopleCount: 2,
  message: null,
  createdAt: new Date("2026-08-21T12:00:00.000Z"),
  confirmedAt: status === "CONFIRMADA" ? new Date("2026-08-21T12:01:00.000Z") : null,
  cancelledAt: status === "CANCELADA" ? new Date("2026-08-21T12:02:00.000Z") : null,
  deletedAt: null,
});

function repository(initial: AdminReservationMutationRow): AdminReservationMutationRepository & { execute: ReturnType<typeof vi.fn> } {
  let current = initial;
  const execute = vi.fn();
  const tx = { execute } as never;
  return {
    execute,
    findMutationById: vi.fn(async () => current),
    findMutationInTransaction: vi.fn(async () => current),
    transaction: vi.fn(async (callback) => callback(tx)),
    updateStatus: vi.fn(async (_transaction, _id, status) => {
      current = { ...current, status, confirmedAt: status === "CONFIRMADA" ? new Date("2026-08-21T12:03:00.000Z") : current.confirmedAt, cancelledAt: status === "CANCELADA" ? new Date("2026-08-21T12:04:00.000Z") : current.cancelledAt };
      return current;
    }),
    softDelete: vi.fn(async () => { current = { ...current, deletedAt: new Date("2026-08-21T12:05:00.000Z") }; return current; }),
  } as AdminReservationMutationRepository & { execute: ReturnType<typeof vi.fn> };
}

describe("admin reservation actions", () => {
  it("confirma una pendiente y utiliza el advisory lock", async () => {
    const repo = repository(base("PENDIENTE_PAGO"));
    const result = await confirmAdminReservation(base("PENDIENTE_PAGO").id, repo);
    expect(result.status).toBe("CONFIRMADA");
    expect(result.confirmedAt).not.toBeNull();
    expect(repo.execute).toHaveBeenCalledTimes(1);
  });

  it("confirmar una confirmada es idempotente y rechaza una cancelada", async () => {
    const confirmed = base("CONFIRMADA");
    const repo = repository(confirmed);
    const result = await confirmAdminReservation(confirmed.id, repo);
    expect(result.confirmedAt).toBe(confirmed.confirmedAt?.toISOString());
    await expect(confirmAdminReservation(base("CANCELADA").id, repository(base("CANCELADA")))).rejects.toMatchObject({ code: "INVALID_STATUS_TRANSITION" });
  });

  it("cancela pendientes y confirmadas, conservando confirmedAt", async () => {
    const confirmed = base("CONFIRMADA");
    const result = await cancelAdminReservation(confirmed.id, repository(confirmed));
    expect(result.status).toBe("CANCELADA");
    expect(result.confirmedAt).toBe(confirmed.confirmedAt?.toISOString());
    expect(result.cancelledAt).not.toBeNull();
  });

  it("cancelar una cancelada conserva cancelledAt", async () => {
    const cancelled = base("CANCELADA");
    const result = await cancelAdminReservation(cancelled.id, repository(cancelled));
    expect(result.cancelledAt).toBe(cancelled.cancelledAt?.toISOString());
  });

  it("hace soft delete sin borrar fÃ­sicamente", async () => {
    const repo = repository(base("CONFIRMADA"));
    await expect(deleteAdminReservation(base("CONFIRMADA").id, repo)).resolves.toBeUndefined();
    expect(repo.softDelete).toHaveBeenCalledTimes(1);
    expect(repo.execute).toHaveBeenCalledTimes(1);
  });

  it("rechaza reservas inexistentes o eliminadas", async () => {
    const deleted = { ...base("PENDIENTE_PAGO"), deletedAt: new Date() };
    await expect(confirmAdminReservation(deleted.id, repository(deleted))).rejects.toBeInstanceOf(AdminReservationActionError);
  });
});
