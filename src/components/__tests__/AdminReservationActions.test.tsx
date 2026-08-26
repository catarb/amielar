// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const router = { refresh: vi.fn(), replace: vi.fn() };
vi.mock("next/navigation", () => ({ useRouter: () => router }));

import { AdminReservationActions } from "../AdminReservationActions";

describe("AdminReservationActions", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    router.refresh.mockReset();
    router.replace.mockReset();
  });

  it("muestra las acciones permitidas por estado", () => {
    const { unmount } = render(<AdminReservationActions id="id" status="PENDIENTE_PAGO" />);
    expect(screen.getByRole("button", { name: "Confirmar pago y reserva" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar reserva" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Eliminar reserva" })).toBeInTheDocument();
    unmount();
    render(<AdminReservationActions id="id" status="CONFIRMADA" />);
    expect(screen.queryByRole("button", { name: "Confirmar pago y reserva" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar reserva" })).toBeInTheDocument();
    cleanup();
    render(<AdminReservationActions id="id" status="CANCELADA" />);
    expect(screen.queryByRole("button", { name: "Confirmar pago y reserva" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Cancelar reserva" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Eliminar reserva" })).toBeInTheDocument();
  });

  it("requiere confirmaciÃ³n y ejecuta PATCH confirm", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: "CONFIRMADA" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    render(<AdminReservationActions id="reservation-id" status="PENDIENTE_PAGO" />);
    fireEvent.click(screen.getByRole("button", { name: "Confirmar pago y reserva" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Confirmar reserva" }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/api/admin/reservas/reservation-id", expect.objectContaining({ method: "PATCH", body: JSON.stringify({ action: "confirm" }) })));
    expect(router.refresh).toHaveBeenCalled();
    expect(await screen.findByRole("status")).toHaveTextContent("Reserva confirmada correctamente.");
  });

  it("ejecuta cancel y delete con confirmaciÃ³n y evita doble acciÃ³n", async () => {
    let resolveRequest: ((response: Response) => void) | undefined;
    const pending = new Promise<Response>((resolve) => { resolveRequest = resolve; });
    const fetchMock = vi.fn().mockReturnValue(pending);
    vi.stubGlobal("fetch", fetchMock);
    render(<AdminReservationActions id="reservation-id" status="CONFIRMADA" />);
    fireEvent.click(screen.getByRole("button", { name: "Cancelar reserva" }));
    const dialog = within(screen.getByRole("dialog"));
    fireEvent.click(dialog.getByRole("button", { name: "Cancelar reserva" }));
    fireEvent.click(dialog.getByRole("button", { name: "Cancelando..." }));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    resolveRequest?.(new Response("{}", { status: 200 }));
    await waitFor(() => expect(router.refresh).toHaveBeenCalled());
  });

  it("ejecuta DELETE y vuelve al listado", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    render(<AdminReservationActions id="reservation-id" status="CANCELADA" />);
    fireEvent.click(screen.getByRole("button", { name: "Eliminar reserva" }));
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Eliminar reserva" }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/api/admin/reservas/reservation-id", expect.objectContaining({ method: "DELETE" })));
    expect(router.replace).toHaveBeenCalledWith("/admin/reservas");
  });
});
