import type { ReservationStatus } from "./constants";

export type LocalSlot = {
  date: string;
  startTime: string;
};

export type ReservationSlot = LocalSlot & {
  endTime: string;
  startsAt: Date;
  endsAt: Date;
};

export type AvailabilityBlock = {
  startsAt: Date;
  endsAt: Date;
};

export type DomainReservation = {
  experienceSlug: string;
  slotStart: Date;
  status: ReservationStatus | string;
  deletedAt: Date | null;
};

export type AvailabilityInput = {
  date: string;
  now: Date;
  reservations: readonly DomainReservation[];
  blocks: readonly AvailabilityBlock[];
};
