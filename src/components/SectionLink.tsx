"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  PENDING_SECTION_KEY,
  scrollToSection,
  scrollToSectionAfterLayout,
} from "@/lib/scroll-to-reservation";

type SectionLinkProps = {
  children: ReactNode;
  className?: string;
  href: string;
  afterLayout?: boolean;
  onNavigate?: () => void;
};

export function SectionLink({ children, className, href, afterLayout = false, onNavigate }: SectionLinkProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isLandingAnchor = href.startsWith("#");
  const isOnLanding = pathname === "/";
  const resolvedHref = isLandingAnchor && !isOnLanding ? `/${href}` : href;
  const hashIndex = resolvedHref.indexOf("#");
  const targetHash = hashIndex >= 0 ? resolvedHref.slice(hashIndex) : "";
  const targetPath = hashIndex >= 0 ? resolvedHref.slice(0, hashIndex) || pathname : resolvedHref;
  const isSamePath = targetPath === pathname;

  return (
    <a
      href={resolvedHref}
      className={className}
      onClick={(event) => {
        onNavigate?.();

        if (!targetHash) {
          return;
        }

        const isModifiedClick =
          event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

        if (isModifiedClick) {
          return;
        }

        if (!isSamePath) {
          event.preventDefault();
          window.sessionStorage.setItem(PENDING_SECTION_KEY, targetHash);
          router.push(targetPath);
          return;
        }

        if (afterLayout) {
          scrollToSectionAfterLayout(targetHash, event);
        } else {
          scrollToSection(targetHash, event);
        }
      }}
    >
      {children}
    </a>
  );
}
