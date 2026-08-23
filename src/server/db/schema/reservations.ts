import { sql } from "drizzle-orm";
import {
  check,
  index,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const reservationStatusEnum = pgEnum("reservation_status", [
  "PENDIENTE_PAGO",
  "CONFIRMADA",
  "CANCELADA",
]);

export const reservations = pgTable(
  "reservations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    experienceSlug: varchar("experience_slug", { length: 80 }).notNull(),
    slotStart: timestamp("slot_start", { withTimezone: true, mode: "date" }).notNull(),
    fullName: varchar("full_name", { length: 120 }).notNull(),
    phone: varchar("phone", { length: 40 }).notNull(),
    locality: varchar("locality", { length: 100 }).notNull(),
    peopleCount: smallint("people_count").notNull(),
    message: text("message"),
    status: reservationStatusEnum("status").notNull().default("PENDIENTE_PAGO"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true, mode: "date" }),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true, mode: "date" }),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    check("reservations_experience_slug_check", sql`${table.experienceSlug} in ('aire-de-colmena', 'amanecer', 'aire-de-colmena-ninos')`),
    check(
      "reservations_slot_start_hour_check",
      sql`date_trunc('hour', ${table.slotStart} AT TIME ZONE 'America/Argentina/Buenos_Aires') = ${table.slotStart} AT TIME ZONE 'America/Argentina/Buenos_Aires'`,
    ),
    check("reservations_full_name_not_blank", sql`length(trim(${table.fullName})) > 0`),
    check("reservations_phone_not_blank", sql`length(trim(${table.phone})) > 0`),
    check("reservations_locality_not_blank", sql`length(trim(${table.locality})) > 0`),
    check("reservations_people_count_check", sql`${table.peopleCount} between 1 and 2`),
    index("reservations_slot_start_idx").on(table.slotStart),
    index("reservations_status_idx").on(table.status),
    index("reservations_deleted_at_idx").on(table.deletedAt),
    uniqueIndex("reservations_active_slot_unique_idx")
      .on(table.slotStart)
      .where(sql`${table.deletedAt} is null and ${table.status} in ('PENDIENTE_PAGO', 'CONFIRMADA')`),
  ],
);
