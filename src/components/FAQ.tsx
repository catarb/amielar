type FAQItem = {
  question: string;
  answer: string;
};

type FAQProps = {
  items: FAQItem[];
};

export function FAQ({ items }: FAQProps) {
  return (
    <div className="mx-auto w-full max-w-none space-y-4">
      {items.map((item) => (
        <details
          key={item.question}
          className="group card-shell flex w-full max-w-none flex-col justify-center overflow-hidden px-8 py-6 shadow-[0_12px_28px_rgba(67,59,38,0.06)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(67,59,38,0.09)] open:bg-[rgba(255,253,248,0.96)] md:min-h-0 md:px-6 md:py-5"
        >
          <summary className="flex min-h-[104px] cursor-pointer list-none flex-col items-center justify-center gap-3 text-center font-medium text-[var(--ink)] transition-colors duration-300 group-open:text-[var(--earth)] md:min-h-0 md:flex-row md:justify-between md:gap-6 md:text-left">
            <span className="w-full text-[0.98rem] leading-6 md:text-[1.02rem]">{item.question}</span>
            <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(156,160,122,0.14)] text-[var(--olive)] transition duration-300 group-open:rotate-180 group-open:bg-[rgba(156,160,122,0.2)]">
              <span className="absolute h-3.5 w-px rounded-full bg-current transition-all duration-300 group-open:scale-y-0" />
              <span className="h-px w-3.5 rounded-full bg-current" />
            </span>
          </summary>
          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-open:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <p className="pt-2 text-center text-sm leading-7 text-[color:var(--muted-ink)] md:pt-4 md:text-left md:text-base">{item.answer}</p>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
