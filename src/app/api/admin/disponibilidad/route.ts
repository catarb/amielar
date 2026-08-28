import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/server/auth/admin-auth";
import { ReservationDomainError } from "@/server/domain/reservations/errors";
import { AdminAvailabilityError, getAdminAvailability, getAdminAvailabilityMonth } from "@/server/services/admin-availability";

export const dynamic = "force-dynamic";
const HEADERS = { "Cache-Control": "private, no-store" };

export async function GET(request: Request): Promise<Response> { return handleAdminAvailabilityRequest(request); }
export async function handleAdminAvailabilityRequest(request: Request, authenticate: typeof isAdminAuthenticated = isAdminAuthenticated, load: typeof getAdminAvailability = getAdminAvailability, loadMonth: typeof getAdminAvailabilityMonth = getAdminAvailabilityMonth): Promise<Response> {
  if (!(await authenticate())) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "No autorizado." } }, { status: 401, headers: HEADERS });
  const params = new URL(request.url).searchParams; const date = params.get("date"); const month = params.get("month");
  if (!date && !month) return NextResponse.json({ error: { code: "INVALID_DATE", message: "La fecha no es válida." } }, { status: 400, headers: HEADERS });
  try { return NextResponse.json(month ? await loadMonth(month) : await load(date!), { status: 200, headers: HEADERS }); }
  catch (error) {
    if (error instanceof ReservationDomainError && error.code === "INVALID_DATE") return NextResponse.json({ error: { code: error.code, message: "La fecha no es válida." } }, { status: 400, headers: HEADERS });
    if (error instanceof AdminAvailabilityError && error.code === "OUT_OF_SEASON") return NextResponse.json({ error: { code: error.code, message: error.message } }, { status: 422, headers: HEADERS });
    console.error("Admin availability lookup failed", { errorType: error instanceof Error ? error.name : "UnknownError" });
    return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "No se pudo cargar la disponibilidad." } }, { status: 500, headers: HEADERS });
  }
}
