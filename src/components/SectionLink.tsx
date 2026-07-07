"use client";

import { ReactNode } from "react";

import { scrollToSection } from "@/lib/scroll-to-reservation";

type SectionLinkProps = {
  children: ReactNode;
  className?: string;
  href: string;
  onNavigate?: () => void;
};

export function SectionLink({ children, className, href, onNavigate }: SectionLinkProps) {
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        onNavigate?.();
        scrollToSection(href, event);
      }}
    >
      {children}
    </a>
  );
}
