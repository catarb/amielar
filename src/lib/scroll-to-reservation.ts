"use client";

const RESERVATION_ID = "reserva";
const HISTORY_ID = "historia";
const QUESTIONS_ID = "preguntas";
const MODEL_ID = "modelo-amielar";
const DESKTOP_MIN_WIDTH = 1024;
const MOBILE_MAX_WIDTH = 767;
const DESKTOP_TOP_GAP = 24;
const MOBILE_TOP_GAP = 16;
const RESERVATION_TOP_GAP = 0;
const HISTORY_TOP_GAP = 8;

export const PENDING_SECTION_KEY = "amielar:pending-section";

type ScrollToSectionOptions = {
  additionalOffset?: number;
};

export function scrollToSection(
  targetHash: string,
  event?: { preventDefault?: () => void },
  options: ScrollToSectionOptions = {},
) {
  event?.preventDefault?.();

  if (typeof window === "undefined") return;

  const targetId = targetHash.replace(/^#/, "");
  if (!targetId) return;

  const section = document.getElementById(targetId);
  if (!section) return;

  const isDesktop = window.innerWidth >= DESKTOP_MIN_WIDTH;
  const mobileVisualAnchor = window.innerWidth <= MOBILE_MAX_WIDTH
    ? section.querySelector<HTMLElement>("[data-mobile-scroll-anchor='true']")
    : null;

  const target =
    targetId === RESERVATION_ID
      ? document.querySelector<HTMLElement>("[data-reservation-card='true']") ?? section
      : mobileVisualAnchor ?? section;

  const header = document.querySelector<HTMLElement>("[data-site-header='true']");
  const headerHeight = header?.getBoundingClientRect().height ?? 0;
  const viewportHeight = window.innerHeight;
  const targetRect = target.getBoundingClientRect();
  const sectionHeight = targetRect.height;

  let topGap = MOBILE_TOP_GAP;

  if (isDesktop) {
    if (targetId === RESERVATION_ID) {
      topGap = RESERVATION_TOP_GAP;
    } else if (targetId === HISTORY_ID) {
      topGap = HISTORY_TOP_GAP;
    } else if (targetId === QUESTIONS_ID) {
      topGap = HISTORY_TOP_GAP;
    } else if (targetId === MODEL_ID) {
      topGap = DESKTOP_TOP_GAP;
    } else {
      const availableHeight = viewportHeight - headerHeight;
      const centeredGap = Math.max((availableHeight - sectionHeight) / 2, DESKTOP_TOP_GAP);
      topGap = centeredGap;
    }
  }

  const top =
    window.scrollY +
    targetRect.top -
    headerHeight -
    topGap +
    (options.additionalOffset ?? 0);

  if (window.location.hash !== `#${targetId}`) {
    window.history.replaceState(null, "", `#${targetId}`);
  }

  window.scrollTo({
    top: Math.max(0, top),
    behavior: "smooth",
  });
}

export function scrollToSectionAfterLayout(
  targetHash: string,
  event?: { preventDefault?: () => void },
  options: ScrollToSectionOptions = {},
) {
  event?.preventDefault?.();

  if (typeof window === "undefined") return;

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      window.setTimeout(() => scrollToSection(targetHash, undefined, options), 360);
    });
  });
}

export function scrollToReservation(event?: { preventDefault?: () => void }) {
  scrollToSection(`#${RESERVATION_ID}`, event);
}
