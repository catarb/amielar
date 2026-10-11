import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/AdminLoginForm";
import { getAdminSession } from "@/server/auth/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin");

  return (
    <main className="admin-shell relative z-10 flex min-h-screen items-center justify-center px-5 py-12">
      <section className="card-shell flex w-full max-w-md flex-col items-center p-7 text-center sm:p-10">
        <p className="label-chip">AMIELAR · Administración</p>
        <h1 className="mt-5 admin-title text-[clamp(1.6rem,7vw,2.25rem)] leading-tight text-[var(--ink)]">Ingresar al panel</h1>
        <p className="mt-3 max-w-[34ch] text-sm leading-6 text-[var(--muted-ink)]">Acceso privado para administrar la experiencia AMIELAR.</p>
        <AdminLoginForm />
      </section>
    </main>
  );
}
