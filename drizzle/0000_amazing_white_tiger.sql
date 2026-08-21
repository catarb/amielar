CREATE TYPE "public"."reservation_status" AS ENUM('PENDIENTE_PAGO', 'CONFIRMADA', 'CANCELADA');--> statement-breakpoint
CREATE TABLE "availability_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"reason" varchar(200),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "availability_blocks_ends_after_starts" CHECK ("availability_blocks"."ends_at" > "availability_blocks"."starts_at")
);
--> statement-breakpoint
CREATE TABLE "reservations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"experience_slug" varchar(80) NOT NULL,
	"slot_start" timestamp with time zone NOT NULL,
	"full_name" varchar(120) NOT NULL,
	"phone" varchar(40) NOT NULL,
	"locality" varchar(100) NOT NULL,
	"people_count" smallint NOT NULL,
	"message" text,
	"status" "reservation_status" DEFAULT 'PENDIENTE_PAGO' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"confirmed_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "reservations_experience_slug_check" CHECK ("reservations"."experience_slug" = 'aire-de-colmena'),
	CONSTRAINT "reservations_slot_start_hour_check" CHECK (date_trunc('hour', "reservations"."slot_start" AT TIME ZONE 'America/Argentina/Buenos_Aires') = "reservations"."slot_start" AT TIME ZONE 'America/Argentina/Buenos_Aires'),
	CONSTRAINT "reservations_full_name_not_blank" CHECK (length(trim("reservations"."full_name")) > 0),
	CONSTRAINT "reservations_phone_not_blank" CHECK (length(trim("reservations"."phone")) > 0),
	CONSTRAINT "reservations_locality_not_blank" CHECK (length(trim("reservations"."locality")) > 0),
	CONSTRAINT "reservations_people_count_check" CHECK ("reservations"."people_count" between 1 and 2)
);
--> statement-breakpoint
CREATE INDEX "availability_blocks_starts_at_idx" ON "availability_blocks" USING btree ("starts_at");--> statement-breakpoint
CREATE INDEX "availability_blocks_ends_at_idx" ON "availability_blocks" USING btree ("ends_at");--> statement-breakpoint
CREATE INDEX "reservations_slot_start_idx" ON "reservations" USING btree ("slot_start");--> statement-breakpoint
CREATE INDEX "reservations_status_idx" ON "reservations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "reservations_deleted_at_idx" ON "reservations" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "reservations_active_slot_unique_idx" ON "reservations" USING btree ("experience_slug","slot_start") WHERE "reservations"."deleted_at" is null and "reservations"."status" in ('PENDIENTE_PAGO', 'CONFIRMADA');