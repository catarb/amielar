import { assertValidDate } from "./datetime";
import { SEASON_END_MONTH, SEASON_START_MONTH } from "./constants";

export function isDateInSeason(date: string): boolean {
  assertValidDate(date);
  const month = Number(date.slice(5, 7));
  return month >= SEASON_START_MONTH || month <= SEASON_END_MONTH;
}
