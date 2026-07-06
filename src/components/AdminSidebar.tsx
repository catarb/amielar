import { CalendarDays, Cog, Package2, Plus, ScrollText } from "lucide-react";

const items = [
  { label: "Reservas", icon: ScrollText, active: true },
  { label: "Calendario", icon: CalendarDays },
  { label: "Productos", icon: Package2 },
  { label: "Configuracion", icon: Cog },
];

export function AdminSidebar() {
  return (
    <aside className="card-shell h-full p-6 md:p-7">
      <div>
        <p className="font-serif text-4xl leading-none text-[var(--earth)]">Panel admin</p>
        <p className="mt-2 text-sm text-[color:var(--muted-ink)]">AMIELAR · La Pampa Wellness</p>
      </div>

      <nav className="mt-10 space-y-2">
        {items.map(({ label, icon: Icon, active }) => (
          <a
            key={label}
            href="#panel-admin"
            className={`flex items-center gap-3 rounded-2xl px-4 py-4 text-sm font-medium transition ${
              active
                ? "bg-[rgba(212,162,59,0.14)] text-[var(--gold-deep)]"
                : "text-[color:var(--muted-ink)] hover:bg-[rgba(255,255,255,0.8)]"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </a>
        ))}
      </nav>

      <button className="primary-button mt-10 w-full justify-center">
        <Plus className="h-4 w-4" />
        Nueva reserva
      </button>
    </aside>
  );
}
