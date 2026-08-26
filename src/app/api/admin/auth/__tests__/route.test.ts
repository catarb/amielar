import { describe, expect, it, vi } from "vitest";

import { handleAdminLoginRequest } from "../login/route";
import { POST as logout } from "../logout/route";
import { createRateLimiter } from "@/server/security/rate-limit";

function request(body: unknown): Request {
  return new Request("http://localhost/api/admin/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.10" },
    body: JSON.stringify(body),
  });
}

describe("admin auth routes", () => {
  it("devuelve 200 y cookie segura para credenciales vÃ¡lidas", async () => {
    const response = await handleAdminLoginRequest(
      request({ username: "admin-test", password: "test-password-only" }),
      async () => "signed-session-token",
      createRateLimiter(),
    );
    expect(response.status).toBe(200);
    const cookie = response.headers.get("set-cookie") ?? "";
    expect(cookie).toContain("amielar_admin_session=signed-session-token");
    expect(cookie.toLowerCase()).toContain("httponly");
    expect(cookie.toLowerCase()).toContain("samesite=lax");
  });

  it("usa el mismo 401 y mensaje para usuario y contraseÃ±a incorrectos", async () => {
    const authenticate = async () => null;
    const usernameResponse = await handleAdminLoginRequest(request({ username: "wrong", password: "test" }), authenticate, createRateLimiter());
    const passwordResponse = await handleAdminLoginRequest(request({ username: "admin-test", password: "wrong" }), authenticate, createRateLimiter());
    expect(usernameResponse.status).toBe(401);
    expect(passwordResponse.status).toBe(401);
    expect(await usernameResponse.json()).toEqual(await passwordResponse.json());
  });

  it("rechaza JSON invÃ¡lido y cuerpos invÃ¡lidos", async () => {
    const invalidJson = new Request("http://localhost/api/admin/auth/login", { method: "POST", body: "{" });
    expect((await handleAdminLoginRequest(invalidJson, async () => "token")).status).toBe(400);
    expect((await handleAdminLoginRequest(request({ username: "admin-test", extra: true }), async () => "token")).status).toBe(422);
  });

  it("limita el sexto intento y devuelve Retry-After", async () => {
    const limiter = createRateLimiter({ max: 5, windowMs: 900_000 });
    const authenticate = async () => null;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect((await handleAdminLoginRequest(request({ username: "admin-test", password: "wrong" }), authenticate, limiter)).status).toBe(401);
    }
    const response = await handleAdminLoginRequest(request({ username: "admin-test", password: "wrong" }), authenticate, limiter);
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBeTruthy();
  });

  it("rechaza cuerpos sobredimensionados antes de autenticar", async () => {
    const authenticate = vi.fn().mockResolvedValue("token");
    const oversizedByHeader = new Request("http://localhost/api/admin/auth/login", { method: "POST", headers: { "content-length": "5000" }, body: "{}" });
    const oversizedInBytes = new Request("http://localhost/api/admin/auth/login", { method: "POST", body: "x".repeat(5000) });
    expect((await handleAdminLoginRequest(oversizedByHeader, authenticate)).status).toBe(413);
    expect((await handleAdminLoginRequest(oversizedInBytes, authenticate)).status).toBe(413);
    expect(authenticate).not.toHaveBeenCalled();
  });

  it("falla cerradamente cuando falta configuraciÃ³n", async () => {
    const { authenticateAdmin } = await import("@/server/auth/admin-auth");
    await expect(authenticateAdmin("admin-test", "test-password-only", {})).resolves.toBeNull();
  });

  it("logout es idempotente y elimina la cookie", async () => {
    const withSession = await logout();
    const withoutSession = await logout();
    for (const response of [withSession, withoutSession]) {
      expect(response.status).toBe(200);
      expect(response.headers.get("set-cookie")?.toLowerCase()).toContain("max-age=0");
    }
  });
});
