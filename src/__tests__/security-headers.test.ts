import { describe, expect, it } from "vitest";

import nextConfig from "../../next.config";

describe("security headers", () => {
  it("configures non-disruptive security headers without HSTS", async () => {
    const rules = await nextConfig.headers?.();
    const headers = rules?.[0]?.headers ?? [];
    expect(headers).toEqual(expect.arrayContaining([
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ]));
    expect(headers.some((header) => header.key === "Strict-Transport-Security")).toBe(false);
  });
});
