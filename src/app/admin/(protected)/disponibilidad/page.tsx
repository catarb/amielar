import AdminAvailabilityManager from "@/components/AdminAvailabilityManager";

export const dynamic = "force-dynamic";

export default function AdminAvailabilityPage() {
  return <section className="space-y-6"><div className="card-shell p-7 sm:p-9"><p className="label-chip">Gestión administrativa</p><h1 className="mt-5 font-serif text-5xl leading-none text-[var(--ink)]">Disponibilidad</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--muted-ink)]">Consultá los 16 horarios de la jornada y bloqueá rangos cuando sea necesario.</p></div><AdminAvailabilityManager /></section>;
}
