import { describe, expect, it } from "vitest";

import { isAllowedOrigin } from "../origin";

function request(origin?: string, url = "http://localhost/api/admin/reservas/id"): Request {
  return new Request(url, { headers: origin ? { origin } : undefined });
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

  it("accepts the same LAN origin as the request URL only in development", () => {
    const lanRequest = request("http://192.168.68.102:3000", "http://192.168.68.102:3000/api/admin/bloqueos/id");
    expect(isAllowedOrigin(lanRequest, { APP_ORIGIN: "http://localhost:3000", NODE_ENV: "development" })).toBe(true);
    expect(isAllowedOrigin(lanRequest, { APP_ORIGIN: "http://localhost:3000", NODE_ENV: "production" })).toBe(false);
  });
});
