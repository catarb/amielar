import { describe, expect, it } from "vitest";

import { generatePasswordHash, verifyPassword } from "../password";

describe("admin password helpers", () => {
  it("verifica una contraseÃ±a correcta y rechaza una incorrecta", async () => {
    const hash = await generatePasswordHash("test-password-only");
    await expect(verifyPassword("test-password-only", hash)).resolves.toBe(true);
    await expect(verifyPassword("other-test-password", hash)).resolves.toBe(false);
  });

  it("genera hashes con salt diferente", async () => {
    const first = await generatePasswordHash("test-password-only");
    const second = await generatePasswordHash("test-password-only");
    expect(first).not.toBe(second);
    expect(first.split(":")[0]).toBe("scrypt");
    expect(first.split(":")[1]).not.toBe(second.split(":")[1]);
  });

  it("rechaza hashes malformados sin lanzar", async () => {
    await expect(verifyPassword("test-password-only", "not-a-valid-hash")).resolves.toBe(false);
    await expect(verifyPassword("test-password-only", "scrypt:salt:invalid")).resolves.toBe(false);
  });
});
