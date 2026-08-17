"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { InternalHeaderActions } from "@/components/InternalHeaderActions";
import { scrollToSection, scrollToSectionAfterLayout } from "@/lib/scroll-to-reservation";

const links = [
  { id: "introduccion", label: "Descubrí" },
  { id: "experiencias", label: "Experiencias" },
  { id: "tarjeta-regalo", label: "Regalá" },
  { id: "informacion-practica", label: "Antes de venir" },
  { id: "testimonios", label: "Testimonios" },
  { id: "preguntas", label: "Preguntas" },
] as const;

const linkClassName =
  "site-nav-link whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#be9934]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fbf8f1]";

const getSectionScrollAdvance = (sectionId: string) => {
  if (sectionId === "introduccion") {
    return 0;
  }

  if (sectionId === "tarjeta-regalo") {
    if (window.innerWidth < 768) {
      return 28;
    }

    if (window.innerWidth < 1024) {
      return 48;
    }
  }

  if (window.innerWidth < 768) {
    return 0;
  }

  const baseAdvance = window.innerWidth >= 1024
    ? Math.min(140, Math.max(104, window.innerWidth * 0.095))
    : 76;

  if (sectionId === "informacion-practica" && window.innerWidth >= 1024) {
    return baseAdvance + 7;
  }

  if (sectionId === "tarjeta-regalo" && window.innerWidth >= 1024) {
    return Math.min(104, baseAdvance);
  }

  if (sectionId === "testimonios" && window.innerWidth >= 1024) {
    return Math.max(40, baseAdvance - 45);
  }

  if (sectionId === "preguntas" && window.innerWidth >= 1024) {
    return 0;
  }

  return sectionId === "experiencias" && window.innerWidth >= 1024
    ? baseAdvance + 6
    : baseAdvance;
};

export function AirPageHeader() {
  const [activeId, setActiveId] = useState<string>(links[0].id);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = (restoreFocus = false) => {
    setOpen(false);

    if (restoreFocus) {
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
  };

  useEffect(() => {
    const header = headerRef.current;

    if (!header) {
      return;
    }

    const updateHeaderOffset = () => {
      document.documentElement.style.setProperty(
        "--header-offset",
        `${Math.ceil(header.getBoundingClientRect().height)}px`,
      );
    };

    const syncScrollState = () => setScrolled(window.scrollY > 18);

    updateHeaderOffset();
    syncScrollState();

    const resizeObserver = new ResizeObserver(updateHeaderOffset);
    resizeObserver.observe(header);
    window.addEventListener("resize", updateHeaderOffset);
    window.addEventListener("scroll", syncScrollState, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeaderOffset);
      window.removeEventListener("scroll", syncScrollState);
      document.documentElement.style.removeProperty("--header-offset");
    };
  }, []);

  useEffect(() => {
    const sections = links
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (!sections.length) {
      return;
    }

    let observer: IntersectionObserver | null = null;
    let frame = 0;

    const chooseActiveSection = () => {
      const activationLine =
        (headerRef.current?.getBoundingClientRect().height ?? 0) + 32;
      const preceding = sections.filter(
        (section) => section.getBoundingClientRect().top <= activationLine,
      );
      const nextActive = preceding.at(-1) ?? sections[0];

      setActiveId(nextActive.id);
    };

    const scheduleActiveUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(chooseActiveSection);
    };

    const connectObserver = () => {
      observer?.disconnect();

      const headerHeight =
        Math.ceil(headerRef.current?.getBoundingClientRect().height ?? 0);
      const activationBandHeight = 26;
      const bottomMargin = Math.max(
        0,
        window.innerHeight - headerHeight - activationBandHeight,
      );

      observer = new IntersectionObserver(scheduleActiveUpdate, {
        rootMargin: `-${headerHeight}px 0px -${bottomMargin}px 0px`,
        threshold: 0,
      });

      sections.forEach((section) => observer?.observe(section));
      scheduleActiveUpdate();
    };

    connectObserver();

    const resizeObserver = new ResizeObserver(connectObserver);
    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }

    const syncHash = () => {
      const hashId = window.location.hash.slice(1);
      if (links.some(({ id }) => id === hashId)) {
        setActiveId(hashId);
      } else {
        chooseActiveSection();
      }
    };

    window.addEventListener("hashchange", syncHash);
    window.addEventListener("resize", scheduleActiveUpdate);
    window.addEventListener("scroll", scheduleActiveUpdate, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("resize", scheduleActiveUpdate);
      window.removeEventListener("scroll", scheduleActiveUpdate);
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
      if (window.innerWidth >= 1280) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", closeMenuOnDesktop);
    return () => window.removeEventListener("resize", closeMenuOnDesktop);
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        data-site-header="true"
        className="sticky top-0 z-50 px-3 pt-2.5 sm:px-4 md:pt-3"
      >
        <div
          className={`site-header-shell mx-auto grid min-h-[64px] w-full max-w-[1440px] grid-cols-[auto_1fr_auto] items-center border border-[rgba(67,59,38,0.1)] px-3 transition-all duration-300 sm:px-4 xl:min-h-[68px] xl:grid-cols-[auto_minmax(0,1fr)_auto] ${
            scrolled
              ? "bg-[rgba(251,248,241,0.96)] shadow-[0_20px_48px_rgba(67,59,38,0.1)] backdrop-blur-lg"
              : "bg-[rgba(251,248,241,0.9)] shadow-[0_16px_42px_rgba(67,59,38,0.07)] backdrop-blur-md"
          }`}
        >
          <Link
            href="/"
            aria-label="Ir a la página principal de AMIELAR"
            className="flex h-14 shrink-0 items-center gap-2 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#be9934]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fbf8f1] sm:gap-2.5 xl:h-16"
          >
            <Image
              src="/logo_header_mark.png"
              alt=""
              width={252}
              height={193}
              sizes="(max-width: 639px) 42px, (max-width: 1279px) 47px, 53px"
              className="h-8 w-auto shrink-0 object-contain sm:h-9 xl:h-10"
              priority
            />
            <Image
              src="/logo_Recortado_transparent.png"
              alt="AMIELAR"
              width={2059}
              height={764}
              sizes="(max-width: 639px) 108px, (max-width: 1279px) 119px, 130px"
              className="h-10 w-auto max-w-none shrink-0 translate-y-[0.1rem] object-contain sm:h-11 xl:h-12"
              priority
            />
          </Link>

          <nav
            aria-label="Secciones de Aire de Colmena"
            className="hidden min-w-0 items-center justify-center gap-0.5 px-2 xl:flex"
          >
            {links.map(({ id, label }) => {
              const isActive = activeId === id;

              return (
                <a
                  key={id}
                  href={`#${id}`}
                  aria-current={isActive ? "location" : undefined}
                  onClick={(event) => {
                    setActiveId(id);
                    scrollToSection(`#${id}`, event, {
                      additionalOffset: getSectionScrollAdvance(id),
                    });
                  }}
                  className={`${linkClassName} ${
                    isActive
                      ? "bg-[rgba(235,231,216,0.82)] text-[#555b3f] shadow-[inset_0_0_0_1px_rgba(127,136,93,0.1)]"
                      : "text-[var(--muted-ink)] hover:bg-[rgba(156,160,122,0.1)] hover:text-[var(--olive)]"
                  }`}
                >
                  {label}
                </a>
              );
            })}
          </nav>

          <InternalHeaderActions homeHref="#historia" />

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => (open ? closeMenu(true) : setOpen(true))}
            className="site-icon-button col-start-3 justify-self-end focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#be9934]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fbf8f1] xl:!hidden"
            aria-label={open ? "Cerrar menú de Aire de Colmena" : "Abrir menú de Aire de Colmena"}
            aria-expanded={open}
            aria-controls="air-page-mobile-menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div
          id="air-page-mobile-menu"
          className={`site-header-shell fixed inset-x-3 top-[calc(var(--header-offset,0px)+0.5rem)] z-50 mx-auto max-h-[calc(100dvh-var(--header-offset,0px)-1rem)] max-w-[720px] overflow-y-auto border bg-[rgba(251,248,241,0.98)] p-3 shadow-[0_24px_64px_rgba(43,39,29,0.16)] backdrop-blur-xl transition-all duration-300 sm:inset-x-4 sm:p-4 xl:hidden ${
            open
              ? "visible translate-y-0 border-[rgba(67,59,38,0.1)] opacity-100"
              : "invisible -translate-y-2 border-transparent opacity-0"
          }`}
          aria-hidden={!open}
        >
          <nav aria-label="Secciones de Aire de Colmena" className="flex flex-col gap-1">
            {links.map(({ id, label }) => {
              const isActive = activeId === id;

              return (
                <a
                  key={id}
                  href={`#${id}`}
                  aria-current={isActive ? "location" : undefined}
                  tabIndex={open ? 0 : -1}
                  onClick={(event) => {
                    setActiveId(id);
                    closeMenu();
                    scrollToSectionAfterLayout(`#${id}`, event, {
                      additionalOffset: getSectionScrollAdvance(id),
                    });
                  }}
                  className={`site-nav-link site-nav-link-mobile focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#be9934]/55 focus-visible:ring-inset ${
                    isActive
                      ? "bg-[rgba(235,231,216,0.86)] text-[#555b3f]"
                      : "text-[var(--muted-ink)] hover:bg-[rgba(156,160,122,0.1)] hover:text-[var(--olive)]"
                  }`}
                >
                  {label}
                </a>
              );
            })}
          </nav>

          <InternalHeaderActions homeHref="#historia" mobile onNavigate={() => closeMenu()} />
        </div>
      </header>

      {open ? (
        <div
          className="fixed inset-0 z-40 bg-[rgba(43,39,29,0.16)] backdrop-blur-[2px] xl:hidden"
          onClick={() => closeMenu(true)}
          aria-hidden="true"
        />
      ) : null}
    </>
  );
}
