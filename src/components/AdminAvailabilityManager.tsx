"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { EXPERIENCES } from "@/server/domain/reservations/experiences";

type State = "AVAILABLE" | "RESERVED" | "BLOCKED" | "RESERVED_AND_BLOCKED";
type Slot = {
  startTime: string;
  endTime: string;
  state: State;
  reservationId?: string;
};
type Block = {
  id: string;
  startTime: string;
  endTime: string;
  reason: string | null;
};
type Day = {
  date: string;
  inSeason: boolean;
  totalSlots: number;
  availableCount: number;
  reservedCount: number;
  blockedCount: number;
};
type Availability = { timezone: string; slots: Slot[]; blocks: Block[] };
const stateLabel: Record<State, string> = {
  AVAILABLE: "Disponible",
  RESERVED: "Reservada",
  BLOCKED: "Bloqueada",
  RESERVED_AND_BLOCKED: "Reservada + bloqueada",
};
const stateClass: Record<State, string> = {
  AVAILABLE: "bg-[rgba(180,225,192,0.52)] text-[#26744A]",
  RESERVED: "bg-[rgba(243,226,145,0.62)] text-[#927009]",
  BLOCKED: "bg-[rgba(243,191,191,0.54)] text-[#A63232]",
  RESERVED_AND_BLOCKED: "bg-[#ead1e8] text-[#73356f]",
};
const pad = (n: number) => String(n).padStart(2, "0");
const formatDate = (date: string) => {
  const [y, m, d] = date.split("-");
  return `${d}/${m}/${y}`;
};
const monthTitle = (month: string) =>
  new Intl.DateTimeFormat("es-AR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${month}-01T00:00:00Z`));
const shiftMonth = (month: string, amount: number) => {
  const [y, m] = month.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1 + amount, 1));
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}`;
};

export default function AdminAvailabilityManager() {
  const router = useRouter();
  const [month, setMonth] = useState("2026-09");
  const [days, setDays] = useState<Day[]>([]);
  const [date, setDate] = useState("");
  const [data, setData] = useState<Availability | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [start, setStart] = useState("06:00");
  const [end, setEnd] = useState("07:00");
  const [reason, setReason] = useState("");
  const [impact, setImpact] = useState<{
    count: number;
    slots: string[];
  } | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [locality, setLocality] = useState("");
  const [peopleCount, setPeopleCount] = useState("1");
  const experienceSlug = EXPERIENCES[0].slug;
  const status: "PENDIENTE_PAGO" | "CONFIRMADA" = "PENDIENTE_PAGO";
  const [message, setMessage] = useState("");
  const slots = useMemo(
    () => Array.from({ length: 16 }, (_, i) => `${pad(i + 6)}:00`),
    [],
  );
  async function loadMonth(nextMonth = month) {
    setBusy(true);
    try {
      const response = await fetch(
        `/api/admin/disponibilidad?month=${nextMonth}`,
        { cache: "no-store" },
      );
      const body = (await response.json()) as {
        days?: Day[];
        error?: { message?: string };
      };
      if (response.status === 401) return router.replace("/admin/login");
      if (!response.ok)
        throw new Error(
          body.error?.message ?? "No se pudo cargar el calendario.",
        );
      setDays(body.days ?? []);
    } catch (e) {
      setNotice(
        e instanceof Error ? e.message : "No se pudo cargar el calendario.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function loadDay(nextDate = date) {
    if (!nextDate) return;
    setBusy(true);
    try {
      const response = await fetch(
        `/api/admin/disponibilidad?date=${nextDate}`,
        { cache: "no-store" },
      );
      const body = (await response.json()) as Availability & {
        error?: { message?: string };
      };
      if (response.status === 401) return router.replace("/admin/login");
      if (!response.ok)
        throw new Error(
          body.error?.message ?? "No se pudo cargar la disponibilidad.",
        );
      setData({
        timezone: body.timezone,
        slots: body.slots,
        blocks: body.blocks,
      });
    } catch (e) {
      setNotice(
        e instanceof Error ? e.message : "No se pudo cargar la disponibilidad.",
      );
    } finally {
      setBusy(false);
    }
  }
  // The calendar is a client-side synchronization with the selected month.
  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    void loadMonth();
  }, [month]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  function selectDay(nextDate: string) {
    setDate(nextDate);
    setSelectedSlot(null);
    setNotice("");
    void loadDay(nextDate);
  }
  async function mutate(url: string, options: RequestInit, success: string) {
    setBusy(true);
    try {
      const response = await fetch(url, options);
      const body = (await response.json()) as {
        error?: {
          code?: string;
          message?: string;
          impact?: { count: number; slots: string[] };
        };
      };
      if (!response.ok) {
        if (body.error?.code === "BLOCK_IMPACTS_RESERVATIONS")
          setImpact(body.error.impact ?? null);
        throw new Error(
          body.error?.message ?? "No se pudo completar la operación.",
        );
      }
      setNotice(success);
      await Promise.all([loadMonth(), loadDay()]);
    } catch (e) {
      setNotice(
        e instanceof Error ? e.message : "No se pudo completar la operación.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function createBlock(confirmImpact = false) {
    if (!date) return;
    await mutate(
      "/api/admin/bloqueos",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          startTime: start,
          endTime: end,
          reason: reason.trim() || null,
          confirmImpact,
        }),
      },
      "Bloqueo creado correctamente.",
    );
    setImpact(null);
    setReason("");
  }
  async function removeBlock(id: string) {
    if (!window.confirm("¿Eliminar este bloqueo?")) return;
    await mutate(
      `/api/admin/bloqueos/${id}`,
      { method: "DELETE" },
      "Bloqueo eliminado.",
    );
  }
  async function saveReservation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!date || !selectedSlot) return;
    await mutate(
      "/api/admin/reservas",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceSlug,
          date,
          startTime: selectedSlot.startTime,
          fullName,
          phone,
          locality,
          peopleCount: Number(peopleCount),
          message: message.trim() || null,
          status,
        }),
      },
      "Reserva cargada correctamente.",
    );
    setSelectedSlot(null);
  }
  const firstDayOffset = days[0]
    ? (new Date(`${days[0].date}T00:00:00Z`).getUTCDay() + 6) % 7
    : 0;
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="card-shell p-4 sm:p-7 lg:col-span-2">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            className="secondary-button min-h-10"
            aria-label="Mes anterior"
            onClick={() => setMonth(shiftMonth(month, -1))}
          >
            ←
          </button>
          <h2 className="font-serif text-2xl capitalize text-[var(--earth)]">
            {monthTitle(month)}
          </h2>
          <button
            type="button"
            className="secondary-button min-h-10"
            aria-label="Mes siguiente"
            onClick={() => setMonth(shiftMonth(month, 1))}
          >
            →
          </button>
        </div>
        <div className="mt-5 grid grid-cols-7 gap-1 text-center text-[0.66rem] font-semibold uppercase tracking-wide text-[var(--muted-ink)] sm:gap-2 sm:text-xs">
          {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
            <span key={day}>{day}</span>
          ))}
          {Array.from({ length: firstDayOffset }, (_, i) => (
            <span key={`empty-${i}`} />
          ))}
          {days.map((day) => {
            const selected = day.date === date;
            const label = day.inSeason
              ? `${day.date.slice(-2)} de ${monthTitle(month)}, ${day.availableCount} de ${day.totalSlots} horarios disponibles`
              : `${day.date.slice(-2)} de ${monthTitle(month)}, fuera de temporada`;
            return (
              <button
                key={day.date}
                type="button"
                aria-label={label}
                aria-current={selected ? "date" : undefined}
                disabled={!day.inSeason || busy}
                onClick={() => selectDay(day.date)}
                className={`min-h-[4.6rem] rounded-xl border p-1 text-center transition sm:min-h-[5.8rem] sm:p-2 ${selected ? "border-[var(--gold-deep)] ring-2 ring-[rgba(190,153,52,0.25)]" : "border-[rgba(67,59,38,0.1)]"} ${!day.inSeason ? "cursor-default bg-black/[0.03] text-black/35" : day.availableCount === 0 ? "cursor-pointer bg-[rgba(243,191,191,0.3)] hover:shadow-[0_4px_12px_rgba(67,59,38,0.1)]" : day.availableCount < day.totalSlots ? "cursor-pointer bg-[rgba(243,226,145,0.35)] hover:shadow-[0_4px_12px_rgba(67,59,38,0.1)]" : "cursor-pointer bg-[rgba(180,225,192,0.3)] hover:shadow-[0_4px_12px_rgba(67,59,38,0.1)]"}`}
              >
                <span className="block text-base font-semibold sm:text-lg">
                  {Number(day.date.slice(-2))}
                </span>
                {day.inSeason ? (
                  <>
                    <span className="block text-[0.68rem] font-semibold sm:text-xs">
                      {day.availableCount}/{day.totalSlots} libres
                    </span>
                    <span className="hidden text-[0.62rem] text-[var(--muted-ink)] sm:block">
                      {day.reservedCount} reservas · {day.blockedCount}{" "}
                      bloqueados
                    </span>
                  </>
                ) : (
                  <span className="mt-1 block text-[0.6rem] leading-tight">
                    Fuera de temporada
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[var(--muted-ink)]">
          <span className="inline-flex items-center gap-1.5">
            <span data-calendar-legend-dot="available" aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-[rgba(180,225,192,0.72)]" />
            Disponible
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span data-calendar-legend-dot="partial" aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-[rgba(243,226,145,0.72)]" />
            Disponibilidad parcial
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span data-calendar-legend-dot="unavailable" aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-[rgba(243,191,191,0.72)]" />
            Sin disponibilidad
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span data-calendar-legend-dot="blocked" aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#ead1e8]" />
            Con bloqueo
          </span>
        </div>
      </section>
      <section className="card-shell p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <p className="label-chip">Detalle del día</p>
          {date && (
            <span className="text-sm font-semibold text-[var(--earth)]">
              {formatDate(date)}
            </span>
          )}
        </div>
        {!data ? (
          <p className="mt-6 text-sm text-[var(--muted-ink)]">
            Seleccioná un día de temporada para consultar sus 16 horarios.
          </p>
        ) : (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {data.slots.map((slot) =>
              slot.state === "AVAILABLE" ? (
                <button
                  type="button"
                  key={slot.startTime}
                  onClick={() => setSelectedSlot(slot)}
                  className="flex min-h-14 items-center justify-between rounded-2xl border border-black/10 bg-white/65 px-4 text-left"
                >
                  <span className="font-semibold">
                    {slot.startTime}–{slot.endTime}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${stateClass[slot.state]}`}
                  >
                    {stateLabel[slot.state]}
                  </span>
                </button>
              ) : slot.reservationId ? (
                <Link
                  key={slot.startTime}
                  href={`/admin/reservas/${slot.reservationId}`}
                  className="flex min-h-14 items-center justify-between rounded-2xl border border-black/10 bg-white/65 px-4"
                >
                  <span className="font-semibold">
                    {slot.startTime}–{slot.endTime}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${stateClass[slot.state]}`}
                  >
                    {stateLabel[slot.state]}
                  </span>
                </Link>
              ) : (
                <div
                  key={slot.startTime}
                  className="flex min-h-14 items-center justify-between rounded-2xl border border-black/10 bg-white/65 px-4"
                >
                  <span className="font-semibold">
                    {slot.startTime}–{slot.endTime}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${stateClass[slot.state]}`}
                  >
                    {stateLabel[slot.state]}
                  </span>
                </div>
              ),
            )}
          </div>
        )}
      </section>
      <section className="card-shell p-6 sm:p-8">
        <p className="label-chip">Nuevo bloqueo</p>
        <div className="mt-5 grid gap-3">
          <label className="text-sm font-semibold">
            Desde
            <select
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="mt-2 min-h-11 w-full rounded-2xl border px-3 font-normal"
            >
              {slots.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            Hasta
            <select
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="mt-2 min-h-11 w-full rounded-2xl border px-3 font-normal"
            >
              {slots.map((v, i) => (
                <option key={v}>
                  {i === 15 ? "22:00" : `${pad(i + 7)}:00`}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="secondary-button justify-center"
            onClick={() => {
              setStart("06:00");
              setEnd("22:00");
            }}
          >
            Bloquear día completo
          </button>
          <label className="text-sm font-semibold">
            Motivo (opcional)
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={200}
              className="mt-2 min-h-11 w-full rounded-2xl border px-3 font-normal"
            />
          </label>
          <button
            type="button"
            disabled={!date || busy}
            onClick={() => void createBlock()}
            className="primary-button justify-center"
          >
            Crear bloqueo
          </button>
        </div>
      </section>
      {impact && (
        <section className="card-shell border border-[#c99a3d] p-6 lg:col-span-2">
          <p>
            Este rango afecta {impact.count} reserva
            {impact.count === 1 ? "" : "s"} ({impact.slots.join(", ")}).
          </p>
          <button
            type="button"
            className="primary-button mt-4"
            onClick={() => void createBlock(true)}
          >
            Confirmar bloqueo igualmente
          </button>
        </section>
      )}
      {notice && (
        <p role="alert" className="text-sm text-[#A63232] lg:col-span-2">
          {notice}
        </p>
      )}
      {data?.blocks.length ? (
        <section className="card-shell p-6 sm:p-8 lg:col-span-2">
          <p className="label-chip">Bloqueos del día</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {data.blocks.map((block) => (
              <div
                key={block.id}
                className="flex items-center justify-between gap-3 rounded-2xl border p-4"
              >
                <div>
                  <p className="font-semibold">
                    {block.startTime}–{block.endTime}
                  </p>
                  {block.reason && (
                    <p className="text-sm text-[var(--muted-ink)]">
                      {block.reason}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => void removeBlock(block.id)}
                  className="text-sm font-semibold text-[#A63232] underline"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : null}
      {selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={saveReservation}
            className="max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto rounded-3xl bg-[var(--background)] p-6"
          >
            <h2 className="font-serif text-2xl">Cargar reserva manual</h2>
            <p className="mt-2 text-sm">
              {formatDate(date)} · {selectedSlot.startTime}–
              {selectedSlot.endTime}
            </p>
            <div className="mt-5 grid gap-3">
              {[
                ["Nombre completo", fullName, setFullName],
                ["Teléfono", phone, setPhone],
                ["Localidad", locality, setLocality],
              ].map(([label, value, setter]) => (
                <label key={label as string} className="text-sm font-semibold">
                  {label as string}
                  <input
                    required
                    value={value as string}
                    onChange={(e) =>
                      (setter as (v: string) => void)(e.target.value)
                    }
                    className="mt-2 min-h-11 w-full rounded-2xl border px-3 font-normal"
                  />
                </label>
              ))}
              <label className="text-sm font-semibold">
                Cantidad
                <select
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(e.target.value)}
                  className="mt-2 min-h-11 w-full rounded-2xl border px-3"
                >
                  <option value="1">1 persona</option>
                  <option value="2">2 personas</option>
                </select>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mensaje opcional"
                className="min-h-24 rounded-2xl border p-3"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setSelectedSlot(null)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={busy}
                >
                  Guardar reserva
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
