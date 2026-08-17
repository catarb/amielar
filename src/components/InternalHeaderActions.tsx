"use client";

import { ArrowLeft } from "lucide-react";
import { MessageCircleMore } from "lucide-react";

import { ReserveLink } from "@/components/ReserveLink";
import { SectionLink } from "@/components/SectionLink";
import { WhatsAppLink } from "@/components/WhatsAppLink";

type InternalHeaderActionsProps = {
  homeHref: string;
  primaryLabel?: string;
  primaryMessage?: string;
  mobile?: boolean;
  onNavigate?: () => void;
};

export function InternalHeaderActions({
  homeHref,
  primaryLabel = "Reservar turno",
  primaryMessage,
  mobile = false,
  onNavigate,
}: InternalHeaderActionsProps) {
  const actionClass = (variant: "primary" | "secondary") =>
    `site-header-action site-header-action-${variant} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#be9934]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fbf8f1] ${
      mobile ? "site-header-action-mobile" : "whitespace-nowrap"
    }`;

  const primaryContent = (
    <>
      {primaryLabel}
      {primaryMessage ? <MessageCircleMore className="h-4 w-4" aria-hidden="true" /> : null}
    </>
  );

  return (
    <div
      className={`internal-header-actions ${
        mobile
          ? "mt-3 grid gap-2 border-t border-[rgba(67,59,38,0.09)] pt-3 sm:grid-cols-2"
          : "hidden shrink-0 items-center gap-2 xl:flex"
      }`}
    >
      <SectionLink
        href={homeHref}
        onNavigate={onNavigate}
        className={actionClass("secondary")}
      >
        <ArrowLeft className="h-4 w-4 text-[var(--olive)]" aria-hidden="true" />
        Volver al inicio
      </SectionLink>
      {primaryMessage ? (
        <WhatsAppLink
          message={primaryMessage}
          onClick={onNavigate}
          className={actionClass("primary")}
        >
          {primaryContent}
        </WhatsAppLink>
      ) : (
        <ReserveLink onNavigate={onNavigate} className={actionClass("primary")}>
          {primaryContent}
        </ReserveLink>
      )}
    </div>
  );
}
