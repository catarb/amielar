import { describe, expect, it } from "vitest";

import { readAdminAuthConfig } from "../admin-auth";

describe("admin auth configuration", () => {
  it("requires username, password hash and a 32-byte session secret", () => {
    expect(readAdminAuthConfig({ ADMIN_USERNAME: "admin", ADMIN_PASSWORD_HASH: "hash" })).toBeNull();
    expect(readAdminAuthConfig({
      ADMIN_USERNAME: "admin",
      ADMIN_PASSWORD_HASH: "scrypt:salt:hash",
      ADMIN_SESSION_SECRET: "short",
    })).toBeNull();
    expect(readAdminAuthConfig({
      ADMIN_USERNAME: "admin",
      ADMIN_PASSWORD_HASH: "scrypt:salt:hash",
      ADMIN_SESSION_SECRET: "test-session-secret-with-at-least-32-bytes",
    })).toEqual({
      username: "admin",
      passwordHash: "scrypt:salt:hash",
      sessionSecret: "test-session-secret-with-at-least-32-bytes",
    });
  });
});
