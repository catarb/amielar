import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/server/auth/admin-auth";
import { isAllowedOrigin } from "@/server/security/origin";
import { ADMIN_BLOCK_BODY_BYTES, readLimitedJson } from "@/server/security/request-body";
import { ReservationDomainError } from "@/server/domain/reservations/errors";
import { updateAdminAvailabilityBulk } from "@/server/services/admin-availability";

const HEADERS = { "Cache-Control": "private, no-store" };
const schema = z.object({
  month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
  weekday: z.number().int().min(0).max(6).optional(),
  ranges: z.array(z.object({
    startTime: z.string(), endTime: z.string(), action: z.enum(["AVAILABLE", "BLOCKED"]),
  }).strict()).min(1).max(16),
}).strict();
const errorResponse = (code: string, message: string, status: number) => NextResponse.json({ error: { code, message } }, { status, headers: HEADERS });

export async function PATCH(request: Request): Promise<Response> { return handleAdminAvailabilityBulkRequest(request); }

export async function handleAdminAvailabilityBulkRequest(
  request: Request,
  authenticate: typeof isAdminAuthenticated = isAdminAuthenticated,
  originCheck: typeof isAllowedOrigin = isAllowedOrigin,
  update: typeof updateAdminAvailabilityBulk = updateAdminAvailabilityBulk,
): Promise<Response> {
  if (!(await authenticate())) return errorResponse("UNAUTHORIZED", "No autorizado.", 401);
  if (!originCheck(request)) return errorResponse("CSRF_VALIDATION_FAILED", "La solicitud no es válida.", 403);
  const body = await readLimitedJson(request, ADMIN_BLOCK_BODY_BYTES);
  if (!body.ok) return errorResponse(body.reason === "too_large" ? "PAYLOAD_TOO_LARGE" : "INVALID_JSON", "La solicitud no es válida.", body.reason === "too_large" ? 413 : 400);
  const parsed = schema.safeParse(body.value);
  if (!parsed.success) return errorResponse("VALIDATION_ERROR", "La solicitud no es válida.", 422);
  try {
    return NextResponse.json(await update(parsed.data), { headers: HEADERS });
  } catch (error) {
    if (error instanceof ReservationDomainError) return errorResponse("VALIDATION_ERROR", "El rango o mes no es válido.", 422);
    console.error("Admin bulk availability failed", { errorType: error instanceof Error ? error.name : "UnknownError" });
    return errorResponse("INTERNAL_ERROR", "No se pudo actualizar la disponibilidad. No se aplicaron todos los cambios.", 500);
  }
}
