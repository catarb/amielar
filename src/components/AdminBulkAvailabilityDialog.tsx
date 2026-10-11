"use client";

import { useEffect, useRef, useState } from "react";

type Action = "AVAILABLE" | "BLOCKED";
type Range = { startTime: string; endTime: string; action: Action };
type Result = { updated: number; reserved: number; unchanged: number };
const weekdays = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const hour = (value: number) => `${String(value).padStart(2, "0")}:00`;
const starts = Array.from({ length: 16 }, (_, index) => hour(index + 6));
const ends = Array.from({ length: 16 }, (_, index) => hour(index + 7));

export function getWeekdayDates(month: string, weekday: number): string[] {
  const [year, monthNumber] = month.split("-").map(Number);
  return Array.from({ length: new Date(Date.UTC(year, monthNumber, 0)).getUTCDate() }, (_, index) => `${month}-${String(index + 1).padStart(2, "0")}`)
    .filter((date) => new Date(`${date}T00:00:00Z`).getUTCDay() === weekday);
}

export default function AdminBulkAvailabilityDialog({ month, weekday, onClose, onApplied }: {
  month: string;
  weekday: number | null;
  onClose: () => void;
  onApplied: (result: Result) => Promise<void>;
}) {
  const [ranges, setRanges] = useState<Range[]>([{ startTime: "10:00", endTime: "18:00", action: "AVAILABLE" }]);
  const [monthAction, setMonthAction] = useState<Action | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const inFlight = useRef(false);
  const dialog = useRef<HTMLDivElement>(null);
  const title = new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${month}-01T00:00:00Z`));
  const dates = weekday === null ? [] : getWeekdayDates(month, weekday);
  const rangeHours = ranges.map((range) => ({ start: Number(range.startTime.slice(0, 2)), end: Number(range.endTime.slice(0, 2)) }));
  const invalid = ranges.some((range, index) => rangeHours[index].start >= rangeHours[index].end || ranges.some((other, otherIndex) => otherIndex !== index && range.startTime < other.endTime && other.startTime < range.endTime));

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.querySelector<HTMLElement>("button")?.focus();
    const keyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !inFlight.current) { event.preventDefault(); onClose(); }
      if (event.key !== "Tab" || !dialog.current) return;
      const focusable = [...dialog.current.querySelectorAll<HTMLElement>("button:not([disabled]), select:not([disabled])")];
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", keyDown);
    return () => { document.removeEventListener("keydown", keyDown); previous?.focus(); };
  }, [onClose]);

  function editRange(index: number, changes: Partial<Range>) { setRanges((current) => current.map((range, i) => i === index ? { ...range, ...changes } : range)); }
  async function apply(action: Action | null) {
    if (inFlight.current || (weekday !== null && invalid) || !action && weekday === null) return;
    inFlight.current = true;
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/admin/disponibilidad/masiva", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, ...(weekday !== null ? { weekday } : {}), ranges: weekday === null ? [{ startTime: "06:00", endTime: "22:00", action }] : ranges }),
      });
      if (!response.ok) throw new Error("No se pudo actualizar la disponibilidad. No se aplicaron todos los cambios.");
      await onApplied(await response.json() as Result);
    } catch { setError("No se pudo actualizar la disponibilidad. Revisá el calendario antes de reintentar."); }
    finally { inFlight.current = false; setPending(false); }
  }

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
    <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="bulk-title" aria-describedby="bulk-description" className="admin-bulk-dialog max-h-[calc(100dvh-1.5rem)] w-full max-w-xl overflow-y-auto rounded-3xl bg-[var(--background)] p-5 shadow-xl sm:p-7">
      <h2 id="bulk-title" className="admin-title mx-auto max-w-[32rem] text-center text-[1.35rem] leading-snug text-[var(--earth)] sm:text-2xl">{weekday === null ? `Gestionar ${title}` : `Editar todos los ${weekdays[weekday]} de ${title}`}</h2>
      <p id="bulk-description" className="mx-auto mt-3 max-w-[31rem] text-center text-sm leading-relaxed text-[var(--muted-ink)]">
        {weekday === null ? "Aplicar una acción a todos los días de este mes." : `Se aplicará a: ${dates.map((date) => Number(date.slice(-2))).join(", ")} de ${title}.`}
        {" "}Las reservas existentes se conservarán automáticamente.
      </p>
      {weekday === null ? monthAction === null ? <div className="mx-auto mt-6 grid w-full max-w-xs gap-3">
        <button type="button" className="secondary-button justify-center" onClick={() => setMonthAction("BLOCKED")}>Bloquear todo el mes</button>
        <button type="button" className="secondary-button justify-center" onClick={() => setMonthAction("AVAILABLE")}>Habilitar todo el mes</button>
      </div> : <div className="mx-auto mt-6 max-w-[31rem] rounded-2xl border border-[var(--gold-deep)] p-4 text-center">
        <p className="font-semibold">¿{monthAction === "BLOCKED" ? "Bloquear" : "Habilitar"} todo {title}?</p>
        <p className="mt-2 text-sm">Se actualizarán los horarios administrables del mes. Las reservas se conservarán.</p>
        <div className="admin-bulk-dialog-actions mt-4 flex flex-wrap justify-center gap-3">
          <button type="button" className="secondary-button" disabled={pending} onClick={() => setMonthAction(null)}>Volver</button>
          <button type="button" className="primary-button" disabled={pending} onClick={() => void apply(monthAction)}>{pending ? "Aplicando cambios..." : `Sí, ${monthAction === "BLOCKED" ? "bloquear" : "habilitar"} el mes`}</button>
        </div>
      </div> : <>
        <div className="mt-5 grid gap-3">
          {ranges.map((range, index) => <div key={index} className="grid gap-3 rounded-2xl border border-black/10 p-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">Desde<select aria-label={`Desde rango ${index + 1}`} className="mt-2 min-h-11 w-full rounded-xl border px-3" value={range.startTime} onChange={(event) => editRange(index, { startTime: event.target.value })}>{starts.map((value) => <option key={value}>{value}</option>)}</select></label>
            <label className="text-sm font-semibold">Hasta<select aria-label={`Hasta rango ${index + 1}`} className="mt-2 min-h-11 w-full rounded-xl border px-3" value={range.endTime} onChange={(event) => editRange(index, { endTime: event.target.value })}>{ends.map((value) => <option key={value}>{value}</option>)}</select></label>
            <label className="text-sm font-semibold sm:col-span-2">Acción<select aria-label={`Acción rango ${index + 1}`} className="mt-2 min-h-11 w-full rounded-xl border px-3" value={range.action} onChange={(event) => editRange(index, { action: event.target.value as Action })}><option value="AVAILABLE">Dejar disponible</option><option value="BLOCKED">Bloquear</option></select></label>
            {ranges.length > 1 && <button type="button" className="secondary-button justify-center sm:col-span-2" onClick={() => setRanges((current) => current.filter((_, i) => i !== index))}>Eliminar rango {index + 1}</button>}
          </div>)}
        </div>
        <div className="mt-4 flex justify-center"><button type="button" className="secondary-button justify-center" disabled={ranges.length >= 16} onClick={() => setRanges((current) => [...current, { startTime: "06:00", endTime: "07:00", action: "AVAILABLE" }])}>+ Agregar otro rango</button></div>
        {invalid && <p role="alert" className="mt-3 text-sm text-[#A63232]">Revisá los rangos: las horas deben ser distintas y no pueden superponerse.</p>}
      </>}
      {error && <p role="alert" className="mt-4 text-sm text-[#A63232]">{error}</p>}
      <div className="admin-bulk-dialog-actions mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" className="secondary-button" disabled={pending} onClick={onClose}>Cancelar</button>
        {weekday !== null && <button type="button" className="primary-button" disabled={pending || invalid} onClick={() => void apply(null)}>{pending ? "Aplicando cambios..." : `Aplicar a todos los ${weekdays[weekday]}`}</button>}
      </div>
    </div>
  </div>;
}
