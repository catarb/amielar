import { createHmac, timingSafeEqual } from "node:crypto";

import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_DURATION_SECONDS,
} from "./constants";

export type AdminSession = {
  username: string;
  issuedAt: number;
  expiresAt: number;
};

function encode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createAdminSessionToken(
  username: string,
  secret: string,
  now = Date.now,
): string {
  const issuedAt = Math.floor(now() / 1000);
  const payload: AdminSession = {
    username,
    issuedAt,
    expiresAt: issuedAt + ADMIN_SESSION_DURATION_SECONDS,
  };
  const encodedPayload = encode(JSON.stringify(payload));
  return `${encodedPayload}.${sign(encodedPayload, secret)}`;
}

export function verifyAdminSessionToken(
  token: string,
  secret: string,
  now = Date.now,
): AdminSession | null {
  const [encodedPayload, encodedSignature, ...extra] = token.split(".");
  if (!encodedPayload || !encodedSignature || extra.length > 0) return null;

  try {
    const expectedSignature = Buffer.from(sign(encodedPayload, secret));
    const receivedSignature = Buffer.from(encodedSignature);
    if (
      expectedSignature.length !== receivedSignature.length ||
      !timingSafeEqual(expectedSignature, receivedSignature)
    ) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as Partial<AdminSession>;
    if (
      typeof payload.username !== "string" ||
      !payload.username ||
      typeof payload.issuedAt !== "number" ||
      typeof payload.expiresAt !== "number" ||
      !Number.isInteger(payload.issuedAt) ||
      !Number.isInteger(payload.expiresAt)
    ) {
      return null;
    }

    const currentTime = Math.floor(now() / 1000);
    if (payload.expiresAt <= currentTime || payload.issuedAt > currentTime) return null;
    return payload as AdminSession;
  } catch {
    return null;
  }
}

export function adminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_DURATION_SECONDS,
  };
}

export function expiredAdminSessionCookieOptions() {
  return { ...adminSessionCookieOptions(), maxAge: 0 };
}

export { ADMIN_SESSION_COOKIE };
