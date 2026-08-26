ALTER TABLE "reservations" DROP CONSTRAINT "reservations_experience_slug_check";--> statement-breakpoint
DROP INDEX "reservations_active_slot_unique_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "reservations_active_slot_unique_idx" ON "reservations" USING btree ("slot_start") WHERE "reservations"."deleted_at" is null and "reservations"."status" in ('PENDIENTE_PAGO', 'CONFIRMADA');--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_experience_slug_check" CHECK ("reservations"."experience_slug" in ('aire-de-colmena', 'amanecer', 'aire-de-colmena-ninos'));