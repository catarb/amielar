export const dynamic = "force-dynamic";

import Link from "next/link";

export default function AdminPage() {
  return (
    <section className="card-shell p-7 sm:p-10">
      <p className="label-chip">Base del panel</p>
      <h1 className="mt-6 font-serif text-5xl leading-none text-[var(--ink)]">Bienvenida a AMIELAR</h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted-ink)]">
        Desde aquÃ­ vas a poder gestionar las reservas y la disponibilidad de AMIELAR.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/admin/reservas" className="rounded-3xl border border-[rgba(67,59,38,0.1)] bg-white/55 p-5 transition hover:border-[rgba(190,153,52,0.4)] hover:bg-white/80">
          <p className="text-sm font-semibold text-[var(--earth)]">Reservas</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">Gestionar reservas reales.</p>
        </Link>
        <div className="rounded-3xl border border-[rgba(67,59,38,0.1)] bg-white/55 p-5">
          <p className="text-sm font-semibold text-[var(--earth)]">Disponibilidad</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">PrÃ³ximamente.</p>
        </div>
      </div>
    </section>
  );
}
