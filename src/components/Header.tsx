"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

import { mobileNavLinks, primaryNavLinks } from "@/data/site";

const DEFAULT_ACTIVE = "#historia";

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

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-50 pt-4">
        <div
          className={`mx-auto flex w-[calc(100%-48px)] max-w-[1440px] items-center justify-between rounded-[28px] border px-6 transition-all duration-300 ${
            scrolled
              ? "bg-[rgba(250,249,246,0.95)] shadow-[0_22px_54px_rgba(67,59,38,0.09)] backdrop-blur-lg"
              : "bg-[rgba(250,249,246,0.88)] shadow-[0_18px_50px_rgba(67,59,38,0.07)] backdrop-blur-md"
          } border-[rgba(67,59,38,0.1)]`}
        >
          <a
            href="#historia"
            className="flex h-[72px] shrink-0 items-center gap-2.5"
            onClick={() => {
              setActiveHash(DEFAULT_ACTIVE);
              setOpen(false);
            }}
          >
            <Image src="/propuesta_logo.png" alt="AMIELAR" width={30} height={30} className="h-7.5 w-7.5 shrink-0" />
            <span className="whitespace-nowrap font-serif text-[29px] leading-none tracking-[-0.03em] text-[var(--earth)] xl:text-[30px]">
              AMIELAR
            </span>
          </a>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1.5 min-[1680px]:flex">
            {primaryNavLinks.map((link) => {
              const active = activeHash === link.href && !(activeHash === "#historia" && link.label === "Nuestra historia");

              return (
                <a
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  onClick={() => setActiveHash(link.href)}
                  className={`whitespace-nowrap rounded-full px-3 py-2 text-[14px] font-medium transition-all duration-300 ease-out ${
                    active
                      ? "bg-[#F3EEE4] text-[#433B26] shadow-[0_6px_16px_rgba(67,59,38,0.04)]"
                      : "text-[var(--muted-ink)] hover:bg-[#F3EEE4] hover:text-[#433B26]"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 min-[1680px]:flex">
            <a
              aria-label="Contactar por WhatsApp"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(67,59,38,0.1)] bg-white/88 text-[var(--earth)] transition-all duration-300 ease-out hover:translate-y-[-1px] hover:bg-[rgba(107,112,92,0.08)] hover:text-[#433B26] hover:shadow-[0_10px_24px_rgba(67,59,38,0.05)]"
              href="https://wa.me/5492302555555"
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp className="h-5 w-5 text-[var(--olive)] transition-transform duration-300 ease-out hover:scale-[1.05]" />
            </a>
            <a
              className="inline-flex h-11 items-center whitespace-nowrap rounded-full bg-[#D4A23B] px-5 text-[14px] font-semibold text-[#fffdf7] shadow-[0_10px_24px_rgba(212,162,59,0.2)] transition-all duration-300 ease-out hover:translate-y-[-1px] hover:bg-[#c69735] hover:shadow-[0_14px_28px_rgba(212,162,59,0.24)]"
              href="#reserva"
            >
              Reservar turno
            </a>
          </div>

          <div className="flex items-center gap-2 min-[1680px]:hidden">
            <a
              className="hidden h-10 items-center whitespace-nowrap rounded-full bg-[#D4A23B] px-4 text-[14px] font-semibold text-[#fffdf7] shadow-[0_8px_18px_rgba(212,162,59,0.18)] transition-all duration-300 ease-out hover:translate-y-[-1px] hover:bg-[#c69735] sm:inline-flex"
              href="#reserva"
            >
              Reservar
            </a>
            <button
              type="button"
              onClick={() => setOpen((current) => !current)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(67,59,38,0.1)] bg-white/82 text-[var(--earth)] transition-all duration-300 ease-out hover:bg-[#F3EEE4]"
              aria-label={open ? "Cerrar menu" : "Abrir menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        <div
          className={`mx-auto mt-2 w-[calc(100%-48px)] max-w-[1440px] overflow-hidden rounded-[24px] border border-[rgba(67,59,38,0.08)] bg-[rgba(250,249,246,0.94)] shadow-[0_18px_40px_rgba(67,59,38,0.06)] backdrop-blur-md transition-all duration-300 ease-out min-[1680px]:hidden ${
            open ? "max-h-[calc(100dvh-7rem)] opacity-100" : "max-h-0 border-transparent opacity-0"
          }`}
        >
          <div className="overflow-y-auto px-4 pb-6 pt-3">
            <nav className="flex flex-col gap-1.5">
              {mobileNavLinks.map((link) => {
                const active = activeHash === link.href && !(activeHash === "#historia" && link.label === "Nuestra historia");

                return (
                  <a
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                    onClick={() => {
                      setActiveHash(link.href);
                      setOpen(false);
                    }}
                    className={`rounded-[18px] px-4 py-3 text-[15px] font-medium transition-all duration-300 ease-out ${
                      active
                        ? "bg-[#F3EEE4] text-[#433B26] shadow-[0_6px_16px_rgba(67,59,38,0.04)]"
                        : "text-[var(--muted-ink)] hover:bg-[#F3EEE4] hover:text-[#433B26]"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <a
                aria-label="Contactar por WhatsApp"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(67,59,38,0.1)] bg-white/88 text-[var(--earth)] transition-all duration-300 ease-out hover:bg-[rgba(107,112,92,0.08)]"
                href="https://wa.me/5492302555555"
                target="_blank"
                rel="noreferrer"
              >
                <FaWhatsapp className="h-5 w-5 text-[var(--olive)] transition-transform duration-300 ease-out hover:scale-[1.05]" />
              </a>
              <a
                className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full bg-[#D4A23B] px-6 text-[15px] font-semibold text-[#fffdf7] transition-all duration-300 ease-out hover:bg-[#c69735]"
                href="#reserva"
                onClick={() => setOpen(false)}
              >
                Reservar turno
              </a>
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
