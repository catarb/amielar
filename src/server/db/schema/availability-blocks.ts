import { sql } from "drizzle-orm";
import { check, index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const availabilityBlocks = pgTable(
  "availability_blocks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    startsAt: timestamp("starts_at", { withTimezone: true, mode: "date" }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true, mode: "date" }).notNull(),
    reason: varchar("reason", { length: 200 }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    check("availability_blocks_ends_after_starts", sql`${table.endsAt} > ${table.startsAt}`),
    index("availability_blocks_starts_at_idx").on(table.startsAt),
    index("availability_blocks_ends_at_idx").on(table.endsAt),
  ],
);
