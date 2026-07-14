import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

type ProductCardProps = {
  name: string;
  description: string;
  image: string;
  imagePosition?: string;
  whatsappMessage: string;
  className?: string;
};

const WHATSAPP_NUMBER = "5492302555555";

export function ProductCard({ name, description, image, imagePosition, whatsappMessage, className = "" }: ProductCardProps) {
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <article
      className={`card-shell group flex h-full cursor-pointer flex-col overflow-hidden rounded-[2.05rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(251,248,241,0.98))] shadow-[0_12px_28px_rgba(67,59,38,0.06)] transition-all duration-[300ms] ease-out hover:translate-y-[-6px] hover:border-[rgba(205,179,93,0.3)] hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(252,249,242,1))] hover:shadow-[0_22px_44px_rgba(67,59,38,0.12),0_0_0_1px_rgba(205,179,93,0.14)] active:translate-y-[-3px] active:scale-[0.98] active:transition-transform active:duration-150 ${className}`}
    >
      <div className="relative h-40 overflow-hidden md:h-44 xl:h-48">
        <Image
          src={image}
          alt={name}
          fill
          className={`object-cover transition duration-300 ease-out group-hover:scale-[1.03] ${imagePosition ?? "object-center"}`}
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,rgba(18,21,23,0)_0%,rgba(18,21,23,0.1)_55%,rgba(18,21,23,0.22)_100%)]" />
      </div>
      <div className="flex flex-1 flex-col items-center px-5 py-4 text-center md:px-6 md:py-5">
        <h3 className="font-serif text-[1.42rem] leading-tight text-[var(--ink)] transition-all duration-[300ms] group-hover:tracking-[-0.015em] md:text-[1.56rem]">{name}</h3>
        <p className="mt-2.5 w-full text-[0.8rem] leading-6 text-[color:var(--muted-ink)] md:max-w-[18ch] md:text-[0.85rem] md:leading-6">
          {description}
        </p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="secondary-button group/button mt-auto w-auto min-w-[11rem] justify-center px-4 py-2 text-[0.88rem] transition-all duration-[250ms] hover:translate-y-[-2px] hover:bg-[var(--gold)] hover:text-white hover:shadow-[0_14px_28px_rgba(164,131,53,0.22)] active:scale-[0.98] active:transition-transform active:duration-150 md:px-5 md:py-2.5"
        >
          Consultar
          <ArrowUpRight className="h-4 w-4 transition-transform duration-[250ms] group-hover/button:translate-x-1" />
        </a>
      </div>
    </article>
  );
}
