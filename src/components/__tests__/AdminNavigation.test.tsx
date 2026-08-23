import { describe, expect, it } from "vitest";

import { getAdminNavigationState } from "../AdminNavigation";

describe("admin navigation", () => {
  it.each([
    ["/admin", { home: true, reservations: false, availability: false }],
    ["/admin/reservas", { home: false, reservations: true, availability: false }],
    ["/admin/reservas/123", { home: false, reservations: true, availability: false }],
    ["/admin/disponibilidad", { home: false, reservations: false, availability: true }],
    ["/admin/disponibilidad/bloqueos", { home: false, reservations: false, availability: true }],
  ])("marca correctamente %s", (pathname, expected) => {
    expect(getAdminNavigationState(pathname)).toEqual(expected);
  });
});
