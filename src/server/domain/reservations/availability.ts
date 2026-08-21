import { ACTIVE_RESERVATION_STATUSES, EXPERIENCE_SLUG } from "./constants";
import { isBookingWindowOpen, getSlotEnd } from "./datetime";
import { isDateInSeason } from "./season";
import { generateSlotsForDate } from "./slots";
import type { AvailabilityBlock, AvailabilityInput, DomainReservation, ReservationSlot } from "./types";

export function isActiveReservation(reservation: DomainReservation): boolean {
  return (
    reservation.deletedAt == null &&
    ACTIVE_RESERVATION_STATUSES.includes(reservation.status as (typeof ACTIVE_RESERVATION_STATUSES)[number])
  );
}

export function rangesOverlap(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date,
): boolean {
  return startA.getTime() < endB.getTime() && endA.getTime() > startB.getTime();
}

export function isSlotBlocked(slotStart: Date, availabilityBlocks: readonly AvailabilityBlock[]): boolean {
  const slotEnd = getSlotEnd(slotStart);
  return availabilityBlocks.some((block) =>
    rangesOverlap(slotStart, slotEnd, block.startsAt, block.endsAt),
  );
}

function isSlotReserved(slot: ReservationSlot, reservations: readonly DomainReservation[]): boolean {
  return reservations.some(
    (reservation) =>
      reservation.experienceSlug === EXPERIENCE_SLUG &&
      isActiveReservation(reservation) &&
      reservation.slotStart.getTime() === slot.startsAt.getTime(),
  );
}

export function getAvailableSlots(input: AvailabilityInput): ReservationSlot[] {
  if (!isDateInSeason(input.date)) {
    generateSlotsForDate(input.date);
  }

  return generateSlotsForDate(input.date).filter(
    (slot) =>
      isBookingWindowOpen(slot.startsAt, input.now) &&
      !isSlotBlocked(slot.startsAt, input.blocks) &&
      !isSlotReserved(slot, input.reservations),
  );
}
