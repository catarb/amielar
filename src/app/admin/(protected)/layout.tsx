import { redirect } from "next/navigation";

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
        <div className="mt-6">{children}</div>
      </div>
    </main>
  );
}
