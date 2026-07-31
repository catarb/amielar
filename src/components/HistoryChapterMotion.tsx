"use client";

import { useEffect } from "react";

const REVEAL_SELECTOR = "[data-history-reveal]";

export function HistoryChapterMotion() {
  useEffect(() => {
    const page = document.querySelector<HTMLElement>("[data-history-page]");
    const chapters = Array.from(
      page?.querySelectorAll<HTMLElement>(REVEAL_SELECTOR) ?? [],
    );

    if (!page || !chapters.length) {
      return;
    }

    const markVisible = (chapter: HTMLElement) => {
      chapter.dataset.historyVisible = "true";
    };

    chapters.forEach((chapter) => {
      const rect = chapter.getBoundingClientRect();

      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
        markVisible(chapter);
      }
    });

    page.dataset.historyMotion = "ready";

    if (!("IntersectionObserver" in window)) {
      chapters.forEach(markVisible);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          markVisible(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.12,
      },
    );

    chapters.forEach((chapter) => {
      if (chapter.dataset.historyVisible !== "true") {
        observer.observe(chapter);
      }
    });

    return () => {
      observer.disconnect();
      delete page.dataset.historyMotion;
    };
  }, []);

  return null;
}
