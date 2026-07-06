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
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignment} ${className}`}>
      {eyebrow ? (
        <span className="label-chip">
          {eyebrow}
        </span>
      ) : null}
      <div className="space-y-3">
        <h2 className="font-serif text-4xl leading-tight text-[var(--ink)] md:text-5xl">
          {title}
        </h2>
        {description ? (
          <p className="text-base leading-7 text-[color:var(--muted-ink)] md:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
