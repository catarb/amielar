import { describe, expect, it } from "vitest";

import { isAllowedOrigin } from "../origin";

function request(origin?: string): Request {
  return new Request("http://localhost/api/admin/reservas/id", { headers: origin ? { origin } : undefined });
}

describe("admin Origin validation", () => {
  const env = { APP_ORIGIN: "https://amielar.example:8443" };

  it("accepts only the exact configured origin", () => {
    expect(isAllowedOrigin(request("https://amielar.example:8443"), env)).toBe(true);
    expect(isAllowedOrigin(request("https://sub.amielar.example:8443"), env)).toBe(false);
    expect(isAllowedOrigin(request("https://amielar.example:8444"), env)).toBe(false);
    expect(isAllowedOrigin(request("http://amielar.example:8443"), env)).toBe(false);
  });

  it("fails closed for missing/invalid configuration or Origin", () => {
    expect(isAllowedOrigin(request(), env)).toBe(false);
    expect(isAllowedOrigin(request("https://amielar.example:8443"), {})).toBe(false);
    expect(isAllowedOrigin(request("https://amielar.example:8443"), { APP_ORIGIN: "not-a-url" })).toBe(false);
    expect(isAllowedOrigin(request("https://amielar.example:8443"), { APP_ORIGIN: "https://amielar.example/path" })).toBe(false);
  });
});
