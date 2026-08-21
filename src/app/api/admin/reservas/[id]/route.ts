import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/server/auth/admin-auth";
import { isAllowedOrigin } from "@/server/security/origin";
import { z } from "zod";
import {
  AdminReservationActionError,
  cancelAdminReservation,
  confirmAdminReservation,
  deleteAdminReservation,
} from "@/server/services/admin-reservation-actions";
import { getAdminReservationById } from "@/server/services/admin-reservations";

const NO_STORE_HEADERS = { "Cache-Control": "private, no-store" };
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const actionSchema = z.object({ action: z.enum(["confirm", "cancel"]) }).strict();

const csrfResponse = () => NextResponse.json({ error: { code: "CSRF_VALIDATION_FAILED", message: "La solicitud no es vÃ¡lida." } }, { status: 403, headers: NO_STORE_HEADERS });
const notFoundResponse = () => NextResponse.json({ error: { code: "RESERVATION_NOT_FOUND", message: "La reserva no existe." } }, { status: 404, headers: NO_STORE_HEADERS });

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  const { id } = await params;
  return handleAdminReservationDetailRequest(request, id);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  const { id } = await params;
  return handleAdminReservationPatchRequest(request, id);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  const { id } = await params;
  return handleAdminReservationDeleteRequest(request, id);
}

export async function handleAdminReservationPatchRequest(
  request: Request,
  id: string,
  authenticate: typeof isAdminAuthenticated = isAdminAuthenticated,
  originCheck: typeof isAllowedOrigin = isAllowedOrigin,
  actionRunner: typeof confirmAdminReservation = confirmAdminReservation,
  cancelRunner: typeof cancelAdminReservation = cancelAdminReservation,
): Promise<Response> {
  if (!(await authenticate())) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "No autorizado." } }, { status: 401, headers: NO_STORE_HEADERS });
  if (!originCheck(request)) return csrfResponse();
  if (!UUID_PATTERN.test(id)) return NextResponse.json({ error: { code: "INVALID_RESERVATION_ID", message: "El identificador no es vÃ¡lido." } }, { status: 400, headers: NO_STORE_HEADERS });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: { code: "INVALID_JSON", message: "La solicitud no es vÃ¡lida." } }, { status: 400, headers: NO_STORE_HEADERS }); }
  const parsed = actionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "La solicitud no es vÃ¡lida." } }, { status: 422, headers: NO_STORE_HEADERS });

  try {
    const result = parsed.data.action === "confirm" ? await actionRunner(id) : await cancelRunner(id);
    return NextResponse.json(result, { status: 200, headers: NO_STORE_HEADERS });
  } catch (error) {
    if (error instanceof AdminReservationActionError) {
      if (error.code === "RESERVATION_NOT_FOUND") return notFoundResponse();
      return NextResponse.json({ error: { code: error.code, message: error.message } }, { status: 409, headers: NO_STORE_HEADERS });
    }
    console.error("Admin reservation patch failed", { errorType: error instanceof Error ? error.name : "UnknownError" });
    return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "No se pudo actualizar la reserva." } }, { status: 500, headers: NO_STORE_HEADERS });
  }
}

export async function handleAdminReservationDeleteRequest(
  request: Request,
  id: string,
  authenticate: typeof isAdminAuthenticated = isAdminAuthenticated,
  originCheck: typeof isAllowedOrigin = isAllowedOrigin,
  deleteRunner: typeof deleteAdminReservation = deleteAdminReservation,
): Promise<Response> {
  if (!(await authenticate())) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "No autorizado." } }, { status: 401, headers: NO_STORE_HEADERS });
  if (!originCheck(request)) return csrfResponse();
  if (!UUID_PATTERN.test(id)) return NextResponse.json({ error: { code: "INVALID_RESERVATION_ID", message: "El identificador no es vÃ¡lido." } }, { status: 400, headers: NO_STORE_HEADERS });

  try {
    await deleteRunner(id);
    return NextResponse.json({ success: true }, { status: 200, headers: NO_STORE_HEADERS });
  } catch (error) {
    if (error instanceof AdminReservationActionError && error.code === "RESERVATION_NOT_FOUND") return notFoundResponse();
    console.error("Admin reservation delete failed", { errorType: error instanceof Error ? error.name : "UnknownError" });
    return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "No se pudo eliminar la reserva." } }, { status: 500, headers: NO_STORE_HEADERS });
  }
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
