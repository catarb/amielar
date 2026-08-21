import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/server/auth/admin-auth";
import {
  listAdminReservations,
  parseAdminReservationFilters,
  type AdminReservationList,
} from "@/server/services/admin-reservations";

const NO_STORE_HEADERS = { "Cache-Control": "private, no-store" };
const UNAUTHORIZED_RESPONSE = { error: { code: "UNAUTHORIZED", message: "No autorizado." } };

export async function GET(request: Request): Promise<Response> {
  return handleAdminReservationsRequest(request);
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
      INVALID_FILTER: "El filtro no es vÃ¡lido.",
      INVALID_DATE: "La fecha no es vÃ¡lida.",
      INVALID_PAGE: "La pÃ¡gina no es vÃ¡lida.",
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
