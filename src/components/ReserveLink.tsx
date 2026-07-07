"use client";

import { ReactNode } from "react";

import { SectionLink } from "@/components/SectionLink";

type ReserveLinkProps = {
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
};

export function ReserveLink({ children, className, onNavigate }: ReserveLinkProps) {
  return (
    <SectionLink href="#reserva" className={className} onNavigate={onNavigate}>
      {children}
    </SectionLink>
  );
}
