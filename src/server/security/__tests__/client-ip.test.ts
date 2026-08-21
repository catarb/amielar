import { describe, expect, it } from "vitest";

import { getClientIp } from "../client-ip";

describe("getClientIp", () => {
  it("usa el primer valor de x-forwarded-for", () => {
    const request = new Request("http://localhost", {
      headers: { "x-forwarded-for": "203.0.113.10, 10.0.0.1", "x-real-ip": "192.0.2.1" },
    });
    expect(getClientIp(request)).toBe("203.0.113.10");
  });

  it("usa x-real-ip como fallback", () => {
    expect(getClientIp(new Request("http://localhost", { headers: { "x-real-ip": " 192.0.2.1 " } }))).toBe("192.0.2.1");
  });

  it("devuelve null si no hay una IP disponible", () => {
    expect(getClientIp(new Request("http://localhost"))).toBeNull();
  });
});
