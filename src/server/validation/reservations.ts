import { z } from "zod";

import { assertValidDate } from "@/server/domain/reservations/datetime";
import { EXPERIENCE_SLUGS } from "@/server/domain/reservations/experiences";

export type CreateReservationInput = z.output<typeof createReservationSchema>;

export function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/gu, " ");
}

export function normalizePhone(value: string): string {
  const trimmed = value.trim();
  const hasLeadingPlus = trimmed.startsWith("+");
  const phoneBody = hasLeadingPlus ? trimmed.slice(1) : trimmed;

  if (!/^[\d\s().-]+$/u.test(phoneBody)) {
    return "";
  }

  const digits = phoneBody.replace(/[\s().-]/gu, "");
  return `${hasLeadingPlus ? "+" : ""}${digits}`;
}

export function normalizeMessage(value: string | null | undefined): string | null {
  if (value == null) return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

const normalizedName = z
  .string()
  .transform(normalizeWhitespace)
  .pipe(z.string().min(1).max(120));

const normalizedPhone = z
  .string()
  .max(40)
  .transform(normalizePhone)
  .refine((value) => /^\+?\d{7,15}$/u.test(value), {
    message: "El teléfono debe contener entre 7 y 15 dígitos.",
  });

const normalizedLocality = z
  .string()
  .transform(normalizeWhitespace)
  .pipe(z.string().min(1).max(100));

const normalizedMessage = z
  .string()
  .transform(normalizeMessage)
  .refine((value) => value === null || value.length <= 1000, {
    message: "El mensaje no puede superar 1000 caracteres.",
  })
  .nullable()
  .optional()
  .default(null);

export const createReservationSchema = z
  .object({
    experienceSlug: z.enum(EXPERIENCE_SLUGS),
    date: z.string().refine(
      (value) => {
        try {
          assertValidDate(value);
          return true;
        } catch {
          return false;
        }
      },
      { message: "La fecha no es válida." },
    ),
    startTime: z.string(),
    fullName: normalizedName,
    phone: normalizedPhone,
    locality: normalizedLocality,
    peopleCount: z.number().int().min(1).max(2),
    message: normalizedMessage,
    website: z.string().max(100).optional(),
  })
  .strict();

export const createAdminReservationSchema = createReservationSchema
  .omit({ website: true })
  .extend({ status: z.enum(["PENDIENTE_PAGO", "CONFIRMADA"]) })
  .strict();

export type CreateAdminReservationInput = z.output<typeof createAdminReservationSchema>;
