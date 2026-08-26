import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/server/auth/admin-auth";
import { isAllowedOrigin } from "@/server/security/origin";
import { AdminAvailabilityError, deleteAdminAvailabilityBlock } from "@/server/services/admin-availability";

const HEADERS = { "Cache-Control": "private, no-store" };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const response = (code: string, message: string, status: number) => NextResponse.json({ error: { code, message } }, { status, headers: HEADERS });

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  const { id } = await params;
  return handleAdminBlockDeleteRequest(request, id);
}

export async function handleAdminBlockDeleteRequest(
  request: Request,
  id: string,
  authenticate: typeof isAdminAuthenticated = isAdminAuthenticated,
  originCheck: typeof isAllowedOrigin = isAllowedOrigin,
  remove: typeof deleteAdminAvailabilityBlock = deleteAdminAvailabilityBlock,
): Promise<Response> {
  if (!(await authenticate())) return response("UNAUTHORIZED", "No autorizado.", 401);
  if (!originCheck(request)) return response("CSRF_VALIDATION_FAILED", "La solicitud no es válida.", 403);
  if (!UUID.test(id)) return response("INVALID_BLOCK_ID", "El identificador no es válido.", 400);
  try { await remove(id); return NextResponse.json({ success: true }, { status: 200, headers: HEADERS }); }
  catch (error) {
    if (error instanceof AdminAvailabilityError && error.code === "BLOCK_NOT_FOUND") return response(error.code, error.message, 404);
    console.error("Admin availability block deletion failed", { errorType: error instanceof Error ? error.name : "UnknownError" });
    return response("INTERNAL_ERROR", "No se pudo eliminar el bloqueo.", 500);
  }
}
