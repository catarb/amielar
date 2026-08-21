export const DOMAIN_ERROR_CODES = [
  "INVALID_DATE",
  "OUT_OF_SEASON",
  "INVALID_START_TIME",
] as const;

export type DomainErrorCode = (typeof DOMAIN_ERROR_CODES)[number];

export class ReservationDomainError extends Error {
  constructor(public readonly code: DomainErrorCode, message: string) {
    super(message);
    this.name = "ReservationDomainError";
  }
}
