import { formatInTimeZone } from "date-fns-tz";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAdminReservationById } from "@/server/services/admin-reservations";
import { TIMEZONE, type ReservationStatus } from "@/server/domain/reservations/constants";
import { AdminReservationActions } from "@/components/AdminReservationActions";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

function statusLabel(status: ReservationStatus): string {
  return { PENDIENTE_PAGO: "Pendiente de pago", CONFIRMADA: "Confirmada", CANCELADA: "Cancelada" }[status];
}

export default async function AdminReservationDetailPage({ params }: Props) {
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) notFound();
  const reservation = await getAdminReservationById(id);
  if (!reservation) notFound();

  return (
    <section className="card-shell p-7 sm:p-10">
      <Link href="/admin/reservas" className="text-sm font-semibold text-[var(--gold-deep)] hover:underline">← Volver a reservas</Link>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="label-chip">Reserva</p><h1 className="mt-5 font-serif text-5xl leading-none text-[var(--ink)]">{reservation.fullName}</h1></div><span className="w-fit rounded-full bg-[rgba(243,226,145,0.62)] px-4 py-2 text-sm font-semibold text-[#927009]">{statusLabel(reservation.status)}</span></div>
      <dl className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div><dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-ink)]">Fecha</dt><dd className="mt-2 text-lg text-[var(--earth)]">{reservation.date}</dd></div>
        <div><dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-ink)]">Horario</dt><dd className="mt-2 text-lg text-[var(--earth)]">{reservation.startTime} a {reservation.endTime}</dd></div>
        <div><dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-ink)]">Personas</dt><dd className="mt-2 text-lg text-[var(--earth)]">{reservation.peopleCount}</dd></div>
        <div><dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-ink)]">TelÃ©fono</dt><dd className="mt-2 text-lg text-[var(--earth)]"><a href={`tel:${reservation.phone}`} className="hover:text-[var(--gold-deep)]">{reservation.phone}</a></dd></div>
        <div><dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-ink)]">Localidad</dt><dd className="mt-2 text-lg text-[var(--earth)]">{reservation.locality}</dd></div>
        <div><dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-ink)]">Recibida</dt><dd className="mt-2 text-lg text-[var(--earth)]">{formatInTimeZone(new Date(reservation.createdAt), TIMEZONE, "dd/MM/yyyy HH:mm")}</dd></div>
      </dl>
      <div className="mt-10 border-t border-[var(--line)] pt-7"><h2 className="font-serif text-3xl text-[var(--ink)]">Mensaje</h2><p className="mt-3 whitespace-pre-wrap text-base leading-7 text-[var(--muted-ink)]">{reservation.message || "Sin mensaje adicional."}</p></div>
      <AdminReservationActions id={reservation.id} status={reservation.status} />
    </section>
  );
}
