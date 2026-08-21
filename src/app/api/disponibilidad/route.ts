import { NextResponse } from "next/server";

import { ReservationDomainError } from "@/server/domain/reservations/errors";
import {
  getAvailabilityForDate,
  type PublicAvailability,
} from "@/server/services/availability";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const INVALID_DATE_RESPONSE = {
  error: {
    code: "INVALID_DATE",
    message: "La fecha no es válida.",
  },
};

export async function GET(request: Request): Promise<Response> {
  return handleAvailabilityRequest(request, getAvailabilityForDate);
}

export async function handleAvailabilityRequest(
  request: Request,
  loadAvailability: (date: string) => Promise<PublicAvailability> = getAvailabilityForDate,
): Promise<Response> {
  const date = new URL(request.url).searchParams.get("date");
  if (!date) {
    return NextResponse.json(INVALID_DATE_RESPONSE, { status: 400 });
  }

  try {
    const availability = await loadAvailability(date);
    return NextResponse.json(availability, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof ReservationDomainError) {
      if (error.code === "INVALID_DATE") {
        return NextResponse.json(INVALID_DATE_RESPONSE, { status: 400 });
      }
      if (error.code === "OUT_OF_SEASON") {
        return NextResponse.json(
          { error: { code: error.code, message: "La fecha está fuera de temporada." } },
          { status: 422 },
        );
      }
    }

    console.error("Availability lookup failed", {
      errorType: error instanceof Error ? error.name : "UnknownError",
    });
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "No se pudo consultar la disponibilidad.",
        },
      },
      { status: 500 },
    );
  }
}
