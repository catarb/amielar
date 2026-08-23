import { redirect } from "next/navigation";

import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { AdminNavigation } from "@/components/AdminNavigation";
import { getAdminSession } from "@/server/auth/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <main className="relative z-10 min-h-screen px-4 py-5 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="card-shell flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="label-chip">AMIELAR · ADMINISTRACIÓN</p>
            <p className="mt-3 font-serif text-3xl leading-none text-[var(--earth)] sm:text-4xl">Panel administrativo</p>
          </div>
          <AdminLogoutButton />
        </header>
        <AdminNavigation />
        <div className="mt-5">{children}</div>
      </div>
    </main>
  );
}
