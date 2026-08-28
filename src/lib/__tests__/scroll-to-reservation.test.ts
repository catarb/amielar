// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";
import { scrollToSection } from "../scroll-to-reservation";

describe("scrollToSection reservation", () => {
  afterEach(() => { document.body.innerHTML = ""; vi.restoreAllMocks(); });

  it("centra la card real cuando entra en el viewport útil", () => {
    document.body.innerHTML = `<header data-site-header="true"></header><section id="reserva"><div data-reservation-card="true"></div></section>`;
    vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(900);
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1440);
    vi.spyOn(window, "scrollY", "get").mockReturnValue(100);
    vi.spyOn(document.querySelector("[data-site-header='true']")!, "getBoundingClientRect").mockReturnValue({ height: 100, top: 0, bottom: 100, left: 0, right: 0, width: 0, x: 0, y: 0, toJSON: () => ({}) });
    vi.spyOn(document.querySelector("[data-reservation-card='true']")!, "getBoundingClientRect").mockReturnValue({ height: 500, top: 700, bottom: 1200, left: 0, right: 0, width: 0, x: 0, y: 700, toJSON: () => ({}) });
    scrollToSection("#reserva");
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 550, behavior: "smooth" });
  });
});
