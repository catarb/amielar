"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[rgba(67,59,38,0.13)] bg-white/70 px-5 text-sm font-semibold text-[var(--earth)] transition hover:bg-white disabled:cursor-wait disabled:opacity-60"
    >
      <LogOut className="h-4 w-4" />
      {isLoggingOut ? "Cerrando..." : "Cerrar sesión"}
    </button>
  );
}
