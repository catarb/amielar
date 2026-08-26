import { formatInTimeZone } from "date-fns-tz";

import { CLOSING_HOUR, OPENING_HOUR, SLOT_DURATION_MINUTES, TIMEZONE } from "./constants";
import { ReservationDomainError } from "./errors";
import {
  assertValidDate,
  assertValidStartTime,
  getSlotEnd,
  localSlotToInstant,
  isAllowedStartTime,
} from "./datetime";
import { isDateInSeason } from "./season";
import type { ReservationSlot } from "./types";

export function getAllowedStartTimes(): string[] {
  return Array.from(
    { length: (CLOSING_HOUR - OPENING_HOUR) * (60 / SLOT_DURATION_MINUTES) },
    (_, index) => {
      const hour = OPENING_HOUR + index * (SLOT_DURATION_MINUTES / 60);
      return `${String(hour).padStart(2, "0")}:00`;
    },
  );
}

export function generateSlotsForDate(date: string): ReservationSlot[] {
  assertValidDate(date);
  if (!isDateInSeason(date)) {
    throw new ReservationDomainError("OUT_OF_SEASON", `Date is outside the season: ${date}`);
  }

  return getAllowedStartTimes().map((startTime) => {
    const startsAt = localSlotToInstant(date, startTime);
    const endsAt = getSlotEnd(startsAt);
    return {
      date,
      startTime,
      endTime: formatInTimeZone(endsAt, TIMEZONE, "HH:mm"),
      startsAt,
      endsAt,
    };
  });
}

export function assertAllowedStartTime(startTime: string): void {
  assertValidStartTime(startTime);
  if (!isAllowedStartTime(startTime)) {
    throw new ReservationDomainError("INVALID_START_TIME", `Start time is not allowed: ${startTime}`);
  }
}
