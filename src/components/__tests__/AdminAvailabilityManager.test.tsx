// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import AdminAvailabilityManager from "../AdminAvailabilityManager";

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: vi.fn() }) }));
const day = (availableCount = 16, blockedCount = 0) => ({ date: "2026-09-15", inSeason: true, totalSlots: 16, availableCount, reservedCount: 16 - availableCount, blockedCount });
const month = new Response(JSON.stringify({ month: "2026-09", days: [day()] }), { status: 200 });
const detail = (state: "AVAILABLE" | "RESERVED" | "BLOCKED" = "AVAILABLE") => new Response(JSON.stringify({ timezone: "America/Argentina/Buenos_Aires", slots: [{ startTime: "14:00", endTime: "15:00", state, ...(state === "RESERVED" ? { reservationId: "11111111-1111-4111-8111-111111111111" } : {}) }], blocks: [] }), { status: 200 });

describe("AdminAvailabilityManager", () => {
  afterEach(() => { cleanup(); vi.restoreAllMocks(); });
  it("carga el resumen mensual, selecciona un día y conserva la carga manual", async () => {
    let detailCalls = 0;
    const fetchMock = vi.fn((url: string, options?: RequestInit) => options?.method === "POST" ? Promise.resolve(new Response(JSON.stringify({ reservationId: "reservation-id" }), { status: 201 })) : Promise.resolve(url.includes("month=") ? month.clone() : detail(detailCalls++ === 0 ? "AVAILABLE" : "RESERVED")));
    vi.stubGlobal("fetch", fetchMock); render(<AdminAvailabilityManager />);
    const legendDots = [...document.querySelectorAll("[data-calendar-legend-dot]")];
    expect(legendDots).toHaveLength(4);
    expect(new Set(legendDots.map((dot) => dot.getAttribute("data-calendar-legend-dot"))).size).toBe(4);
    const dayButton = await screen.findByRole("button", { name: /15 de septiembre/ }); fireEvent.click(dayButton);
    expect(dayButton).toHaveClass("cursor-pointer");
    fireEvent.click(await screen.findByRole("button", { name: /14:00/ }));
    const dialog = screen.getByText("Cargar reserva manual").closest("form")!;
    fireEvent.change(within(dialog).getByLabelText("Nombre completo"), { target: { value: "Ana Prueba" } });
    fireEvent.change(within(dialog).getByLabelText("Teléfono"), { target: { value: "+5492304000000" } });
    fireEvent.change(within(dialog).getByLabelText("Localidad"), { target: { value: "General Pico" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Guardar reserva" }));
    expect(await screen.findByText("Reserva cargada correctamente.")).toBeInTheDocument();
    expect(screen.getByText("Reservada")).toBeInTheDocument();
  });
  it("usa lila para días y horarios bloqueados", async () => {
    const fetchMock = vi.fn((url: string) => Promise.resolve(url.includes("month=") ? new Response(JSON.stringify({ month: "2026-09", days: [day(15, 1)] }), { status: 200 }) : detail("BLOCKED")));
    vi.stubGlobal("fetch", fetchMock); render(<AdminAvailabilityManager />);
    const dayButton = await screen.findByRole("button", { name: /15 de septiembre/ }); fireEvent.click(dayButton);
    expect(dayButton).toHaveClass("bg-[#ead1e8]");
    expect(await screen.findByText("Bloqueada")).toHaveClass("bg-[#ead1e8]", "text-[#73356f]");
  });
  it("expone los slots reservados como enlaces al detalle", async () => {
    vi.stubGlobal("fetch", vi.fn((url: string) => Promise.resolve(url.includes("month=") ? month.clone() : detail("RESERVED")))); render(<AdminAvailabilityManager />);
    fireEvent.click(await screen.findByRole("button", { name: /15 de septiembre/ }));
    expect(await screen.findByRole("link", { name: /14:00/ })).toHaveAttribute("href", "/admin/reservas/11111111-1111-4111-8111-111111111111");
  });

  it("elimina un bloqueo con DELETE y refresca el detalle", async () => {
    const block = { id: "22222222-2222-4222-8222-222222222222", startTime: "06:00", endTime: "10:00", reason: "Me voy de viaje" };
    let deleted = false;
    const fetchMock = vi.fn((url: string, options?: RequestInit) => {
      if (options?.method === "DELETE") {
        deleted = true;
        return Promise.resolve(new Response(JSON.stringify({ success: true }), { status: 200 }));
      }
      if (url.includes("month=")) return Promise.resolve(month.clone());
      return Promise.resolve(new Response(JSON.stringify({ timezone: "America/Argentina/Buenos_Aires", slots: [], blocks: deleted ? [] : [block] }), { status: 200 }));
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<AdminAvailabilityManager />);
    fireEvent.click(await screen.findByRole("button", { name: /15 de septiembre/ }));
    expect(await screen.findByText("Me voy de viaje")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    expect(fetchMock).toHaveBeenCalledWith(`/api/admin/bloqueos/${block.id}`, { method: "DELETE" });
    expect(await screen.findByText("Bloqueo eliminado.")).toBeInTheDocument();
    expect(screen.queryByText("Me voy de viaje")).not.toBeInTheDocument();
  });
});
