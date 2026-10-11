// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
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
    fireEvent.click(await screen.findByRole("button", { name: "Cargar reserva en horario 14:00 a 15:00" }));
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

  it("alterna bloqueo y disponibilidad, actualiza contadores y evita peticiones duplicadas", async () => {
    let blocked = true;
    let finishPatch: ((response: Response) => void) | undefined;
    const fetchMock = vi.fn((url: string, options?: RequestInit) => {
      if (options?.method === "PATCH") return new Promise<Response>((resolve) => { finishPatch = resolve; });
      if (url.includes("month=")) return Promise.resolve(new Response(JSON.stringify({ days: [{ ...day(blocked ? 15 : 16, blocked ? 1 : 0), reservedCount: 0 }] }), { status: 200 }));
      return Promise.resolve(detail(blocked ? "BLOCKED" : "AVAILABLE"));
    });
    vi.stubGlobal("fetch", fetchMock); render(<AdminAvailabilityManager />);
    fireEvent.click(await screen.findByRole("button", { name: /15 de septiembre/ }));
    const enable = await screen.findByRole("button", { name: "Habilitar horario 14:00 a 15:00" });
    fireEvent.click(enable); fireEvent.click(enable);
    expect(fetchMock.mock.calls.filter(([, options]) => options?.method === "PATCH")).toHaveLength(1);
    expect(screen.getByText("16/16 libres")).toBeInTheDocument();
    blocked = false; finishPatch!(new Response(JSON.stringify({ state: "AVAILABLE" }), { status: 200 }));
    const disable = await screen.findByRole("button", { name: "Bloquear horario 14:00 a 15:00" });
    await waitFor(() => expect(disable).not.toBeDisabled());
    fireEvent.click(disable);
    expect(screen.getByText("15/16 libres")).toBeInTheDocument();
    blocked = true; finishPatch!(new Response(JSON.stringify({ state: "BLOCKED" }), { status: 200 }));
    expect(await screen.findByRole("button", { name: "Habilitar horario 14:00 a 15:00" })).toBeInTheDocument();
  });

  it("revierte el cambio visual si el servidor falla y no permite alternar una reserva", async () => {
    const fetchMock = vi.fn((url: string, options?: RequestInit) => options?.method === "PATCH"
      ? Promise.resolve(new Response(JSON.stringify({ error: { code: "INTERNAL_ERROR" } }), { status: 500 }))
      : Promise.resolve(url.includes("month=") ? new Response(JSON.stringify({ days: [{ ...day(15, 1), reservedCount: 1 }] }), { status: 200 }) : new Response(JSON.stringify({ timezone: "America/Argentina/Buenos_Aires", slots: [
        { startTime: "14:00", endTime: "15:00", state: "BLOCKED" },
        { startTime: "15:00", endTime: "16:00", state: "RESERVED", reservationId: "11111111-1111-4111-8111-111111111111" },
      ], blocks: [] }), { status: 200 })));
    vi.stubGlobal("fetch", fetchMock); render(<AdminAvailabilityManager />);
    fireEvent.click(await screen.findByRole("button", { name: /15 de septiembre/ }));
    expect(await screen.findByRole("link", { name: /15:00/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /horario 15:00 a 16:00/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Habilitar horario 14:00 a 15:00" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("No se pudo actualizar la disponibilidad.");
    expect(screen.getByRole("button", { name: "Habilitar horario 14:00 a 15:00" })).toBeInTheDocument();
    expect(screen.getByText("15/16 libres")).toBeInTheDocument();
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

  it("abre el día de semana correcto, muestra solo fechas del mes y cambia al navegar", async () => {
    vi.stubGlobal("fetch", vi.fn((url: string) => Promise.resolve(url.includes("month=") ? month.clone() : detail())));
    render(<AdminAvailabilityManager />);
    fireEvent.click(await screen.findByRole("button", { name: "Editar todos los lunes de septiembre de 2026" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("7, 14, 21, 28 de septiembre de 2026");
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Cancelar" }));
    fireEvent.click(screen.getByRole("button", { name: "Mes siguiente" }));
    fireEvent.click(await screen.findByRole("button", { name: "Editar todos los lunes de octubre de 2026" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("5, 12, 19, 26 de octubre de 2026");
  });

  it("envía varios rangos en una sola petición, deshabilita el botón y refresca", async () => {
    let finish: ((response: Response) => void) | undefined;
    let refreshed = false;
    const fetchMock = vi.fn((url: string, options?: RequestInit) => {
      if (options?.method === "PATCH" && url.includes("masiva")) return new Promise<Response>((resolve) => { finish = resolve; });
      if (url.includes("month=")) return Promise.resolve(new Response(JSON.stringify({ days: [{ ...day(refreshed ? 14 : 16, refreshed ? 2 : 0), reservedCount: 0 }] }), { status: 200 }));
      return Promise.resolve(detail());
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<AdminAvailabilityManager />);
    fireEvent.click(await screen.findByRole("button", { name: "Editar todos los lunes de septiembre de 2026" }));
    fireEvent.click(screen.getByRole("button", { name: "+ Agregar otro rango" }));
    fireEvent.change(screen.getByRole("combobox", { name: "Desde rango 2" }), { target: { value: "18:00" } });
    fireEvent.change(screen.getByRole("combobox", { name: "Hasta rango 2" }), { target: { value: "19:00" } });
    fireEvent.change(screen.getByRole("combobox", { name: "Acción rango 2" }), { target: { value: "BLOCKED" } });
    const apply = screen.getByRole("button", { name: "Aplicar a todos los lunes" });
    fireEvent.click(apply); fireEvent.click(apply);
    expect(fetchMock.mock.calls.filter(([url, options]) => url.includes("masiva") && options?.method === "PATCH")).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Aplicando cambios..." })).toBeDisabled();
    const sent = JSON.parse(fetchMock.mock.calls.find(([url]) => url.includes("masiva"))![1]!.body as string);
    expect(sent).toMatchObject({ month: "2026-09", weekday: 1, ranges: [{ action: "AVAILABLE" }, { startTime: "18:00", endTime: "19:00", action: "BLOCKED" }] });
    refreshed = true; finish!(new Response(JSON.stringify({ updated: 2, reserved: 1, unchanged: 0 }), { status: 200 }));
    expect(await screen.findByText(/Se actualizaron 2 horarios/)).toHaveTextContent("1 horarios con reservas existentes");
    expect(screen.getByText("14/16 libres")).toBeInTheDocument();
  });

  it("requiere confirmación del mes y conserva la UI ante error", async () => {
    const fetchMock = vi.fn((url: string, options?: RequestInit) => options?.method === "PATCH" ? Promise.resolve(new Response("{}", { status: 500 })) : Promise.resolve(url.includes("month=") ? month.clone() : detail()));
    vi.stubGlobal("fetch", fetchMock); render(<AdminAvailabilityManager />);
    fireEvent.click(await screen.findByRole("button", { name: "Gestionar mes" }));
    fireEvent.click(screen.getByRole("button", { name: "Bloquear todo el mes" }));
    expect(fetchMock.mock.calls.filter(([, options]) => options?.method === "PATCH")).toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: "Sí, bloquear el mes" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("No se pudo actualizar la disponibilidad");
    expect(screen.getByText("16/16 libres")).toBeInTheDocument();
  });
});
