import Link from "next/link";

import {
  ADMIN_RESERVATIONS_PAGE_SIZE,
  listAdminReservations,
  parseAdminReservationFilters,
  type AdminReservationListItem,
} from "@/server/services/admin-reservations";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

function one(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function statusLabel(status: AdminReservationListItem["status"]): string {
  return { PENDIENTE_PAGO: "Pendiente de pago", CONFIRMADA: "Confirmada", CANCELADA: "Cancelada" }[status];
}

function statusClass(status: AdminReservationListItem["status"]): string {
  return status === "CONFIRMADA" ? "bg-[rgba(180,225,192,0.52)] text-[#26744A]" : status === "CANCELADA" ? "bg-[rgba(243,191,191,0.54)] text-[#A63232]" : "bg-[rgba(243,226,145,0.62)] text-[#927009]";
}

function buildPageHref(values: { q?: string; status?: string; date?: string; page?: number }): string {
  const params = new URLSearchParams();
  if (values.q) params.set("q", values.q);
  if (values.status) params.set("status", values.status);
  if (values.date) params.set("date", values.date);
  if (values.page && values.page > 1) params.set("page", String(values.page));
  const query = params.toString();
  return query ? `/admin/reservas?${query}` : "/admin/reservas";
}

function ReservationCard({ item }: { item: AdminReservationListItem }) {
  return (
    <article className="rounded-3xl border border-[rgba(67,59,38,0.1)] bg-white/65 p-5 shadow-[0_12px_28px_rgba(67,59,38,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-serif text-2xl text-[var(--ink)]">{item.fullName}</p>
          <p className="mt-1 text-sm text-[var(--muted-ink)]">{item.date} · {item.startTime} a {item.endTime}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(item.status)}`}>{statusLabel(item.status)}</span>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div><dt className="text-[var(--muted-ink)]">Localidad</dt><dd className="mt-1 font-semibold text-[var(--earth)]">{item.locality}</dd></div>
        <div><dt className="text-[var(--muted-ink)]">Personas</dt><dd className="mt-1 font-semibold text-[var(--earth)]">{item.peopleCount}</dd></div>
      </dl>
      <Link href={`/admin/reservas/${item.id}`} className="secondary-button mt-5 w-full justify-center">Ver detalle</Link>
    </article>
  );
}

export default async function AdminReservationsPage({ searchParams }: Props) {
  const raw = await searchParams;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    const first = one(value);
    if (first !== undefined) params.set(key, first);
  }
  const parsed = parseAdminReservationFilters(params);
  const current = { q: one(raw.q), status: one(raw.status), date: one(raw.date), page: Number(one(raw.page) ?? "1") };

  if ("error" in parsed) {
    return <section className="card-shell p-7 sm:p-10"><p className="label-chip">Reservas</p><h1 className="mt-5 font-serif text-4xl text-[var(--ink)]">Filtros no vÃ¡lidos</h1><p className="mt-4 text-[var(--muted-ink)]">RevisÃ¡ los filtros seleccionados.</p><Link href="/admin/reservas" className="primary-button mt-6">Limpiar filtros</Link></section>;
  }

  const result = await listAdminReservations(parsed.filters);
  const { pagination } = result;
  return (
    <section className="space-y-6">
      <div className="card-shell p-7 sm:p-9">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="label-chip">Lectura administrativa</p><h1 className="mt-5 font-serif text-5xl leading-none text-[var(--ink)]">Reservas</h1><p className="mt-4 text-sm text-[var(--muted-ink)]">Reservas reales registradas en AMIELAR.</p></div>
          <form method="get" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-xs font-semibold text-[var(--earth)] sm:col-span-2 lg:col-span-1">Buscar<input name="q" defaultValue={current.q} placeholder="Nombre, telÃ©fono o localidad" className="mt-2 min-h-11 w-full rounded-2xl border border-[rgba(67,59,38,0.14)] bg-white/80 px-3 text-sm font-normal" /></label>
            <label className="text-xs font-semibold text-[var(--earth)]">Estado<select name="status" defaultValue={current.status ?? ""} className="mt-2 min-h-11 w-full rounded-2xl border border-[rgba(67,59,38,0.14)] bg-white/80 px-3 text-sm font-normal"><option value="">Todos los estados</option><option value="PENDIENTE_PAGO">Pendiente de pago</option><option value="CONFIRMADA">Confirmada</option><option value="CANCELADA">Cancelada</option></select></label>
            <label className="text-xs font-semibold text-[var(--earth)]">Fecha<input name="date" type="date" defaultValue={current.date} className="mt-2 min-h-11 w-full rounded-2xl border border-[rgba(67,59,38,0.14)] bg-white/80 px-3 text-sm font-normal" /></label>
            <div className="flex items-end gap-2"><button type="submit" className="primary-button min-h-11 flex-1 justify-center">Filtrar</button><Link href="/admin/reservas" className="secondary-button min-h-11 px-4">Limpiar</Link></div>
          </form>
        </div>
      </div>

      {result.items.length === 0 ? <div className="card-shell p-10 text-center"><p className="font-serif text-3xl text-[var(--ink)]">{pagination.total === 0 && !current.q && !current.status && !current.date ? "TodavÃ­a no hay reservas registradas." : "No hay reservas para los filtros seleccionados."}</p></div> : <>
        <div className="hidden overflow-hidden rounded-[var(--radius-card)] border border-[var(--line)] bg-white/80 shadow-[var(--shadow-md)] md:block"><table className="min-w-full text-left text-sm"><thead className="bg-[rgba(250,249,246,0.9)] text-[var(--muted-ink)]"><tr><th className="px-6 py-4">Fecha</th><th className="px-6 py-4">Hora</th><th className="px-6 py-4">Nombre</th><th className="px-6 py-4">Localidad</th><th className="px-6 py-4">Personas</th><th className="px-6 py-4">Estado</th><th className="px-6 py-4">AcciÃ³n</th></tr></thead><tbody>{result.items.map((item) => <tr key={item.id} className="border-t border-[var(--line)]"><td className="px-6 py-5">{item.date}</td><td className="px-6 py-5">{item.startTime}–{item.endTime}</td><td className="px-6 py-5 font-semibold">{item.fullName}<span className="block text-xs font-normal text-[var(--muted-ink)]">{item.phone}</span></td><td className="px-6 py-5">{item.locality}</td><td className="px-6 py-5">{item.peopleCount}</td><td className="px-6 py-5"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(item.status)}`}>{statusLabel(item.status)}</span></td><td className="px-6 py-5"><Link href={`/admin/reservas/${item.id}`} className="font-semibold text-[var(--gold-deep)] underline-offset-4 hover:underline">Ver detalle</Link></td></tr>)}</tbody></table></div>
        <div className="grid gap-4 md:hidden">{result.items.map((item) => <ReservationCard key={item.id} item={item} />)}</div>
      </>}

      {pagination.totalPages > 1 ? <nav aria-label="PaginaciÃ³n de reservas" className="flex items-center justify-between gap-4"><Link aria-disabled={pagination.page <= 1} className={`secondary-button ${pagination.page <= 1 ? "pointer-events-none opacity-40" : ""}`} href={buildPageHref({ ...current, page: pagination.page - 1 })}>Anterior</Link><span className="text-sm text-[var(--muted-ink)]">PÃ¡gina {pagination.page} de {pagination.totalPages}</span><Link aria-disabled={pagination.page >= pagination.totalPages} className={`secondary-button ${pagination.page >= pagination.totalPages ? "pointer-events-none opacity-40" : ""}`} href={buildPageHref({ ...current, page: pagination.page + 1 })}>Siguiente</Link></nav> : null}
      <p className="text-xs text-[var(--muted-ink)]">{pagination.total} reserva{pagination.total === 1 ? "" : "s"} · {ADMIN_RESERVATIONS_PAGE_SIZE} por pÃ¡gina</p>
    </section>
  );
}
