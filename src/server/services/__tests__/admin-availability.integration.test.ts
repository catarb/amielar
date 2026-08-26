import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Client } from "pg";

let client: Client;
let repository: Awaited<ReturnType<typeof import("@/server/repositories/admin-availability").getPostgresAdminAvailabilityRepository>>;
let createBlock: typeof import("../admin-availability").createAdminAvailabilityBlock;
let deleteBlock: typeof import("../admin-availability").deleteAdminAvailabilityBlock;
let getAdmin: typeof import("../admin-availability").getAdminAvailability;
let getPublic: typeof import("../availability").getAvailabilityForDate;

describe.runIf(Boolean(process.env.DATABASE_URL))("admin availability PostgreSQL integration", () => {
  beforeAll(async () => {
    const fs = await import("node:fs/promises");
    const line = (await fs.readFile(".env.local", "utf8")).split(/\r?\n/).find((value) => value.startsWith("DATABASE_URL="));
    client = new Client({ connectionString: line?.slice("DATABASE_URL=".length).trim() ?? process.env.DATABASE_URL });
    await client.connect();
    const { getPostgresAdminAvailabilityRepository: getRepository } = await import("@/server/repositories/admin-availability");
    repository = await getRepository();
    ({ createAdminAvailabilityBlock: createBlock, deleteAdminAvailabilityBlock: deleteBlock, getAdminAvailability: getAdmin } = await import("../admin-availability"));
    ({ getAvailabilityForDate: getPublic } = await import("../availability"));
    await client.query("delete from availability_blocks where reason = 'codex-fase10-integration'");
  });

  afterAll(async () => { await client.query("delete from availability_blocks where reason = 'codex-fase10-integration'"); await client.end(); });

  it("crea, refleja en lectura administrativa y disponibilidad pública, y elimina", async () => {
    const block = await createBlock({ date: "2026-12-15", startTime: "18:00", endTime: "20:00", reason: "codex-fase10-integration", confirmImpact: false }, repository);
    const admin = await getAdmin("2026-12-15", repository);
    expect(admin.slots.filter((slot) => slot.state === "BLOCKED").map((slot) => slot.startTime)).toEqual(["18:00", "19:00"]);
    const publicAvailability = await getPublic("2026-12-15");
    expect(publicAvailability.slots.some((slot) => slot.startTime === "18:00")).toBe(false);
    await deleteBlock(block.id, repository);
    const restored = await getPublic("2026-12-15");
    expect(restored.slots.some((slot) => slot.startTime === "18:00")).toBe(true);
  });
});
