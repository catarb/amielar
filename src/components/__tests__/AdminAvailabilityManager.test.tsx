// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import AdminAvailabilityManager from "../AdminAvailabilityManager";

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: vi.fn() }) }));

const availability = (state: "AVAILABLE" | "RESERVED" = "AVAILABLE") => new Response(JSON.stringify({ timezone: "America/Argentina/Buenos_Aires", slots: [{ startTime: "14:00", endTime: "15:00", state, ...(state === "RESERVED" ? { reservationId: "11111111-1111-4111-8111-111111111111" } : {}) }], blocks: [] }), { status: 200 });

describe("AdminAvailabilityManager", () => {
  afterEach(() => { cleanup(); vi.restoreAllMocks(); });

  it("abre la carga manual desde un slot disponible y refresca después de guardar", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(availability()).mockResolvedValueOnce(new Response(JSON.stringify({ reservationId: "reservation-id", status: "PENDIENTE_PAGO" }), { status: 201 })).mockResolvedValueOnce(new Response(JSON.stringify({ timezone: "America/Argentina/Buenos_Aires", slots: [{ startTime: "14:00", endTime: "15:00", state: "RESERVED", reservationId: "reservation-id" }], blocks: [] }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    render(<AdminAvailabilityManager />);
    fireEvent.change(screen.getByLabelText("Fecha"), { target: { value: "2026-12-15" } });
    fireEvent.click(screen.getByRole("button", { name: "Consultar" }));
    fireEvent.click(await screen.findByRole("button", { name: /14:00/ }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(within(screen.getByRole("dialog")).getByText("15/12/2026")).toBeInTheDocument();
    expect(within(screen.getByRole("dialog")).getByText("14:00–15:00")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Nombre completo *"), { target: { value: "Ana Prueba" } });
    fireEvent.change(screen.getByLabelText("Teléfono *"), { target: { value: "+5492304000000" } });
    fireEvent.change(screen.getByLabelText("Localidad *"), { target: { value: "General Pico" } });
    fireEvent.click(screen.getByRole("button", { name: "Guardar reserva" }));
    expect(await screen.findByText("Reserva cargada correctamente.")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenLastCalledWith("/api/admin/disponibilidad?date=2026-12-15", expect.objectContaining({ cache: "no-store" }));
    expect(screen.getByText("Reservada")).toBeInTheDocument();
  });

  it("lleva los slots reservados al detalle y no vuelve clickeables los bloqueados", async () => {
    const fetchMock = vi.fn().mockResolvedValue(availability("RESERVED"));
    vi.stubGlobal("fetch", fetchMock);
    render(<AdminAvailabilityManager />);
    fireEvent.change(screen.getByLabelText("Fecha"), { target: { value: "2026-12-15" } });
    fireEvent.click(screen.getByRole("button", { name: "Consultar" }));
    const link = await screen.findByRole("link", { name: /14:00/ });
    expect(link).toHaveAttribute("href", "/admin/reservas/11111111-1111-4111-8111-111111111111");
  });
});
