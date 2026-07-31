import { type LucideIcon } from "lucide-react";
import { ReactNode } from "react";

type CardProps = {
  icon?: LucideIcon;
  title: string;
  description: string;
  accent?: "gold" | "olive" | "earth";
  footer?: ReactNode;
  href?: string;
  className?: string;
  centeredHeader?: boolean;
  uniformContentRows?: boolean;
};

export function Card({
  icon: Icon,
  title,
  description,
  accent = "gold",
  footer,
  href,
  className = "",
  centeredHeader = false,
  uniformContentRows = false,
}: CardProps) {
  const accentMap = {
    gold: "bg-[rgba(205,179,93,0.14)] text-[var(--gold-deep)]",
    olive: "bg-[rgba(156,160,122,0.16)] text-[var(--olive)]",
    earth: "bg-[rgba(75,67,49,0.12)] text-[var(--earth)]",
  };

  const Wrapper = href ? "a" : "article";
  const interactionClass = href ? "site-card-interactive" : "site-card-informative";
  const icon = Icon ? (
    <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-[300ms] ${href ? "group-hover:scale-[1.04]" : ""} ${accentMap[accent]}`}>
      <Icon className="h-5 w-5" />
    </div>
  ) : null;
  const heading = <h3 className="site-card-title w-full text-[var(--ink)] transition-all duration-[300ms] group-hover:tracking-[-0.015em]">{title}</h3>;
  const descriptionText = <p className="mt-3 w-full text-sm leading-7 text-[color:var(--muted-ink)] md:text-base">{description}</p>;

  return (
    <Wrapper
      {...(href ? { href } : {})}
      className={`card-shell ${interactionClass} group relative flex flex-col items-center overflow-hidden p-8 text-center hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(252,249,242,1))] ${className}`}
    >
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(205,179,93,0.16),transparent_68%)]" />
      {uniformContentRows ? (
        <div className="card-uniform-content">
          <div className="card-icon-zone">{icon}</div>
          <div className="card-title-zone">{heading}</div>
          <div className="card-description-zone">{descriptionText}</div>
        </div>
      ) : centeredHeader ? (
        <div className="contents lg:relative lg:flex lg:h-10 lg:w-full lg:items-center lg:justify-center">
          {icon}
          {heading}
        </div>
      ) : (
        <>
          {icon}
          {heading}
        </>
      )}
      {!uniformContentRows ? descriptionText : null}
      {footer ? <div className="mt-6 w-full">{footer}</div> : null}
    </Wrapper>
  );
}
