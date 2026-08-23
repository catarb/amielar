"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavigationKey = "home" | "reservations" | "availability";

export function getAdminNavigationState(pathname: string): Record<NavigationKey, boolean> {
  return { home: pathname === "/admin", reservations: pathname === "/admin/reservas" || pathname.startsWith("/admin/reservas/"), availability: pathname === "/admin/disponibilidad" || pathname.startsWith("/admin/disponibilidad/") };
}

function navigationClassName(active: boolean): string {
  return active ? "rounded-full bg-[rgba(212,162,59,0.14)] px-4 py-2 text-[var(--gold-deep)] transition hover:bg-[rgba(212,162,59,0.22)]" : "rounded-full px-4 py-2 text-[var(--earth)] transition hover:bg-white/70";
}

export function AdminNavigation() {
  const active = getAdminNavigationState(usePathname());
  return <nav aria-label="Navegación administrativa" className="mt-4 flex flex-wrap items-center justify-center gap-1.5 px-1 text-sm font-semibold"><Link href="/admin" className={navigationClassName(active.home)} aria-current={active.home ? "page" : undefined}>Inicio</Link><Link href="/admin/reservas" className={navigationClassName(active.reservations)} aria-current={active.reservations ? "page" : undefined}>Reservas</Link><Link href="/admin/disponibilidad" className={navigationClassName(active.availability)} aria-current={active.availability ? "page" : undefined}>Disponibilidad</Link></nav>;
}
