import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { ReservationDomainError } from "@/server/domain/reservations/errors";
import { ReservationServiceError } from "@/server/services/reservation-errors";
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

export async function POST(request: Request): Promise<Response> {
  return handleReservationRequest(request, createReservation);
}

export async function handleReservationRequest(
  request: Request,
  saveReservation: (input: CreateReservationInput) => Promise<PublicReservation> = createReservation,
): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(INVALID_JSON_RESPONSE, { status: 400 });
  }

  const parsed = createReservationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", fields: toPublicValidationFields(parsed.error) } },
      { status: 422 },
    );
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
