"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";

import { ReserveLink } from "@/components/ReserveLink";
import { SectionLink } from "@/components/SectionLink";
import { mobileNavLinks, primaryNavLinks } from "@/data/site";

const DEFAULT_ACTIVE = "#historia";
const INSTAGRAM_URL = "https://www.instagram.com/amielarargentina/";
const SOCIAL_BUTTON_CLASS =
  "site-icon-button";
const SOCIAL_ICON_CLASS = "h-5 w-5 text-[var(--olive)]";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState(DEFAULT_ACTIVE);
  const headerRef = useRef<HTMLElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  const closeMenu = (restoreFocus = false) => {
    setOpen(false);

    if (restoreFocus) {
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
  };

  useEffect(() => {
    const updateHeaderOffset = () => {
      if (!headerRef.current) return;
      const { height } = headerRef.current.getBoundingClientRect();
      document.documentElement.style.setProperty("--header-offset", `${Math.ceil(height)}px`);
    };

    const syncScrollState = () => {
      setScrolled(window.scrollY > 18);
    };

    const syncActiveHash = () => {
      const visibleSection = [...mobileNavLinks]
        .reverse()
        .find((link) => {
          const element = document.querySelector(link.href);
          if (!element) return false;
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom > 150;
        })?.href;

      setActiveHash(window.location.hash || visibleSection || DEFAULT_ACTIVE);
    };

    updateHeaderOffset();
    syncScrollState();
    syncActiveHash();

    const resizeObserver = new ResizeObserver(updateHeaderOffset);
    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }

    window.addEventListener("scroll", syncScrollState, { passive: true });
    window.addEventListener("scroll", syncActiveHash, { passive: true });
    window.addEventListener("hashchange", syncActiveHash);
    window.addEventListener("resize", updateHeaderOffset);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", syncScrollState);
      window.removeEventListener("scroll", syncActiveHash);
      window.removeEventListener("hashchange", syncActiveHash);
      window.removeEventListener("resize", updateHeaderOffset);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    const closeMenuOnDesktop = () => {
      if (window.innerWidth >= 1024) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", closeMenuOnDesktop);
    return () => window.removeEventListener("resize", closeMenuOnDesktop);
  }, []);

  return (
    <>
      <header ref={headerRef} data-site-header="true" className="sticky top-0 z-50 pt-3 md:pt-4">
        <div
          className={`site-header-shell mx-auto flex w-[calc(100%-24px)] max-w-[1440px] items-center justify-between border px-4 sm:w-[calc(100%-32px)] sm:px-5 md:w-[calc(100%-48px)] md:px-6 transition-all duration-300 ${
            scrolled
              ? "bg-[rgba(251,248,241,0.95)] shadow-[0_22px_54px_rgba(67,59,38,0.09)] backdrop-blur-lg"
              : "bg-[rgba(251,248,241,0.88)] shadow-[0_18px_50px_rgba(67,59,38,0.07)] backdrop-blur-md"
          } border-[rgba(67,59,38,0.1)]`}
        >
          <SectionLink
            href="#historia"
            className="flex h-[68px] shrink-0 items-center gap-2.5 md:h-[72px] md:gap-3"
            onNavigate={() => {
              setActiveHash(DEFAULT_ACTIVE);
              setOpen(false);
            }}
          >
            <Image
              src="/logo_header_mark.png"
              alt=""
              width={252}
              height={193}
              sizes="(max-width: 639px) 47px, (max-width: 767px) 51px, 63px"
              className="block h-[2.25rem] w-auto max-w-none shrink-0 object-contain sm:h-[2.45rem] md:h-[3rem]"
              priority
            />
            <Image
              src="/logo_Recortado_transparent.png"
              alt="AMIELAR"
              width={2059}
              height={764}
              sizes="(max-width: 639px) 151px, (max-width: 767px) 160px, 184px"
              className="block h-[3.5rem] w-auto max-w-none shrink-0 self-center translate-y-[0.18rem] object-contain sm:h-[3.7rem] md:h-[4.25rem]"
              priority
            />
          </SectionLink>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1.5 lg:flex">
            {primaryNavLinks.map((link) => {
              const active =
                pathname === "/" &&
                activeHash === link.href &&
                !(activeHash === "#historia" && link.label === "Nuestra historia");

              return (
                <SectionLink
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  onNavigate={() => setActiveHash(link.href)}
                  className={`site-nav-link whitespace-nowrap ${
                    active
                      ? "bg-[rgba(156,160,122,0.14)] text-[var(--olive)] shadow-[0_6px_16px_rgba(67,59,38,0.04)]"
                      : "text-[var(--muted-ink)] hover:bg-[rgba(156,160,122,0.1)] hover:text-[var(--olive)]"
                  }`}
                >
                  {link.label}
                </SectionLink>
              );
            })}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <a
              aria-label="Abrir Instagram de AMIELAR"
              className={SOCIAL_BUTTON_CLASS}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className={SOCIAL_ICON_CLASS} />
            </a>
            <a
              aria-label="Contactar por WhatsApp"
              className={SOCIAL_BUTTON_CLASS}
              href="https://wa.me/5492302393510"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp className={SOCIAL_ICON_CLASS} />
            </a>
            <ReserveLink
              className="site-header-action site-header-action-primary whitespace-nowrap"
            >
              Reservar turno
            </ReserveLink>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ReserveLink
              className="site-header-action site-header-action-primary !hidden whitespace-nowrap sm:!inline-flex"
            >
              Reservar
            </ReserveLink>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => (open ? closeMenu(true) : setOpen(true))}
              className="site-icon-button"
              aria-label={open ? "Cerrar menu" : "Abrir menu"}
              aria-expanded={open}
              aria-controls="landing-mobile-menu"
            >
              {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        <div
          id="landing-mobile-menu"
          className={`site-header-shell mx-auto mt-2 w-[calc(100%-24px)] max-w-[1440px] overflow-hidden border border-[rgba(67,59,38,0.08)] bg-[rgba(251,248,241,0.94)] shadow-[0_18px_40px_rgba(67,59,38,0.06)] backdrop-blur-md transition-all duration-300 ease-out sm:w-[calc(100%-32px)] md:w-[calc(100%-48px)] lg:hidden ${
            open ? "max-h-[calc(100dvh-7rem)] opacity-100" : "max-h-0 border-transparent opacity-0"
          }`}
          aria-hidden={!open}
          inert={!open ? true : undefined}
        >
          <div className="overflow-y-auto px-4 pb-6 pt-3">
            <nav className="flex flex-col gap-1.5">
              {mobileNavLinks.map((link) => {
                const active =
                  pathname === "/" &&
                  activeHash === link.href &&
                  !(activeHash === "#historia" && link.label === "Nuestra historia");

                return (
                  <SectionLink
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                    onNavigate={() => {
                      setActiveHash(link.href);
                      closeMenu();
                    }}
                    className={`site-nav-link site-nav-link-mobile ${
                      active
                        ? "bg-[rgba(156,160,122,0.14)] text-[var(--olive)] shadow-[0_6px_16px_rgba(67,59,38,0.04)]"
                        : "text-[var(--muted-ink)] hover:bg-[rgba(156,160,122,0.1)] hover:text-[var(--olive)]"
                    }`}
                  >
                    {link.label}
                  </SectionLink>
                );
              })}
            </nav>

            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
              <a
                aria-label="Abrir Instagram de AMIELAR"
                className="site-icon-button site-icon-button-mobile"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="h-5 w-5 text-[var(--olive)]" />
              </a>
              <a
                aria-label="Contactar por WhatsApp"
                className="site-icon-button site-icon-button-mobile"
                href="https://wa.me/5492302393510"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="h-5 w-5 text-[var(--olive)]" />
              </a>
              <ReserveLink
                className="site-header-action site-header-action-primary site-header-action-mobile whitespace-nowrap"
                onNavigate={() => closeMenu()}
              >
                Reservar turno
              </ReserveLink>
            </div>
          </div>
        </div>
      </header>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/15 backdrop-blur-[2px]"
          onClick={() => closeMenu(true)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
