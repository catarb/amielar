import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/server/auth/admin-auth";
import { isAllowedOrigin } from "@/server/security/origin";
import { ADMIN_RESERVATION_CREATE_BODY_BYTES, readLimitedJson } from "@/server/security/request-body";
import { createAdminReservationSchema } from "@/server/validation/reservations";
import { ReservationDomainError } from "@/server/domain/reservations/errors";
import { ReservationServiceError } from "@/server/services/reservation-errors";
import {
  createAdminReservation,
  listAdminReservations,
  parseAdminReservationFilters,
  type AdminReservationList,
} from "@/server/services/admin-reservations";

const NO_STORE_HEADERS = { "Cache-Control": "private, no-store" };
const UNAUTHORIZED_RESPONSE = { error: { code: "UNAUTHORIZED", message: "No autorizado." } };

export async function GET(request: Request): Promise<Response> {
  return handleAdminReservationsRequest(request);
}

export async function POST(request: Request): Promise<Response> {
  return handleAdminReservationCreateRequest(request);
}

export async function handleAdminReservationCreateRequest(
  request: Request,
  authenticate: typeof isAdminAuthenticated = isAdminAuthenticated,
  originCheck: typeof isAllowedOrigin = isAllowedOrigin,
  create: typeof createAdminReservation = createAdminReservation,
): Promise<Response> {
  if (!(await authenticate())) return NextResponse.json(UNAUTHORIZED_RESPONSE, { status: 401, headers: NO_STORE_HEADERS });
  if (!originCheck(request)) return NextResponse.json({ error: { code: "CSRF_VALIDATION_FAILED", message: "La solicitud no es válida." } }, { status: 403, headers: NO_STORE_HEADERS });
  const bodyResult = await readLimitedJson(request, ADMIN_RESERVATION_CREATE_BODY_BYTES);
  if (!bodyResult.ok) {
    if (bodyResult.reason === "too_large") return NextResponse.json({ error: { code: "PAYLOAD_TOO_LARGE", message: "La solicitud es demasiado grande." } }, { status: 413, headers: NO_STORE_HEADERS });
    return NextResponse.json({ error: { code: "INVALID_JSON", message: "La solicitud no es válida." } }, { status: 400, headers: NO_STORE_HEADERS });
  }
  const parsed = createAdminReservationSchema.safeParse(bodyResult.value);
  if (!parsed.success) return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "La solicitud no es válida." } }, { status: 422, headers: NO_STORE_HEADERS });
  try {
    return NextResponse.json(await create(parsed.data), { status: 201, headers: NO_STORE_HEADERS });
  } catch (error) {
    if (error instanceof ReservationDomainError) return NextResponse.json({ error: { code: error.code, message: "La fecha o el horario no son válidos." } }, { status: 422, headers: NO_STORE_HEADERS });
    if (error instanceof ReservationServiceError) {
      if (error.code === "SLOT_BLOCKED" || error.code === "SLOT_UNAVAILABLE") return NextResponse.json({ error: { code: error.code, message: error.code === "SLOT_BLOCKED" ? "Ese horario está bloqueado." : "Ese horario acaba de dejar de estar disponible." } }, { status: 409, headers: NO_STORE_HEADERS });
    }
    console.error("Admin reservation creation failed", { errorType: error instanceof Error ? error.name : "UnknownError" });
    return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "No se pudo crear la reserva." } }, { status: 500, headers: NO_STORE_HEADERS });
  }
}

export async function handleAdminReservationsRequest(
  request: Request,
  authenticate: typeof isAdminAuthenticated = isAdminAuthenticated,
  list: typeof listAdminReservations = listAdminReservations,
): Promise<Response> {
  if (!(await authenticate())) return NextResponse.json(UNAUTHORIZED_RESPONSE, { status: 401, headers: NO_STORE_HEADERS });

  const parsed = parseAdminReservationFilters(new URL(request.url).searchParams);
  if ("error" in parsed) {
    const messages = {
      INVALID_FILTER: "El filtro no es válido.",
      INVALID_DATE: "La fecha no es válida.",
      INVALID_PAGE: "La página no es válida.",
    } as const;
    return NextResponse.json({ error: { code: parsed.error, message: messages[parsed.error] } }, { status: 400, headers: NO_STORE_HEADERS });
  }

  try {
    const result = await list(parsed.filters);
    return NextResponse.json(result satisfies AdminReservationList, { status: 200, headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error("Admin reservation list failed", { errorType: error instanceof Error ? error.name : "UnknownError" });
    return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "No se pudieron cargar las reservas." } }, { status: 500, headers: NO_STORE_HEADERS });
  }
}
