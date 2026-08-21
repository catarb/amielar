export const TIMEZONE = "America/Argentina/Buenos_Aires" as const;
export const EXPERIENCE_SLUG = "aire-de-colmena" as const;

export const SEASON_START_MONTH = 9;
export const SEASON_END_MONTH = 4;
export const OPENING_HOUR = 6;
export const CLOSING_HOUR = 22;
export const SLOT_DURATION_MINUTES = 60;
export const BOOKING_LEAD_TIME_MINUTES = 60;
export const MAX_PEOPLE = 2;

export const RESERVATION_STATUSES = [
  "PENDIENTE_PAGO",
  "CONFIRMADA",
  "CANCELADA",
] as const;

export const ACTIVE_RESERVATION_STATUSES = [
  "PENDIENTE_PAGO",
  "CONFIRMADA",
] as const;

export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];
