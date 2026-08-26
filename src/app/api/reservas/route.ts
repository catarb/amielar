import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { ReservationDomainError } from "@/server/domain/reservations/errors";
import { getClientIp } from "@/server/security/client-ip";
import {
  reservationRateLimiter,
  type RateLimiter,
} from "@/server/security/rate-limit";
import { ReservationServiceError } from "@/server/services/reservation-errors";
import { PUBLIC_RESERVATION_BODY_BYTES, readLimitedJson } from "@/server/security/request-body";
import {
  createReservation,
  type PublicReservation,
} from "@/server/services/reservations";
import {
  createReservationSchema,
  type CreateReservationInput,
} from "@/server/validation/reservations";

const INVALID_JSON_RESPONSE = {
  error: { code: "INVALID_JSON", message: "La solicitud no es válida." },
};

const INTERNAL_ERROR_RESPONSE = {
  error: { code: "INTERNAL_ERROR", message: "No se pudo procesar la reserva." },
};

const INVALID_REQUEST_RESPONSE = {
  error: { code: "INVALID_REQUEST", message: "La solicitud no es válida." },
};

const PAYLOAD_TOO_LARGE_RESPONSE = {
  error: { code: "PAYLOAD_TOO_LARGE", message: "La solicitud es demasiado grande." },
};

const RATE_LIMITED_RESPONSE = {
  error: {
    code: "RATE_LIMITED",
    message: "Se realizaron varios intentos seguidos. Esperá unos minutos antes de volver a intentar.",
  },
};

export const MAX_RESERVATION_BODY_BYTES = PUBLIC_RESERVATION_BODY_BYTES;

export async function POST(request: Request): Promise<Response> {
  return handleReservationRequest(request, createReservation);
}

export async function handleReservationRequest(
  request: Request,
  saveReservation: (input: CreateReservationInput) => Promise<PublicReservation> = createReservation,
  limiter: RateLimiter = reservationRateLimiter,
): Promise<Response> {
  const clientIp = getClientIp(request);
  if (clientIp) {
    const rateLimit = limiter.check(clientIp);
    if (!rateLimit.allowed) {
      return NextResponse.json(RATE_LIMITED_RESPONSE, {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      });
    }
  }

  const bodyResult = await readLimitedJson(request, MAX_RESERVATION_BODY_BYTES);
  if (!bodyResult.ok) {
    if (bodyResult.reason === "too_large") return NextResponse.json(PAYLOAD_TOO_LARGE_RESPONSE, { status: 413 });
    return NextResponse.json(INVALID_JSON_RESPONSE, { status: 400 });
  }
  const body = bodyResult.value;

  const parsed = createReservationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", fields: toPublicValidationFields(parsed.error) } },
      { status: 422 },
    );
  }

  if (parsed.data.website?.trim() !== undefined && parsed.data.website.trim() !== "") {
    return NextResponse.json(INVALID_REQUEST_RESPONSE, { status: 400 });
  }

  try {
    return NextResponse.json(await saveReservation(parsed.data), { status: 201 });
  } catch (error) {
    if (error instanceof ReservationDomainError) {
      if (error.code === "OUT_OF_SEASON") {
        return NextResponse.json(
          { error: { code: error.code, message: "La fecha está fuera de temporada." } },
          { status: 422 },
        );
      }
      if (error.code === "INVALID_START_TIME") {
        return NextResponse.json(
          { error: { code: error.code, message: "La hora de inicio no es válida." } },
          { status: 422 },
        );
      }
    }

    if (error instanceof ReservationServiceError) {
      const messages: Record<ReservationServiceError["code"], string> = {
        BOOKING_WINDOW_CLOSED: "El horario ya no puede reservarse.",
        SLOT_BLOCKED: "El horario seleccionado no está disponible.",
        SLOT_UNAVAILABLE: "El horario seleccionado ya no está disponible.",
      };
      return NextResponse.json(
        { error: { code: error.code, message: messages[error.code] } },
        { status: 409 },
      );
    }

    console.error("Reservation creation failed", {
      errorType: error instanceof Error ? error.name : "UnknownError",
    });
    return NextResponse.json(INTERNAL_ERROR_RESPONSE, { status: 500 });
  }
}

function toPublicValidationFields(error: ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && fields[field] === undefined) {
      fields[field] = issue.message;
    }
  }
  return fields;
}
