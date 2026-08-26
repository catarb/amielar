import { TIMEZONE } from "@/server/domain/reservations/constants";
import {
  localDateToDayRange,
  assertValidDate,
} from "@/server/domain/reservations/datetime";
import { ReservationDomainError } from "@/server/domain/reservations/errors";
import { isDateInSeason } from "@/server/domain/reservations/season";
import { getAvailableSlots } from "@/server/domain/reservations/availability";
import type { ReservationSlot } from "@/server/domain/reservations/types";
import {
  getPostgresAvailabilityRepository,
  type AvailabilityRepository,
} from "@/server/repositories/availability";

export type PublicAvailability = {
  date: string;
  timezone: typeof TIMEZONE;
  slots: Array<Pick<ReservationSlot, "startTime" | "endTime">>;
};

export async function getAvailabilityForDate(
  date: string,
  now = new Date(),
  repository?: AvailabilityRepository,
): Promise<PublicAvailability> {
  assertValidDate(date);
  if (!isDateInSeason(date)) {
    throw new ReservationDomainError("OUT_OF_SEASON", `Date is outside the season: ${date}`);
  }

  const dayRange = localDateToDayRange(date);
  const dataSource = repository ?? (await getPostgresAvailabilityRepository());
  const [reservations, blocks] = await Promise.all([
    dataSource.findReservations(dayRange.start, dayRange.end),
    dataSource.findBlocks(dayRange.start, dayRange.end),
  ]);

  const slots = getAvailableSlots({ date, now, reservations, blocks });
  return {
    date,
    timezone: TIMEZONE,
    slots: slots.map(({ startTime, endTime }) => ({ startTime, endTime })),
  };
}
