import { describe, expect, it, vi } from "vitest";

import {
  adminSessionCookieOptions,
  createAdminSessionToken,
  verifyAdminSessionToken,
} from "../session";

const secret = "test-session-secret-with-at-least-32-bytes";
const now = () => 1_700_000_000_000;

describe("admin sessions", () => {
  it("acepta un token vÃ¡lido", () => {
    const token = createAdminSessionToken("admin-test", secret, now);
    expect(verifyAdminSessionToken(token, secret, now)).toMatchObject({ username: "admin-test" });
  });

  it("rechaza firma, payload y secret modificados", () => {
    const token = createAdminSessionToken("admin-test", secret, now);
    const [payload, signature] = token.split(".");
    const alteredPayload = `${Buffer.from(JSON.stringify({ username: "other", issuedAt: 1700000000, expiresAt: 1700028800 })).toString("base64url")}.${signature}`;
    expect(verifyAdminSessionToken(`${payload}.${signature.slice(0, -1)}x`, secret, now)).toBeNull();
    expect(verifyAdminSessionToken(alteredPayload, secret, now)).toBeNull();
    expect(verifyAdminSessionToken(token, `${secret}-wrong`, now)).toBeNull();
  });

  it("rechaza tokens vencidos y formatos invÃ¡lidos", () => {
    const token = createAdminSessionToken("admin-test", secret, now);
    expect(verifyAdminSessionToken(token, secret, () => now() + 8 * 60 * 60 * 1000 + 1)).toBeNull();
    expect(verifyAdminSessionToken("invalid", secret, now)).toBeNull();
    expect(verifyAdminSessionToken("a.b.c", secret, now)).toBeNull();
  });

  it("activa Secure en producciÃ³n", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(adminSessionCookieOptions().secure).toBe(true);
    vi.unstubAllEnvs();
  });
});
