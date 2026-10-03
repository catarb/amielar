import { describe, expect, it, vi } from "vitest";
import { sql, type SQL } from "drizzle-orm";
import { PgDialect } from "drizzle-orm/pg-core";
import { createAdminReservationRepository } from "../admin-reservations";
import type { Database } from "../reservations";

describe("admin reservation list query", () => {
  it("ordena fecha y hora descendentes antes de paginar, también con filtros", async () => {
    const orderBy = vi.fn((...columns: SQL[]) => {
      const query = new PgDialect().sqlToQuery(sql.join(columns, sql`, `)).sql;
      expect(query).toMatch(/slot_start.*desc.*created_at.*desc.*id.*desc/i);
      return { limit: () => ({ offset: () => Promise.resolve([]) }) };
    });
    const database = {
      select: (selection: Record<string, unknown>) => ({
        from: () => ({ where: () => "slotStart" in selection ? { orderBy } : Promise.resolve([{ total: 0 }]) }),
      }),
    } as unknown as Database;
    const repository = createAdminReservationRepository(database);
    await repository.list({ page: 2, pageSize: 20 });
    await repository.list({ page: 1, pageSize: 20, query: "Ana", experienceSlug: "aire-de-colmena", status: "CONFIRMADA", dateRange: { start: new Date("2026-12-15T03:00:00Z"), end: new Date("2026-12-16T03:00:00Z") } });
    expect(orderBy).toHaveBeenCalledTimes(2);
  });
});
