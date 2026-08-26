import { NextResponse } from "next/server";
import { z } from "zod";

import { authenticateAdmin } from "@/server/auth/admin-auth";
import { ADMIN_SESSION_COOKIE, adminSessionCookieOptions } from "@/server/auth/session";
import { getClientIp } from "@/server/security/client-ip";
import {
  adminLoginRateLimiter,
  type RateLimiter,
} from "@/server/security/rate-limit";
import { ADMIN_LOGIN_BODY_BYTES, readLimitedJson } from "@/server/security/request-body";

const loginSchema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(1).max(1000),
}).strict();

const invalidCredentialsResponse = {
  error: { code: "INVALID_CREDENTIALS", message: "Usuario o contraseÃ±a incorrectos." },
};

export async function POST(request: Request): Promise<Response> {
  return handleAdminLoginRequest(request);
}

export async function handleAdminLoginRequest(
  request: Request,
  authenticate: typeof authenticateAdmin = authenticateAdmin,
  limiter: RateLimiter = adminLoginRateLimiter,
): Promise<Response> {
  const clientIp = getClientIp(request);
  if (clientIp) {
    const rateLimit = limiter.check(clientIp);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Demasiados intentos. EsperÃ¡ unos minutos antes de volver a intentar." } },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
      );
    }
  }

  const bodyResult = await readLimitedJson(request, ADMIN_LOGIN_BODY_BYTES);
  if (!bodyResult.ok) {
    if (bodyResult.reason === "too_large") {
      return NextResponse.json({ error: { code: "PAYLOAD_TOO_LARGE", message: "La solicitud es demasiado grande." } }, { status: 413 });
    }
    return NextResponse.json({ error: { code: "INVALID_JSON", message: "La solicitud no es vÃ¡lida." } }, { status: 400 });
  }
  const body = bodyResult.value;

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR" } }, { status: 422 });
  }

  const token = await authenticate(parsed.data.username, parsed.data.password);
  if (!token) {
    return NextResponse.json(invalidCredentialsResponse, { status: 401 });
  }

  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, adminSessionCookieOptions());
  return response;
}
