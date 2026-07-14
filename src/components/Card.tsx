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
};

export function Card({ icon: Icon, title, description, accent = "gold", footer, href, className = "" }: CardProps) {
  const accentMap = {
    gold: "bg-[rgba(205,179,93,0.14)] text-[var(--gold-deep)]",
    olive: "bg-[rgba(156,160,122,0.16)] text-[var(--olive)]",
    earth: "bg-[rgba(75,67,49,0.12)] text-[var(--earth)]",
  };

  const Wrapper = href ? "a" : "article";

  return (
    <Wrapper
      {...(href ? { href } : {})}
      className={`card-shell group relative flex cursor-pointer flex-col items-center overflow-hidden p-8 text-center transition-all duration-[300ms] ease-out hover:translate-y-[-6px] hover:border-[rgba(205,179,93,0.3)] hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(252,249,242,1))] hover:shadow-[0_22px_44px_rgba(67,59,38,0.12),0_0_0_1px_rgba(205,179,93,0.14)] active:translate-y-[-3px] active:scale-[0.98] active:transition-transform active:duration-150 ${className}`}
    >
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(205,179,93,0.16),transparent_68%)]" />
      {Icon ? (
        <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-[300ms] group-hover:scale-[1.08] ${accentMap[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
      ) : null}
      <h3 className="w-full font-serif text-2xl text-[var(--ink)] transition-all duration-[300ms] group-hover:tracking-[-0.015em]">{title}</h3>
      <p className="mt-3 w-full text-sm leading-7 text-[color:var(--muted-ink)] md:text-base">{description}</p>
      {footer ? <div className="mt-6 w-full">{footer}</div> : null}
    </Wrapper>
  );
}
