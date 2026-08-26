import { describe, expect, it } from "vitest";
import { fromZonedTime } from "date-fns-tz";

import {
  EXPERIENCE_SLUG,
  getAllowedStartTimes,
  getAvailableSlots,
  getSlotEnd,
  instantToLocalSlot,
  isActiveReservation,
  isAllowedStartTime,
  isBookingWindowOpen,
  isDateInSeason,
  isSlotBlocked,
  localSlotToInstant,
  rangesOverlap,
  generateSlotsForDate,
  ReservationDomainError,
  type AvailabilityBlock,
  type DomainReservation,
} from "..";
import type { ExperienceSlug } from "../experiences";

const nowBeforeSlots = new Date("2026-12-14T00:00:00.000Z");
const instantAt = (date: string, time: string) => localSlotToInstant(date, time);
const instantAtAnyTime = (date: string, time: string) =>
  fromZonedTime(`${date} ${time}:00`, "America/Argentina/Buenos_Aires");

function reservation(
  date: string,
  time: string,
  status: string,
  deletedAt: Date | null = null,
  experienceSlug: ExperienceSlug = EXPERIENCE_SLUG,
): DomainReservation {
  return { experienceSlug, slotStart: instantAt(date, time), status, deletedAt };
}

describe("fechas y temporada", () => {
  it.each([
    ["2026-09-01", true], ["2026-12-31", true], ["2027-01-01", true], ["2027-04-30", true],
    ["2027-05-01", false], ["2027-08-31", false],
  ])("evalúa %s", (date, expected) => expect(isDateInSeason(date)).toBe(expected));

  it.each(["2026-02-30", "2026-02-29", "2026/12/15", "2026-1-01", "0000-01-01"])(
    "rechaza fecha inválida %s",
    (date) => expect(() => isDateInSeason(date)).toThrowError(ReservationDomainError),
  );

  it.each([["2026-02-28", true], ["2028-02-29", true]])("acepta %s", (date) => {
    expect(isDateInSeason(date)).toBe(true);
  });
});

describe("horarios y timezone", () => {
  it("genera exactamente los 16 horarios permitidos", () => {
    const times = getAllowedStartTimes();
    expect(times).toHaveLength(16);
    expect(times[0]).toBe("06:00");
    expect(times.at(-1)).toBe("21:00");
  });

  it.each(["06:00", "21:00"])("acepta %s", (time) => expect(isAllowedStartTime(time)).toBe(true));
  it.each(["05:00", "22:00", "18:30", "18:15", "6:00"])("rechaza %s", (time) => {
    expect(isAllowedStartTime(time)).toBe(false);
  });

  it("convierte a Argentina y vuelve al mismo slot", () => {
    const instant = localSlotToInstant("2026-12-15", "18:00");
    expect(instantToLocalSlot(instant)).toEqual({ date: "2026-12-15", startTime: "18:00" });
    expect(instant.toISOString()).toBe("2026-12-15T21:00:00.000Z");
  });

  it("rechaza convertir un horario que no es un inicio permitido", () => {
    expect(() => localSlotToInstant("2026-12-15", "18:30")).toThrowError(
      expect.objectContaining({ code: "INVALID_START_TIME" }),
    );
  });

  it("suma exactamente una hora", () => {
    expect(instantToLocalSlot(getSlotEnd(instantAt("2026-12-15", "21:00")))).toEqual({
      date: "2026-12-15", startTime: "22:00",
    });
  });
});

describe("anticipación", () => {
  const slot = instantAt("2026-12-15", "18:00");
  it.each([
    ["2026-12-15T19:59:59.000Z", true],
    ["2026-12-15T20:00:00.000Z", false],
    ["2026-12-15T20:30:00.000Z", false],
  ])("aplica la ventana con now=%s", (now, expected) => {
    expect(isBookingWindowOpen(slot, new Date(now))).toBe(expected);
  });
});

describe("reservas y bloqueos", () => {
  it.each([
    ["PENDIENTE_PAGO", null, true], ["CONFIRMADA", null, true],
    ["CANCELADA", null, false], ["PENDIENTE_PAGO", new Date(), false],
    ["CONFIRMADA", new Date(), false],
  ])("determina reserva activa %s", (status, deletedAt, expected) => {
    expect(isActiveReservation(reservation("2026-12-15", "18:00", status, deletedAt))).toBe(expected);
  });

  const start = instantAt("2026-12-15", "18:00");
  const end = getSlotEnd(start);
  it.each([
    [start, end, start, end, true],
    [start, end, instantAtAnyTime("2026-12-15", "17:30"), instantAtAnyTime("2026-12-15", "18:30"), true],
    [start, end, instantAtAnyTime("2026-12-15", "17:00"), start, false],
    [start, end, end, instantAt("2026-12-15", "20:00"), false],
  ])("detecta solapamiento", (a, b, c, d, expected) => expect(rangesOverlap(a, b, c, d)).toBe(expected));

  it("respeta solapamiento de bloqueos [inicio, fin)", () => {
    const blocks: AvailabilityBlock[] = [
      { startsAt: instantAt("2026-12-15", "18:00"), endsAt: instantAt("2026-12-15", "19:00") },
    ];
    expect(isSlotBlocked(start, blocks)).toBe(true);
    expect(isSlotBlocked(instantAtAnyTime("2026-12-15", "17:00"), blocks)).toBe(false);
    expect(isSlotBlocked(instantAt("2026-12-15", "19:00"), blocks)).toBe(false);
  });
});

describe("slots y disponibilidad", () => {
  it("genera slots con inicio y fin", () => {
    const slots = generateSlotsForDate("2026-12-15");
    expect(slots).toHaveLength(16);
    expect(slots[0]).toMatchObject({ date: "2026-12-15", startTime: "06:00", endTime: "07:00" });
    expect(slots.at(-1)).toMatchObject({ startTime: "21:00", endTime: "22:00" });
  });

  it("devuelve 16 slots sin reservas ni bloqueos", () => {
    expect(getAvailableSlots({ date: "2026-12-15", now: nowBeforeSlots, reservations: [], blocks: [] })).toHaveLength(16);
  });

  it("excluye bloqueo 06:00-10:00", () => {
    const blocks = [{ startsAt: instantAt("2026-12-15", "06:00"), endsAt: instantAt("2026-12-15", "10:00") }];
    const times = getAvailableSlots({ date: "2026-12-15", now: nowBeforeSlots, reservations: [], blocks }).map((slot) => slot.startTime);
    expect(times).not.toEqual(expect.arrayContaining(["06:00", "07:00", "08:00", "09:00"]));
    expect(times).toContain("10:00");
  });

  it.each([
    ["PENDIENTE_PAGO", null, false], ["CONFIRMADA", null, false],
    ["CANCELADA", null, true], ["PENDIENTE_PAGO", new Date(), true],
  ])("filtra reserva %s", (status, deletedAt, expected) => {
    const slots = getAvailableSlots({
      date: "2026-12-15", now: nowBeforeSlots,
      reservations: [reservation("2026-12-15", "18:00", status, deletedAt)], blocks: [],
    });
    expect(slots.some((slot) => slot.startTime === "18:00")).toBe(expected);
  });

  it("comparte el calendario entre experiencias", () => {
    const slots = getAvailableSlots({
      date: "2026-12-15", now: nowBeforeSlots,
      reservations: [reservation("2026-12-15", "18:00", "CONFIRMADA", null, "amanecer")], blocks: [],
    });
    expect(slots.some((slot) => slot.startTime === "18:00")).toBe(false);
  });

  it("aplica la anticipación y rechaza fuera de temporada", () => {
    const now = instantAt("2026-12-15", "17:00");
    const slots = getAvailableSlots({ date: "2026-12-15", now, reservations: [], blocks: [] });
    expect(slots.some((slot) => slot.startTime === "18:00")).toBe(false);
    expect(slots.some((slot) => slot.startTime === "19:00")).toBe(true);
    expect(() => getAvailableSlots({ date: "2026-05-01", now, reservations: [], blocks: [] })).toThrowError(
      expect.objectContaining({ code: "OUT_OF_SEASON" }),
    );
  });
});
