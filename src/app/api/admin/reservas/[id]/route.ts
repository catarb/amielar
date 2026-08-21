import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/server/auth/admin-auth";
import { getAdminReservationById } from "@/server/services/admin-reservations";

const NO_STORE_HEADERS = { "Cache-Control": "private, no-store" };
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  const { id } = await params;
  return handleAdminReservationDetailRequest(request, id);
}

export async function handleAdminReservationDetailRequest(
  _request: Request,
  id: string,
  authenticate: typeof isAdminAuthenticated = isAdminAuthenticated,
  findById: typeof getAdminReservationById = getAdminReservationById,
): Promise<Response> {
  if (!(await authenticate())) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "No autorizado." } }, { status: 401, headers: NO_STORE_HEADERS });
  if (!UUID_PATTERN.test(id)) return NextResponse.json({ error: { code: "INVALID_RESERVATION_ID", message: "El identificador no es vÃ¡lido." } }, { status: 400, headers: NO_STORE_HEADERS });

  try {
    const reservation = await findById(id);
    if (!reservation) return NextResponse.json({ error: { code: "RESERVATION_NOT_FOUND", message: "La reserva no existe." } }, { status: 404, headers: NO_STORE_HEADERS });
    return NextResponse.json(reservation, { status: 200, headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error("Admin reservation detail failed", { errorType: error instanceof Error ? error.name : "UnknownError" });
    return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "No se pudo cargar la reserva." } }, { status: 500, headers: NO_STORE_HEADERS });
  }
}
