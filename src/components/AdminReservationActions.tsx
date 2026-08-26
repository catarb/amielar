"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { ReservationStatus } from "@/server/domain/reservations/constants";

type Props = { id: string; status: ReservationStatus };
type Action = "confirm" | "cancel" | "delete";

const copy = {
  confirm: { title: "Confirmar pago y reserva", text: "Confirmá esta reserva solo si ya verificaste el pago.", confirm: "Confirmar reserva", loading: "Confirmando..." },
  cancel: { title: "Cancelar reserva", text: "La reserva dejará de ocupar este horario y el turno podrá volver a reservarse.", confirm: "Cancelar reserva", loading: "Cancelando..." },
  delete: { title: "Eliminar reserva", text: "La reserva dejará de aparecer en el panel y el horario quedará liberado. Esta acción no tendrá restauración desde el panel en esta versión.", confirm: "Eliminar reserva", loading: "Eliminando..." },
} as const;

export function AdminReservationActions({ id, status }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<Action | null>(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");

  const actions: Action[] = status === "PENDIENTE_PAGO" ? ["confirm", "cancel", "delete"] : status === "CONFIRMADA" ? ["cancel", "delete"] : ["delete"];

  async function execute(action: Action) {
    if (busy) return;
    setBusy(true);
    setFeedback("");
    try {
      const response = await fetch(`/api/admin/reservas/${id}`, {
        method: action === "delete" ? "DELETE" : "PATCH",
        headers: action === "delete" ? undefined : { "Content-Type": "application/json" },
        body: action === "delete" ? undefined : JSON.stringify({ action }),
      });
      if (response.ok) {
        if (action === "delete") { router.replace("/admin/reservas"); return; }
        setSelected(null);
        setFeedback(action === "confirm" ? "Reserva confirmada correctamente." : "Reserva cancelada correctamente.");
        router.refresh();
        return;
      }
      if (response.status === 401) { router.replace("/admin/login"); return; }
      if (response.status === 403) setFeedback("No pudimos validar la solicitud. Actualizá la página e intentá nuevamente.");
      else if (response.status === 404) setFeedback("La reserva ya no está disponible.");
      else if (response.status === 409) setFeedback("La reserva no puede pasar a ese estado.");
      else setFeedback("No pudimos actualizar la reserva. Intentá nuevamente.");
    } catch { setFeedback("No pudimos actualizar la reserva. Intentá nuevamente."); }
    finally { setBusy(false); }
  }

  return <div className="mt-10 border-t border-[var(--line)] pt-7"><p className="text-sm font-semibold text-[var(--earth)]">Acciones administrativas</p><p className="mt-2 text-sm text-[var(--muted-ink)]">Marcá la reserva como confirmada únicamente cuando hayas verificado el pago.</p><div className="mt-5 flex flex-wrap gap-3">{actions.map((action) => <button key={action} type="button" onClick={() => setSelected(action)} disabled={busy} className={action === "delete" ? "secondary-button border-[#c55f51]/30 text-[#a3483d]" : "primary-button"}>{action === "confirm" ? "Confirmar pago y reserva" : action === "cancel" ? "Cancelar reserva" : "Eliminar reserva"}</button>)}</div>{feedback ? <p role="status" className="mt-4 rounded-2xl bg-[rgba(166,185,129,0.18)] px-4 py-3 text-sm text-[var(--olive)]">{feedback}</p> : null}{selected ? <div role="dialog" aria-modal="true" aria-labelledby="reservation-action-title" className="mt-5 rounded-3xl border border-[rgba(190,153,52,0.3)] bg-[rgba(255,252,242,0.96)] p-5"><h2 id="reservation-action-title" className="font-serif text-3xl text-[var(--ink)]">{copy[selected].title}</h2><p className="mt-3 text-sm leading-6 text-[var(--muted-ink)]">{copy[selected].text}</p><div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => setSelected(null)} disabled={busy} className="secondary-button">Volver</button><button type="button" onClick={() => execute(selected)} disabled={busy} className="primary-button">{busy ? copy[selected].loading : copy[selected].confirm}</button></div></div> : null}</div>;
}
