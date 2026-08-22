import { NextResponse } from "next/server";
import { z } from "zod";
import { formatInTimeZone } from "date-fns-tz";

import { isAdminAuthenticated } from "@/server/auth/admin-auth";
import { ReservationDomainError } from "@/server/domain/reservations/errors";
import { isAllowedOrigin } from "@/server/security/origin";
import { AdminAvailabilityError, createAdminAvailabilityBlock } from "@/server/services/admin-availability";
import { TIMEZONE } from "@/server/domain/reservations/constants";
import { ADMIN_BLOCK_BODY_BYTES, readLimitedJson } from "@/server/security/request-body";

const HEADERS = { "Cache-Control": "private, no-store" };
const schema = z.object({ date: z.string(), startTime: z.string(), endTime: z.string(), reason: z.string().max(200).nullable().optional(), confirmImpact: z.boolean().default(false) }).strict();
const errorResponse = (code: string, message: string, status: number, extra: Record<string, unknown> = {}) => NextResponse.json({ error: { code, message, ...extra } }, { status, headers: HEADERS });

export async function POST(request: Request): Promise<Response> { return handleAdminBlockCreateRequest(request); }

export async function handleAdminBlockCreateRequest(
  request: Request,
  authenticate: typeof isAdminAuthenticated = isAdminAuthenticated,
  originCheck: typeof isAllowedOrigin = isAllowedOrigin,
  create: typeof createAdminAvailabilityBlock = createAdminAvailabilityBlock,
): Promise<Response> {
  if (!(await authenticate())) return errorResponse("UNAUTHORIZED", "No autorizado.", 401);
  if (!originCheck(request)) return errorResponse("CSRF_VALIDATION_FAILED", "La solicitud no es válida.", 403);
  const bodyResult = await readLimitedJson(request, ADMIN_BLOCK_BODY_BYTES);
  if (!bodyResult.ok) {
    if (bodyResult.reason === "too_large") return errorResponse("PAYLOAD_TOO_LARGE", "La solicitud es demasiado grande.", 413);
    return errorResponse("INVALID_JSON", "La solicitud no es válida.", 400);
  }
  const body = bodyResult.value;
  const parsed = schema.safeParse(body);
  if (!parsed.success) return errorResponse("VALIDATION_ERROR", "La solicitud no es válida.", 422);
  try {
    const block = await create({ ...parsed.data, reason: parsed.data.reason ?? null });
    return NextResponse.json({ block: { id: block.id, date: formatInTimeZone(block.startsAt, TIMEZONE, "yyyy-MM-dd"), startTime: formatInTimeZone(block.startsAt, TIMEZONE, "HH:mm"), endTime: formatInTimeZone(block.endsAt, TIMEZONE, "HH:mm"), reason: block.reason } }, { status: 201, headers: HEADERS });
  } catch (error) {
    if (error instanceof ReservationDomainError) return errorResponse("VALIDATION_ERROR", "El rango horario no es válido.", 422);
    if (error instanceof AdminAvailabilityError) {
      if (error.code === "OUT_OF_SEASON") return errorResponse(error.code, error.message, 422);
      if (error.code === "BLOCK_IMPACTS_RESERVATIONS") return errorResponse(error.code, error.message, 409, { impact: error.impact });
      if (error.code === "BLOCK_OVERLAPS_EXISTING") return errorResponse(error.code, error.message, 409);
    }
    console.error("Admin availability block creation failed", { errorType: error instanceof Error ? error.name : "UnknownError" });
    return errorResponse("INTERNAL_ERROR", "No se pudo crear el bloqueo.", 500);
  }
}
