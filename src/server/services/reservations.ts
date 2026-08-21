import { isDateInSeason } from "@/server/domain/reservations/season";
import {
  EXPERIENCE_SLUG,
  TIMEZONE,
} from "@/server/domain/reservations/constants";
import {
  getSlotEnd,
  instantToLocalSlot,
  isBookingWindowOpen,
  localSlotToInstant,
} from "@/server/domain/reservations/datetime";
import { ReservationDomainError } from "@/server/domain/reservations/errors";
import { acquireSlotAdvisoryLock } from "@/server/db/advisory-lock";
import {
  getPostgresReservationWriteRepository,
  type ReservationWriteRepository,
} from "@/server/repositories/reservations";
import type { CreateReservationTransaction } from "@/server/repositories/reservations";
import {
  normalizeMessage,
  normalizePhone,
  normalizeWhitespace,
  type CreateReservationInput,
} from "@/server/validation/reservations";
import { ReservationServiceError } from "./reservation-errors";

export type PublicReservation = {
  reservationId: string;
  status: "PENDIENTE_PAGO";
  date: string;
  startTime: string;
  endTime: string;
  timezone: typeof TIMEZONE;
  message: string;
};

export type ReservationServiceOptions = {
  now?: Date;
  repository?: ReservationWriteRepository;
  transaction?: <T>(
    callback: (transaction: CreateReservationTransaction) => Promise<T>,
  ) => Promise<T>;
};

const SUCCESS_MESSAGE =
  "Recibimos tu reserva. AMIELAR se pondrá en contacto para coordinar el pago y confirmar el turno.";

export async function createReservation(
  input: CreateReservationInput,
  options: ReservationServiceOptions = {},
): Promise<PublicReservation> {
  const nowProvider = options.now ? () => options.now as Date : () => new Date();
  const now = nowProvider();
  const normalized = {
    ...input,
    fullName: normalizeWhitespace(input.fullName),
    phone: normalizePhone(input.phone),
    locality: normalizeWhitespace(input.locality),
    message: normalizeMessage(input.message ?? undefined),
  };

  if (!isDateInSeason(normalized.date)) {
    throw new ReservationDomainError("OUT_OF_SEASON", "Date is outside the season.");
  }

  const slotStart = localSlotToInstant(normalized.date, normalized.startTime);
  const slotEnd = getSlotEnd(slotStart);
  if (!isBookingWindowOpen(slotStart, now)) {
    throw new ReservationServiceError(
      "BOOKING_WINDOW_CLOSED",
      "The booking window is closed.",
    );
  }

  const repository = options.repository ?? (await getPostgresReservationWriteRepository());
  const transactionRunner = options.transaction ?? (async <T>(
    callback: (transaction: CreateReservationTransaction) => Promise<T>,
  ) => {
    return (async () => {
      const { db } = await import("@/server/db/client");
      return db.transaction(callback);
    })();
  });

  try {
    const reservationId = await transactionRunner(async (transaction) => {
      await acquireSlotAdvisoryLock(transaction, EXPERIENCE_SLUG, slotStart);

      if (!isBookingWindowOpen(slotStart, nowProvider())) {
        throw new ReservationServiceError(
          "BOOKING_WINDOW_CLOSED",
          "The booking window is closed.",
        );
      }

      if (await repository.hasBlockingAvailabilityBlock(transaction, slotStart, slotEnd)) {
        throw new ReservationServiceError(
          "SLOT_BLOCKED",
          "The selected slot is not available.",
        );
      }

      if (
        await repository.hasActiveReservationForSlot(
          transaction,
          EXPERIENCE_SLUG,
          slotStart,
        )
      ) {
        throw new ReservationServiceError(
          "SLOT_UNAVAILABLE",
          "The selected slot is not available.",
        );
      }

      try {
        const row = await repository.insertReservation(transaction, {
          experienceSlug: EXPERIENCE_SLUG,
          slotStart,
          fullName: normalized.fullName,
          phone: normalized.phone,
          locality: normalized.locality,
          peopleCount: normalized.peopleCount,
          message: normalized.message,
          status: "PENDIENTE_PAGO",
        });
        return row.id;
      } catch (error) {
        if (isActiveSlotUniqueViolation(error)) {
          throw new ReservationServiceError(
            "SLOT_UNAVAILABLE",
            "The selected slot is not available.",
          );
        }
        throw error;
      }
    });

    return {
      reservationId,
      status: "PENDIENTE_PAGO",
      date: normalized.date,
      startTime: normalized.startTime,
      endTime: instantToLocalSlot(slotEnd).startTime,
      timezone: TIMEZONE,
      message: SUCCESS_MESSAGE,
    };
  } catch (error) {
    if (isActiveSlotUniqueViolation(error)) {
      throw new ReservationServiceError(
        "SLOT_UNAVAILABLE",
        "The selected slot is not available.",
      );
    }
    throw error;
  }
}

function isActiveSlotUniqueViolation(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const candidate = error as { code?: unknown; constraint?: unknown; cause?: unknown };
  if (
    candidate.code === "23505" &&
    candidate.constraint === "reservations_active_slot_unique_idx"
  ) {
    return true;
  }
  return candidate.cause !== undefined && isActiveSlotUniqueViolation(candidate.cause);
}
