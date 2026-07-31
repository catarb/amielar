"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { PENDING_SECTION_KEY, scrollToSection } from "@/lib/scroll-to-reservation";

export function RouteAnchorRestorer() {
  const pathname = usePathname();

  useEffect(() => {
    const pendingSection = window.sessionStorage.getItem(PENDING_SECTION_KEY);
    const isInternalPage = pathname === "/aire-de-colmena" || pathname === "/nuestra-historia";
    const shouldRestoreCurrentHash = isInternalPage && window.innerWidth < 768;
    const targetHash = pendingSection ?? (shouldRestoreCurrentHash ? window.location.hash : "");
    if (!targetHash) return;

    const target = document.getElementById(targetHash.replace(/^#/, ""));
    if (!target) return;

    if (pendingSection) {
      window.sessionStorage.removeItem(PENDING_SECTION_KEY);
    }

    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => scrollToSection(targetHash));
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
