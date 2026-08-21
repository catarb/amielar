// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BookingForm } from "../BookingForm";

const availability = (slots: Array<{ startTime: string; endTime: string }>) =>
  new Response(JSON.stringify({ date: "2026-12-15", timezone: "America/Argentina/Buenos_Aires", experience: "aire-de-colmena", slots }), { status: 200 });

const errorResponse = (code: string, fields?: Record<string, string>) =>
  new Response(JSON.stringify({ error: { code, fields } }), { status: code === "VALIDATION_ERROR" ? 422 : code === "RATE_LIMITED" ? 429 : 409 });

function chooseDate() {
  fireEvent.change(screen.getByLabelText("Fecha preferida"), { target: { value: "2026-12-15" } });
}

function fillRequiredFields() {
  fireEvent.change(screen.getByLabelText("Nombre completo"), { target: { value: "María Pérez" } });
  fireEvent.change(screen.getByLabelText("Teléfono"), { target: { value: "+5492302123456" } });
  fireEvent.change(screen.getByLabelText("Localidad"), { target: { value: "General Pico" } });
  fireEvent.change(screen.getByLabelText("Cantidad de personas"), { target: { value: "2" } });
}

describe("BookingForm", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("consulta disponibilidad y muestra solamente los horarios recibidos", async () => {
    let resolveAvailability: ((response: Response) => void) | undefined;
    const pendingAvailability = new Promise<Response>((resolve) => { resolveAvailability = resolve; });
    const fetchMock = vi.fn().mockReturnValue(pendingAvailability);
    vi.stubGlobal("fetch", fetchMock);
    render(<BookingForm />);

    chooseDate();
    expect(await screen.findByText("Consultando horarios disponibles...")).toBeInTheDocument();
    resolveAvailability?.(availability([
      { startTime: "17:00", endTime: "18:00" },
      { startTime: "18:00", endTime: "19:00" },
    ]));
    expect(await screen.findByRole("button", { name: "17:00" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "18:00" })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("/api/disponibilidad?date=2026-12-15");
  });

  it("limpia el horario seleccionado y vuelve a consultar al cambiar fecha", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(availability([{ startTime: "17:00", endTime: "18:00" }]))
      .mockResolvedValueOnce(availability([{ startTime: "20:00", endTime: "21:00" }]));
    vi.stubGlobal("fetch", fetchMock);
    render(<BookingForm />);

    chooseDate();
    const firstSlot = await screen.findByRole("button", { name: "17:00" });
    fireEvent.click(firstSlot);
    expect(firstSlot).toHaveAttribute("aria-pressed", "true");
    fireEvent.change(screen.getByLabelText("Fecha preferida"), { target: { value: "2026-12-16" } });
    expect(await screen.findByRole("button", { name: "20:00" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "17:00" })).not.toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("muestra estados de sin disponibilidad y error", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(availability([]));
    vi.stubGlobal("fetch", fetchMock);
    render(<BookingForm />);
    chooseDate();
    expect(await screen.findByText("No quedan horarios disponibles para este día. Elegí otra fecha.")).toBeInTheDocument();

    fetchMock.mockRejectedValueOnce(new Error("network"));
    fireEvent.change(screen.getByLabelText("Fecha preferida"), { target: { value: "2026-12-16" } });
    expect(await screen.findByText("No pudimos consultar los horarios disponibles. Intentá nuevamente.")).toBeInTheDocument();
  });

  it("muestra éxito provisional y no confirma automáticamente", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(availability([{ startTime: "18:00", endTime: "19:00" }]))
      .mockResolvedValueOnce(new Response(JSON.stringify({ reservationId: "uuid", status: "PENDIENTE_PAGO" }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    render(<BookingForm />);
    chooseDate();
    fireEvent.click(await screen.findByRole("button", { name: "18:00" }));
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: "Enviar solicitud" }));

    expect(await screen.findByText("¡Recibimos tu reserva!")).toBeInTheDocument();
    expect(screen.getByText(/reservado de manera provisoria/)).toBeInTheDocument();
    expect(screen.queryByText("Reserva confirmada")).not.toBeInTheDocument();
    expect(fetchMock).toHaveBeenLastCalledWith("/api/reservas", expect.objectContaining({ method: "POST" }));
    expect(JSON.parse(fetchMock.mock.calls[1][1].body as string).website).toBe("");
  });

  it("incluye honeypot invisible y muestra RATE_LIMITED sin refrescar disponibilidad", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(availability([{ startTime: "18:00", endTime: "19:00" }]))
      .mockResolvedValueOnce(errorResponse("RATE_LIMITED"));
    vi.stubGlobal("fetch", fetchMock);
    render(<BookingForm />);
    const honeypot = document.querySelector('input[name="website"]');
    expect(honeypot).toHaveValue("");
    expect(honeypot).toHaveAttribute("aria-hidden", "true");
    chooseDate();
    fireEvent.click(await screen.findByRole("button", { name: "18:00" }));
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: "Enviar solicitud" }));
    expect(await screen.findByText("Hiciste varios intentos seguidos. Esperá unos minutos antes de volver a intentar.")).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre completo")).toHaveValue("Mar\u00eda P\u00e9rez");
    expect(screen.getByRole("button", { name: "18:00" })).toHaveAttribute("aria-pressed", "true");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it.each(["SLOT_UNAVAILABLE", "SLOT_BLOCKED", "BOOKING_WINDOW_CLOSED"])("refresca horarios para %s y conserva datos", async (code) => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(availability([{ startTime: "18:00", endTime: "19:00" }]))
      .mockResolvedValueOnce(errorResponse(code))
      .mockResolvedValueOnce(availability([{ startTime: "19:00", endTime: "20:00" }]));
    vi.stubGlobal("fetch", fetchMock);
    render(<BookingForm />);
    chooseDate();
    fireEvent.click(await screen.findByRole("button", { name: "18:00" }));
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: "Enviar solicitud" }));

    expect(await screen.findByText(/Elegí otro horario|Elegí otro disponible/)).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre completo")).toHaveValue("María Pérez");
    expect(screen.getByLabelText("Teléfono")).toHaveValue("+5492302123456");
    expect(await screen.findByRole("button", { name: "19:00" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "19:00" })).toHaveAttribute("aria-pressed", "false");
  });

  it("muestra validación de campo sin enviar si faltan datos", async () => {
    const fetchMock = vi.fn().mockResolvedValue(availability([{ startTime: "18:00", endTime: "19:00" }]));
    vi.stubGlobal("fetch", fetchMock);
    render(<BookingForm />);
    chooseDate();
    fireEvent.click(await screen.findByRole("button", { name: "18:00" }));
    fireEvent.click(screen.getByRole("button", { name: "Enviar solicitud" }));
    expect(await screen.findByText("Ingresá tu nombre completo.")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("muestra el error general y evita el doble submit", async () => {
    let resolvePost: ((response: Response) => void) | undefined;
    const pendingPost = new Promise<Response>((resolve) => { resolvePost = resolve; });
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(availability([{ startTime: "18:00", endTime: "19:00" }]))
      .mockReturnValueOnce(pendingPost);
    vi.stubGlobal("fetch", fetchMock);
    render(<BookingForm />);
    chooseDate();
    fireEvent.click(await screen.findByRole("button", { name: "18:00" }));
    fillRequiredFields();
    const submit = screen.getByRole("button", { name: "Enviar solicitud" });
    fireEvent.click(submit);
    fireEvent.click(submit);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(screen.getByRole("button", { name: "Enviando reserva..." })).toBeDisabled();
    resolvePost?.(new Response(JSON.stringify({ error: { code: "INTERNAL_ERROR" } }), { status: 500 }));
    expect(await screen.findByText("No pudimos procesar tu reserva en este momento. Intentá nuevamente.")).toBeInTheDocument();
  });
});
