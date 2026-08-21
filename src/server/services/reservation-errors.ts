export const RESERVATION_ERROR_CODES = [
  "BOOKING_WINDOW_CLOSED",
  "SLOT_BLOCKED",
  "SLOT_UNAVAILABLE",
] as const;

export type ReservationErrorCode = (typeof RESERVATION_ERROR_CODES)[number];

export class ReservationServiceError extends Error {
  constructor(
    public readonly code: ReservationErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "ReservationServiceError";
  }
}
