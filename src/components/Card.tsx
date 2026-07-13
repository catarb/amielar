import { type LucideIcon } from "lucide-react";
import { ReactNode } from "react";

type CardProps = {
  icon?: LucideIcon;
  title: string;
  description: string;
  accent?: "gold" | "olive" | "earth";
  footer?: ReactNode;
  className?: string;
};

export function Card({ icon: Icon, title, description, accent = "gold", footer, className = "" }: CardProps) {
  const accentMap = {
    gold: "bg-[rgba(205,179,93,0.14)] text-[var(--gold-deep)]",
    olive: "bg-[rgba(156,160,122,0.16)] text-[var(--olive)]",
    earth: "bg-[rgba(75,67,49,0.12)] text-[var(--earth)]",
  };

  return (
    <article className={`card-shell relative flex flex-col items-center overflow-hidden p-8 text-center md:items-start md:text-left ${className}`}>
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(205,179,93,0.16),transparent_68%)]" />
      {Icon ? (
        <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${accentMap[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
      ) : null}
      <h3 className="w-full font-serif text-2xl text-[var(--ink)]">{title}</h3>
      <p className="mt-3 w-full text-sm leading-7 text-[color:var(--muted-ink)] md:text-base">{description}</p>
      {footer ? <div className="mt-6 w-full">{footer}</div> : null}
    </article>
  );
}
