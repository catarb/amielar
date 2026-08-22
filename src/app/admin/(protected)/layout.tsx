import { redirect } from "next/navigation";
import Link from "next/link";

import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { getAdminSession } from "@/server/auth/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <main className="relative z-10 min-h-screen px-5 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="card-shell flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="label-chip">AMIELAR · Administración</p>
            <p className="mt-4 font-serif text-4xl leading-none text-[var(--earth)]">Panel administrativo</p>
          </div>
          <AdminLogoutButton />
        </header>
        <nav aria-label="NavegaciÃ³n administrativa" className="mt-4 flex flex-wrap items-center gap-2 px-1 text-sm font-semibold">
          <Link href="/admin" className="rounded-full px-4 py-2 text-[var(--earth)] transition hover:bg-white/70">Inicio</Link>
          <Link href="/admin/reservas" className="rounded-full bg-[rgba(212,162,59,0.14)] px-4 py-2 text-[var(--gold-deep)] transition hover:bg-[rgba(212,162,59,0.22)]">Reservas</Link>
          <Link href="/admin/disponibilidad" className="rounded-full px-4 py-2 text-[var(--earth)] transition hover:bg-white/70">Disponibilidad</Link>
        </nav>
        <div className="mt-6">{children}</div>
      </div>
    </main>
  );
}
