import AdminAvailabilityManager from "@/components/AdminAvailabilityManager";

export const dynamic = "force-dynamic";

export default function AdminAvailabilityPage() {
  return <section className="space-y-6"><div className="card-shell flex flex-col items-center p-7 text-center sm:p-9"><p className="label-chip">Gestión administrativa</p><h1 className="mt-4 font-serif text-4xl leading-none text-[var(--ink)] sm:text-5xl">Disponibilidad</h1><p className="mx-auto mt-3 w-full max-w-[38rem] px-2 text-sm leading-6 text-[var(--muted-ink)]">Consultá los 16 horarios de la jornada y bloqueá rangos cuando sea necesario.</p></div><AdminAvailabilityManager /></section>;
}
