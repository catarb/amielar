import { addMinutes, subMinutes } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

import {
  BOOKING_LEAD_TIME_MINUTES,
  CLOSING_HOUR,
  OPENING_HOUR,
  SLOT_DURATION_MINUTES,
  TIMEZONE,
} from "./constants";
import { ReservationDomainError } from "./errors";
import type { LocalSlot } from "./types";

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_PATTERN = /^(\d{2}):(\d{2})$/;

export function assertValidDate(date: string): void {
  const match = DATE_PATTERN.exec(date);
  if (!match) {
    throw new ReservationDomainError("INVALID_DATE", `Invalid date: ${date}`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  if (year < 1 || month < 1 || month > 12 || day < 1 || day > daysInMonth) {
    throw new ReservationDomainError("INVALID_DATE", `Invalid date: ${date}`);
  }
}

export function assertValidStartTime(startTime: string): void {
  if (!TIME_PATTERN.test(startTime)) {
    throw new ReservationDomainError(
      "INVALID_START_TIME",
      `Invalid start time: ${startTime}`,
    );
  }
}

export function isAllowedStartTime(startTime: string): boolean {
  if (!TIME_PATTERN.test(startTime)) return false;
  const [hour, minute] = startTime.split(":").map(Number);
  return minute === 0 && hour >= OPENING_HOUR && hour < CLOSING_HOUR;
}

export function localSlotToInstant(date: string, startTime: string): Date {
  assertValidDate(date);
  assertValidStartTime(startTime);
  if (!isAllowedStartTime(startTime)) {
    throw new ReservationDomainError("INVALID_START_TIME", `Start time is not allowed: ${startTime}`);
  }

  const instant = fromZonedTime(`${date} ${startTime}:00`, TIMEZONE);
  if (Number.isNaN(instant.getTime())) {
    throw new ReservationDomainError("INVALID_DATE", `Invalid local slot: ${date} ${startTime}`);
  }
  return instant;
}

export function localDateToDayRange(date: string): { start: Date; end: Date } {
  assertValidDate(date);
  const [year, month, day] = date.split("-").map(Number);
  const nextDate = new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10);

  return {
    start: fromZonedTime(`${date} 00:00:00`, TIMEZONE),
    end: fromZonedTime(`${nextDate} 00:00:00`, TIMEZONE),
  };
}

export function instantToLocalSlot(instant: Date): LocalSlot {
  if (!(instant instanceof Date) || Number.isNaN(instant.getTime())) {
    throw new ReservationDomainError("INVALID_DATE", "Invalid instant");
  }

  return {
    date: formatInTimeZone(instant, TIMEZONE, "yyyy-MM-dd"),
    startTime: formatInTimeZone(instant, TIMEZONE, "HH:mm"),
  };
}

export function getSlotEnd(slotStart: Date): Date {
  return addMinutes(slotStart, SLOT_DURATION_MINUTES);
}

export function isBookingWindowOpen(slotStart: Date, now: Date): boolean {
  return now.getTime() < subMinutes(slotStart, BOOKING_LEAD_TIME_MINUTES).getTime();
}
