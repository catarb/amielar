import { describe, expect, it } from "vitest";

import { createRateLimiter } from "../rate-limit";

describe("rate limiter", () => {
  it("permite 10 intentos y rechaza el 11 durante la ventana", () => {
    const limiter = createRateLimiter({ now: () => 1000 });
    for (let attempt = 0; attempt < 10; attempt += 1) expect(limiter.check("ip-a").allowed).toBe(true);
    expect(limiter.check("ip-a")).toMatchObject({ allowed: false });
  });

  it("permite nuevamente después de vencer la ventana", () => {
    let now = 1000;
    const limiter = createRateLimiter({ now: () => now, windowMs: 1000 });
    for (let attempt = 0; attempt < 10; attempt += 1) limiter.check("ip-a");
    expect(limiter.check("ip-a").allowed).toBe(false);
    now = 2000;
    expect(limiter.check("ip-a").allowed).toBe(true);
  });

  it("mantiene buckets independientes por IP", () => {
    const limiter = createRateLimiter({ max: 1, now: () => 1000 });
    expect(limiter.check("ip-a").allowed).toBe(true);
    expect(limiter.check("ip-a").allowed).toBe(false);
    expect(limiter.check("ip-b").allowed).toBe(true);
  });
});
