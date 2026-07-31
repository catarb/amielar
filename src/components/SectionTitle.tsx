type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: SectionTitleProps) {
  const alignment = align === "center" ? "items-center text-center" : "items-center text-center md:items-start md:text-left";

  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignment} ${className}`}>
      {eyebrow ? (
        <span className="label-chip">
          {eyebrow}
        </span>
      ) : null}
      <div className="space-y-3">
        <h2 className="site-section-title mx-auto max-w-[14ch] text-[var(--ink)] md:mx-0 md:max-w-none">
          {title}
        </h2>
        {description ? (
          <p className="site-section-copy mx-auto max-w-[34ch] text-[color:var(--muted-ink)] md:mx-0 md:max-w-none">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
