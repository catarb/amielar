import Link from "next/link";

import { getExperienceLabel } from "@/server/domain/reservations/experiences";
import { getAdminReservationDashboard, type AdminReservationListItem } from "@/server/services/admin-reservations";

export const dynamic = "force-dynamic";

function formatAdminDate(date: string): string {
  const [year, month, day] = date.split("-");
  return year && month && day ? `${day}/${month}/${year}` : date;
}

function statusLabel(status: AdminReservationListItem["status"]): string {
  return { PENDIENTE_PAGO: "Pendiente de pago", CONFIRMADA: "Confirmada", CANCELADA: "Cancelada" }[status];
}

function statusClass(status: AdminReservationListItem["status"]): string {
  return status === "CONFIRMADA" ? "bg-[rgba(180,225,192,0.52)] text-[#26744A]" : "bg-[rgba(243,226,145,0.62)] text-[#927009]";
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return <article className="rounded-3xl border border-[rgba(67,59,38,0.1)] bg-white/70 p-5 text-center shadow-[0_12px_28px_rgba(67,59,38,0.04)]"><p className="text-sm font-semibold text-[var(--muted-ink)]">{label}</p><p className="mt-3 font-serif text-4xl leading-none text-[var(--earth)]">{value}</p></article>;
}

function UpcomingReservation({ item }: { item: AdminReservationListItem }) {
  return <li className="flex flex-col gap-4 border-t border-[var(--line)] py-5 first:border-t-0 first:pt-0 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="text-sm font-semibold text-[var(--earth)]">{formatAdminDate(item.date)} · {item.startTime}–{item.endTime}</p><p className="mt-1 font-serif text-2xl text-[var(--ink)]">{getExperienceLabel(item.experienceSlug)}</p><p className="mt-1 text-sm text-[var(--muted-ink)]">{item.fullName} · {item.peopleCount} {item.peopleCount === 1 ? "persona" : "personas"}</p></div><div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-2"><span className={`inline-flex min-h-8 items-center justify-center rounded-full px-3 py-1.5 text-xs font-semibold ${statusClass(item.status)}`}>{statusLabel(item.status)}</span><Link href={`/admin/reservas/${item.id}`} className="text-sm font-semibold text-[var(--gold-deep)] underline-offset-4 hover:text-[var(--earth)] hover:underline">Ver detalle →</Link></div></li>;
}

export default async function AdminPage() {
  const dashboard = await getAdminReservationDashboard();
  return <section className="space-y-6">
    <div className="card-shell flex flex-col items-center p-6 text-center sm:p-8"><p className="label-chip">Base del panel</p><h1 className="mt-4 font-serif text-4xl leading-none text-[var(--ink)] sm:text-5xl">Bienvenida a AMIELAR</h1><p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted-ink)]">Un resumen de tus próximas reservas y accesos rápidos para gestionar la disponibilidad.</p></div>
    <section aria-labelledby="reservation-summary-title"><div className="mb-3 grid gap-2 text-center sm:grid-cols-[1fr_auto_1fr] sm:items-center"><h2 id="reservation-summary-title" className="font-serif text-3xl text-[var(--ink)] sm:col-start-2">Resumen de reservas</h2><Link href="/admin/reservas" className="justify-self-center text-sm font-semibold text-[var(--gold-deep)] underline-offset-4 hover:text-[var(--earth)] hover:underline sm:col-start-3 sm:row-start-1 sm:justify-self-end">Ver todas las reservas →</Link></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><SummaryCard label="Pendientes de pago" value={dashboard.pendingCount} /><SummaryCard label="Confirmadas" value={dashboard.confirmedCount} /><SummaryCard label="Próximas reservas" value={dashboard.upcomingCount} /></div></section>
    <section className="card-shell p-6 sm:p-8" aria-labelledby="upcoming-reservations-title"><div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left"><div><p className="label-chip">Agenda inmediata</p><h2 id="upcoming-reservations-title" className="mt-3 font-serif text-3xl text-[var(--ink)]">Próximas reservas</h2></div><Link href="/admin/reservas" className="text-sm font-semibold text-[var(--gold-deep)] underline-offset-4 hover:text-[var(--earth)] hover:underline">Ver todas →</Link></div>{dashboard.upcoming.length > 0 ? <ul className="mt-6">{dashboard.upcoming.map((item) => <UpcomingReservation key={item.id} item={item} />)}</ul> : <div className="mt-6 rounded-3xl border border-dashed border-[rgba(67,59,38,0.16)] bg-white/45 px-5 py-8 text-center"><p className="font-serif text-2xl text-[var(--ink)]">No hay próximas reservas.</p><p className="mt-2 text-sm text-[var(--muted-ink)]">Cuando ingrese una nueva solicitud, aparecerá aquí.</p></div>}</section>
    <section aria-labelledby="quick-access-title"><h2 id="quick-access-title" className="text-center font-serif text-3xl text-[var(--ink)]">Accesos rápidos</h2><div className="mt-3 grid gap-4 sm:grid-cols-2"><Link href="/admin/reservas" className="rounded-3xl border border-[rgba(67,59,38,0.1)] bg-white/60 p-5 text-center transition hover:border-[rgba(190,153,52,0.4)] hover:bg-white/85"><p className="text-sm font-semibold text-[var(--earth)]">Reservas</p><p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">Consultá, filtrá y gestioná las solicitudes recibidas.</p><p className="mt-4 text-sm font-semibold text-[var(--gold-deep)]">Ver reservas →</p></Link><Link href="/admin/disponibilidad" className="rounded-3xl border border-[rgba(67,59,38,0.1)] bg-white/60 p-5 text-center transition hover:border-[rgba(190,153,52,0.4)] hover:bg-white/85"><p className="text-sm font-semibold text-[var(--earth)]">Disponibilidad</p><p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">Administrá fechas y bloqueos del calendario.</p><p className="mt-4 text-sm font-semibold text-[var(--gold-deep)]">Gestionar disponibilidad →</p></Link></div></section>
  </section>;
}
