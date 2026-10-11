import { redirect } from "next/navigation";

import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { AdminNavigation } from "@/components/AdminNavigation";
import { getAdminSession } from "@/server/auth/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <main className="admin-shell relative z-10 min-h-screen px-4 py-5 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="admin-header card-shell grid grid-cols-1 justify-items-center gap-4 p-5 text-center sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center">
          <div className="hidden lg:block" aria-hidden="true" />
          <div className="flex min-w-0 flex-col items-center lg:col-start-2">
            <p className="label-chip">AMIELAR · ADMINISTRACIÓN</p>
            <p className="mt-3 admin-title text-3xl leading-none text-[var(--earth)] sm:text-4xl">Panel administrativo</p>
          </div>
          <div className="lg:col-start-3 lg:row-start-1 lg:justify-self-end"><AdminLogoutButton /></div>
        </header>
        <AdminNavigation />
        <div className="mt-5">{children}</div>
      </div>
    </main>
  );
}
