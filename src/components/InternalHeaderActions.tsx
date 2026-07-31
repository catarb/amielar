"use client";

import { ArrowLeft } from "lucide-react";

import { ReserveLink } from "@/components/ReserveLink";
import { SectionLink } from "@/components/SectionLink";

type InternalHeaderActionsProps = {
  homeHref: string;
  mobile?: boolean;
  onNavigate?: () => void;
};

export function InternalHeaderActions({
  homeHref,
  mobile = false,
  onNavigate,
}: InternalHeaderActionsProps) {
  return (
    <div
      className={`internal-header-actions ${
        mobile
          ? "mt-3 grid gap-2 border-t border-[rgba(67,59,38,0.09)] pt-3 sm:grid-cols-2"
          : "hidden shrink-0 items-center gap-1.5 xl:flex"
      }`}
    >
      <SectionLink
        href={homeHref}
        onNavigate={onNavigate}
        className={`site-header-action site-header-action-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#be9934]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fbf8f1] ${
          mobile ? "site-header-action-mobile" : "whitespace-nowrap"
        }`}
      >
        <ArrowLeft className={mobile ? "h-4 w-4 text-[var(--olive)]" : "h-3.5 w-3.5 text-[var(--olive)]"} />
        Volver al inicio
      </SectionLink>
      <ReserveLink
        onNavigate={onNavigate}
        className={`site-header-action site-header-action-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#be9934]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fbf8f1] ${
          mobile ? "site-header-action-mobile" : "whitespace-nowrap"
        }`}
      >
        Reservar turno
      </ReserveLink>
    </div>
  );
}
