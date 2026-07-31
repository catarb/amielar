"use client";

import { type CSSProperties, useId, useMemo, useState } from "react";

import type { AireDeColmenaFaq } from "@/data/aireDeColmenaFaqs";

type FaqAccordionProps = {
  items: AireDeColmenaFaq[];
  limit?: number;
  columns?: 1 | 2;
  variant?: "landing" | "air";
  className?: string;
  initialOpenId?: string | null;
};

export function FaqAccordion({
  items,
  limit,
  columns = 1,
  variant = "landing",
  className = "",
  initialOpenId = null,
}: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(initialOpenId);
  const componentId = useId().replaceAll(":", "");
  const visibleItems = useMemo(
    () => (typeof limit === "number" ? items.slice(0, limit) : items),
    [items, limit],
  );
  const distributedColumns = Array.from({ length: columns }, (_, columnIndex) =>
    visibleItems
      .map((item, index) => ({ item, index }))
      .filter(({ index }) => index % columns === columnIndex),
  );
  const isAirVariant = variant === "air";

  return (
    <div
      className={`${
        isAirVariant
          ? "air-faq-grid mx-auto w-full max-w-[1240px]"
          : "mx-auto w-full max-w-none"
      } ${className}`}
    >
      {distributedColumns.map((column, columnIndex) => (
        <div
          className={isAirVariant ? "air-faq-column" : "flex flex-col gap-4"}
          key={columnIndex}
        >
          {column.map(({ item, index }) => {
            const isOpen = openId === item.id;
            const triggerId = `faq-trigger-${componentId}-${item.id}`;
            const panelId = `faq-panel-${componentId}-${item.id}`;

            return (
              <article
                key={item.id}
                className={
                  isAirVariant
                    ? "air-faq-card card-shell site-card-informative overflow-hidden"
                    : "group card-shell site-card-interactive flex w-full max-w-none flex-col justify-center overflow-hidden px-8 py-6 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(252,249,242,1))] md:min-h-0 md:px-6 md:py-3"
                }
                data-state={isOpen ? "open" : "closed"}
                style={
                  isAirVariant
                    ? ({ "--faq-order": index } as CSSProperties)
                    : undefined
                }
              >
                <h3>
                  <button
                    id={triggerId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className={
                      isAirVariant
                        ? "air-faq-trigger"
                        : "flex min-h-[104px] w-full cursor-pointer list-none flex-col items-center justify-center gap-3 text-center font-medium text-[var(--ink)] outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#be9934]/55 focus-visible:ring-inset data-[open=true]:text-[var(--earth)] md:min-h-11 md:flex-row md:justify-between md:gap-6 md:text-left"
                    }
                    data-open={isOpen}
                  >
                    <span
                      className={
                        isAirVariant
                          ? undefined
                          : "w-full text-[0.98rem] leading-6 md:text-[1.02rem]"
                      }
                    >
                      {item.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className={
                        isAirVariant
                          ? "air-faq-icon"
                          : `relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--olive)] transition duration-300 ${
                              isOpen
                                ? "rotate-180 bg-[rgba(156,160,122,0.2)]"
                                : "bg-[rgba(156,160,122,0.14)]"
                            }`
                      }
                    >
                      <span
                        className={
                          isAirVariant
                            ? "air-faq-icon-vertical"
                            : `absolute h-3.5 w-px rounded-full bg-current transition-all duration-300 ${
                                isOpen ? "scale-y-0" : ""
                              }`
                        }
                      />
                      <span
                        className={
                          isAirVariant
                            ? "air-faq-icon-horizontal"
                            : "h-px w-3.5 rounded-full bg-current"
                        }
                      />
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  aria-hidden={!isOpen}
                  className={`${
                    isAirVariant
                      ? "air-faq-panel"
                      : "grid transition-[grid-template-rows] duration-300 ease-out"
                  } ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p
                      className={
                        isAirVariant
                          ? "air-faq-answer"
                          : "pt-2 text-center text-sm leading-7 text-[color:var(--muted-ink)] md:pt-4 md:text-left md:text-base"
                      }
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ))}
    </div>
  );
}
