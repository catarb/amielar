import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Client } from "pg";

import { createReservation } from "../reservations";
import { createAdminReservation } from "../admin-reservations";

const integrationLocality = "codex-multi-experience-integration";

describe.runIf(Boolean(process.env.DATABASE_URL))("reservas multi-experiencia PostgreSQL", () => {
  let client: Client;

  beforeAll(async () => {
    const fs = await import("node:fs/promises");
    const line = (await fs.readFile(".env.local", "utf8")).split(/\r?\n/).find((value) => value.startsWith("DATABASE_URL="));
    client = new Client({ connectionString: line?.slice("DATABASE_URL=".length).trim() ?? process.env.DATABASE_URL });
    await client.connect();
    await client.query("delete from reservations where locality = $1", [integrationLocality]);
  });

  afterAll(async () => {
    await client.query("delete from reservations where locality = $1", [integrationLocality]);
    await client.end();
  });

  it("permite una sola reserva activa cuando dos experiencias compiten por el mismo slot", async () => {
    const base = {
      date: "2026-12-15",
      startTime: "20:00",
      phone: "+5492302123456",
      locality: integrationLocality,
      peopleCount: 2,
      message: null,
    } as const;
    const results = await Promise.allSettled([
      createReservation({ ...base, experienceSlug: "aire-de-colmena", fullName: "Codex Aire" }, { now: new Date("2026-12-15T19:59:59.000Z") }),
      createReservation({ ...base, experienceSlug: "amanecer", fullName: "Codex Amanecer" }, { now: new Date("2026-12-15T19:59:59.000Z") }),
    ]);

    expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    expect(results.filter((result) => result.status === "rejected").map((result) => (result as PromiseRejectedResult).reason.code)).toEqual(["SLOT_UNAVAILABLE"]);
    const count = await client.query("select count(*)::int as count from reservations where locality = $1 and slot_start = $2 and deleted_at is null and status in ('PENDIENTE_PAGO', 'CONFIRMADA')", [integrationLocality, "2026-12-15T23:00:00.000Z"]);
    expect(count.rows[0].count).toBe(1);
  });

  it("coordina reserva pública y manual con el mismo lock global", async () => {
    const base = {
      date: "2026-12-16",
      startTime: "20:00",
      phone: "+5492302123456",
      locality: integrationLocality,
      peopleCount: 1,
      message: null,
    } as const;
    const results = await Promise.allSettled([
      createReservation({ ...base, experienceSlug: "aire-de-colmena", fullName: "Codex Pública" }, { now: new Date("2026-12-16T21:59:59.000Z") }),
      createAdminReservation({ ...base, experienceSlug: "amanecer", fullName: "Codex Manual", status: "CONFIRMADA" }),
    ]);

    expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    expect(results.filter((result) => result.status === "rejected").map((result) => (result as PromiseRejectedResult).reason.code)).toEqual(["SLOT_UNAVAILABLE"]);
    const count = await client.query("select count(*)::int as count from reservations where locality = $1 and slot_start = $2 and deleted_at is null and status in ('PENDIENTE_PAGO', 'CONFIRMADA')", [integrationLocality, "2026-12-16T23:00:00.000Z"]);
    expect(count.rows[0].count).toBe(1);
  });
});
