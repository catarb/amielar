import { MoreVertical, Search } from "lucide-react";

import { adminMetrics, reservations } from "@/data/site";

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="card-shell p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <span className="label-chip">Panel administrativo</span>
            <h3 className="mt-4 font-serif text-4xl text-[var(--ink)]">Gestion de reservas</h3>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[color:var(--muted-ink)]">
              Administra sesiones de api-inhalacion, disponibilidad y proximas visitas con una interfaz consistente con la identidad de marca.
            </p>
          </div>
          <button className="primary-button">Nueva reserva</button>
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-3">
          {adminMetrics.map(({ label, value, tone, detail, icon: Icon }) => (
            <article key={label} className="rounded-[28px] border border-[rgba(67,59,38,0.1)] bg-white p-6 shadow-[0_20px_40px_rgba(67,59,38,0.06)]">
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                    tone === "sage"
                      ? "bg-[rgba(166,185,129,0.26)] text-[var(--olive)]"
                      : tone === "rose"
                        ? "bg-[rgba(238,197,188,0.34)] text-[#C55F51]"
                        : "bg-[rgba(212,162,59,0.2)] text-[var(--gold-deep)]"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-[rgba(250,249,246,0.95)] px-3 py-1 text-xs text-[color:var(--muted-ink)]">
                  {detail}
                </span>
              </div>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-ink)]">{label}</p>
              <p className="mt-3 font-serif text-6xl text-[var(--gold-deep)]">{value}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="card-shell overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-[rgba(67,59,38,0.08)] p-6 md:flex-row md:items-center md:justify-between">
          <h4 className="font-serif text-3xl text-[var(--ink)]">Proximas reservas</h4>
          <label className="flex items-center gap-3 rounded-full border border-[rgba(67,59,38,0.12)] bg-white px-4 py-3 text-sm text-[color:var(--muted-ink)]">
            <Search className="h-4 w-4" />
            <input type="search" placeholder="Buscar cliente..." className="w-full bg-transparent outline-none md:w-56" />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[rgba(250,249,246,0.9)] text-[color:var(--muted-ink)]">
              <tr>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Fecha</th>
                <th className="px-6 py-4 font-medium">Horario</th>
                <th className="px-6 py-4 font-medium">Sesion</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={`${reservation.client}-${reservation.time}`} className="border-t border-[rgba(67,59,38,0.08)]">
                  <td className="px-6 py-5">
                    <p className="font-medium text-[var(--ink)]">{reservation.client}</p>
                    <p className="text-xs text-[color:var(--muted-ink)]">{reservation.email}</p>
                  </td>
                  <td className="px-6 py-5 text-[var(--ink)]">{reservation.date}</td>
                  <td className="px-6 py-5 text-[var(--ink)]">{reservation.time}</td>
                  <td className="px-6 py-5 text-[var(--ink)]">{reservation.session}</td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        reservation.status === "Confirmada"
                          ? "bg-[rgba(180,225,192,0.52)] text-[#26744A]"
                          : reservation.status === "Pendiente"
                            ? "bg-[rgba(243,226,145,0.62)] text-[#927009]"
                            : "bg-[rgba(243,191,191,0.54)] text-[#A63232]"
                      }`}
                    >
                      {reservation.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <button className="rounded-full p-2 text-[color:var(--muted-ink)] transition hover:bg-[rgba(250,249,246,0.9)]">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
