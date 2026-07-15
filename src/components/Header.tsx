"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";

import { ReserveLink } from "@/components/ReserveLink";
import { SectionLink } from "@/components/SectionLink";
import { mobileNavLinks, primaryNavLinks } from "@/data/site";

const DEFAULT_ACTIVE = "#historia";
const INSTAGRAM_URL = "https://www.instagram.com/amielarargentina/";
const SOCIAL_BUTTON_CLASS =
  "inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[rgba(67,59,38,0.1)] bg-white/88 text-[var(--earth)] shadow-[0_8px_18px_rgba(67,59,38,0.04)] transition-all duration-[250ms] ease-out hover:translate-y-[-2px] hover:bg-[rgba(156,160,122,0.08)] hover:text-[var(--earth)] hover:shadow-[0_14px_28px_rgba(67,59,38,0.08)]";
const SOCIAL_ICON_CLASS = "h-5 w-5 text-[var(--olive)] transition-transform duration-[250ms] ease-out hover:scale-[1.05]";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState(DEFAULT_ACTIVE);
  const headerRef = useRef<HTMLElement | null>(null);

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
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
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
          className={`mx-auto flex w-[calc(100%-24px)] max-w-[1440px] items-center justify-between rounded-[28px] border px-4 sm:w-[calc(100%-32px)] sm:px-5 md:w-[calc(100%-48px)] md:px-6 transition-all duration-300 ${
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
              alt="AMIELAR"
              width={252}
              height={193}
              className="block h-[2.25rem] w-auto max-w-none shrink-0 object-contain sm:h-[2.45rem] md:h-[3rem]"
              priority
            />
            <Image
              src="/logo_Recortado_transparent.png"
              alt="AMIELAR"
              width={2059}
              height={764}
              className="block h-[3.5rem] w-auto max-w-none shrink-0 self-center translate-y-[0.18rem] object-contain sm:h-[3.7rem] md:h-[4.25rem]"
              priority
            />
          </SectionLink>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1.5 lg:flex">
            {primaryNavLinks.map((link) => {
              const active = activeHash === link.href && !(activeHash === "#historia" && link.label === "Nuestra historia");

              return (
                <SectionLink
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  onNavigate={() => setActiveHash(link.href)}
                  className={`whitespace-nowrap rounded-full px-3 py-2 text-[14px] font-medium transition-all duration-300 ease-out ${
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
              className="inline-flex h-11 items-center whitespace-nowrap rounded-full bg-[var(--gold)] px-5 text-[14px] font-semibold text-[#fffdf8] shadow-[0_10px_24px_rgba(164,131,53,0.2)] transition-all duration-300 ease-out hover:translate-y-[-1px] hover:bg-[var(--gold-deep)] hover:shadow-[0_14px_28px_rgba(164,131,53,0.24)]"
            >
              Reservar turno
            </ReserveLink>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ReserveLink
              className="hidden h-10 items-center whitespace-nowrap rounded-full bg-[var(--gold)] px-4 text-[14px] font-semibold text-[#fffdf8] shadow-[0_8px_18px_rgba(164,131,53,0.18)] transition-all duration-300 ease-out hover:translate-y-[-1px] hover:bg-[var(--gold-deep)] sm:inline-flex"
            >
              Reservar
            </ReserveLink>
            <button
              type="button"
              onClick={() => setOpen((current) => !current)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(67,59,38,0.1)] bg-white/82 text-[var(--earth)] transition-all duration-300 ease-out hover:bg-[rgba(156,160,122,0.1)]"
              aria-label={open ? "Cerrar menu" : "Abrir menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        <div
          className={`mx-auto mt-2 w-[calc(100%-24px)] max-w-[1440px] overflow-hidden rounded-[24px] border border-[rgba(67,59,38,0.08)] bg-[rgba(251,248,241,0.94)] shadow-[0_18px_40px_rgba(67,59,38,0.06)] backdrop-blur-md transition-all duration-300 ease-out sm:w-[calc(100%-32px)] md:w-[calc(100%-48px)] lg:hidden ${
            open ? "max-h-[calc(100dvh-7rem)] opacity-100" : "max-h-0 border-transparent opacity-0"
          }`}
        >
          <div className="overflow-y-auto px-4 pb-6 pt-3">
            <nav className="flex flex-col gap-1.5">
              {mobileNavLinks.map((link) => {
                const active = activeHash === link.href && !(activeHash === "#historia" && link.label === "Nuestra historia");

                return (
                  <SectionLink
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                    onNavigate={() => {
                      setActiveHash(link.href);
                      setOpen(false);
                    }}
                    className={`rounded-[18px] px-4 py-3 text-[15px] font-medium transition-all duration-300 ease-out ${
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
                className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-[rgba(67,59,38,0.1)] bg-white/88 text-[var(--earth)] shadow-[0_8px_18px_rgba(67,59,38,0.04)] transition-all duration-[250ms] ease-out hover:translate-y-[-2px] hover:bg-[rgba(156,160,122,0.08)] hover:shadow-[0_14px_28px_rgba(67,59,38,0.08)]"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="h-5 w-5 text-[var(--olive)] transition-transform duration-[250ms] ease-out hover:scale-[1.05]" />
              </a>
              <a
                aria-label="Contactar por WhatsApp"
                className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-[rgba(67,59,38,0.1)] bg-white/88 text-[var(--earth)] shadow-[0_8px_18px_rgba(67,59,38,0.04)] transition-all duration-[250ms] ease-out hover:translate-y-[-2px] hover:bg-[rgba(156,160,122,0.08)] hover:shadow-[0_14px_28px_rgba(67,59,38,0.08)]"
                href="https://wa.me/5492302393510"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="h-5 w-5 text-[var(--olive)] transition-transform duration-[250ms] ease-out hover:scale-[1.05]" />
              </a>
              <ReserveLink
                className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full bg-[var(--gold)] px-6 text-[15px] font-semibold text-[#fffdf8] transition-all duration-300 ease-out hover:bg-[var(--gold-deep)]"
                onNavigate={() => setOpen(false)}
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
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
