import { describe, expect, it } from "vitest";

import {
  createReservationSchema,
  normalizeMessage,
  normalizePhone,
  normalizeWhitespace,
} from "../reservations";

describe("normalización de reservas", () => {
  it("normaliza nombres y localidades conservando Unicode", () => {
    expect(normalizeWhitespace("  María   Pérez ")).toBe("María Pérez");
    expect(normalizeWhitespace("  General   Pico ")).toBe("General Pico");
    expect(normalizeWhitespace("Gral. Pico")).toBe("Gral. Pico");
    expect(normalizeWhitespace("25 de Mayo")).toBe("25 de Mayo");
  });

  it("normaliza teléfonos sin inventar código de país", () => {
    expect(normalizePhone("+54 9 (2302) 123-456")).toBe("+5492302123456");
    expect(normalizePhone("2302.123456")).toBe("2302123456");
  });

  it("recorta mensajes y convierte whitespace vacío a null", () => {
    expect(normalizeMessage("  Mensaje opcional  ")).toBe("Mensaje opcional");
    expect(normalizeMessage("   ")).toBeNull();
    expect(normalizeMessage(undefined)).toBeNull();
  });
});

describe("schema de creación de reservas", () => {
  const valid = {
    experienceSlug: "aire-de-colmena",
    date: "2026-12-15",
    startTime: "18:00",
    fullName: "  María   Pérez ",
    phone: "+54 9 (2302) 123-456",
    locality: "  General   Pico ",
    peopleCount: 2,
    message: "  Hola  ",
  };

  it("devuelve datos normalizados", () => {
    expect(createReservationSchema.parse(valid)).toMatchObject({
      fullName: "María Pérez",
      phone: "+5492302123456",
      locality: "General Pico",
      peopleCount: 2,
      message: "Hola",
    });
  });

  it.each([
    ["fullName", ""],
    ["phone", "123"],
    ["phone", "1234567890123456"],
    ["locality", ""],
    ["peopleCount", 0],
    ["peopleCount", 3],
    ["peopleCount", 1.5],
  ])("rechaza %s=%s", (field, value) => {
    const result = createReservationSchema.safeParse({ ...valid, [field]: value });
    expect(result.success).toBe(false);
  });

  it("rechaza nombre, localidad y mensaje demasiado largos", () => {
    expect(createReservationSchema.safeParse({ ...valid, fullName: "a".repeat(121) }).success).toBe(false);
    expect(createReservationSchema.safeParse({ ...valid, locality: "a".repeat(101) }).success).toBe(false);
    expect(createReservationSchema.safeParse({ ...valid, message: "a".repeat(1001) }).success).toBe(false);
  });

  it("rechaza fecha inválida y campos administrativos arbitrarios", () => {
    expect(createReservationSchema.safeParse({ ...valid, date: "2026-02-30" }).success).toBe(false);
    expect(createReservationSchema.safeParse({ ...valid, status: "CONFIRMADA" }).success).toBe(false);
    expect(createReservationSchema.safeParse({ ...valid, experience_slug: "otra" }).success).toBe(false);
  });

  it.each(["aire-de-colmena", "amanecer", "aire-de-colmena-ninos"])("acepta la experiencia %s", (experienceSlug) => {
    expect(createReservationSchema.safeParse({ ...valid, experienceSlug }).success).toBe(true);
  });

  it.each(["", "otra", "aire", "<script>"])("rechaza experienceSlug inválido %s", (experienceSlug) => {
    expect(createReservationSchema.safeParse({ ...valid, experienceSlug }).success).toBe(false);
  });
});
