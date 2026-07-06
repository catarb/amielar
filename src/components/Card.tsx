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
    gold: "bg-[rgba(212,162,59,0.14)] text-[var(--gold-deep)]",
    olive: "bg-[rgba(107,112,92,0.16)] text-[var(--olive)]",
    earth: "bg-[rgba(67,59,38,0.12)] text-[var(--earth)]",
  };

  return (
    <article className={`card-shell relative overflow-hidden p-8 ${className}`}>
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(212,162,59,0.18),transparent_68%)]" />
      {Icon ? (
        <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${accentMap[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
      ) : null}
      <h3 className="font-serif text-2xl text-[var(--ink)]">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[color:var(--muted-ink)] md:text-base">{description}</p>
      {footer ? <div className="mt-6">{footer}</div> : null}
    </article>
  );
}
