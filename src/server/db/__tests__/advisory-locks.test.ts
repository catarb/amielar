import { describe, expect, it, vi } from "vitest";

import { acquireSlotAdvisoryLocks } from "../advisory-lock";

describe("advisory locks de disponibilidad", () => {
  it("ordena y deduplica los horarios antes de adquirirlos", async () => {
    const execute = vi.fn().mockResolvedValue(undefined);
    const tx = { execute } as never;
    await acquireSlotAdvisoryLocks(tx, [new Date("2026-12-15T21:00:00.000Z"), new Date("2026-12-15T18:00:00.000Z"), new Date("2026-12-15T21:00:00.000Z")]);
    expect(execute).toHaveBeenCalledTimes(2);
    const keys = execute.mock.calls.map(([query]) => JSON.stringify(query));
    expect(keys.join(" ")).toContain("2026-12-15T18:00:00.000Z");
    expect(keys.join(" ")).toContain("2026-12-15T21:00:00.000Z");
    expect(keys.join(" ").indexOf("18:00")).toBeLessThan(keys.join(" ").indexOf("21:00"));
  });
});
