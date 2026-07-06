import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

type ProductCardProps = {
  name: string;
  description: string;
  image: string;
  className?: string;
};

export function ProductCard({ name, description, image, className = "" }: ProductCardProps) {
  return (
    <article
      className={`card-shell group flex h-full flex-col overflow-hidden rounded-[2.05rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(250,249,246,0.98))] shadow-[0_12px_28px_rgba(67,59,38,0.06)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(67,59,38,0.1)] ${className}`}
    >
      <div className="relative h-40 overflow-hidden md:h-44 xl:h-48">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition duration-300 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,rgba(18,21,23,0)_0%,rgba(18,21,23,0.1)_55%,rgba(18,21,23,0.22)_100%)]" />
      </div>
      <div className="flex flex-1 flex-col items-center px-5 py-4 text-center md:px-6 md:py-5">
        <h3 className="font-serif text-[1.42rem] leading-tight text-[var(--ink)] md:text-[1.56rem]">{name}</h3>
        <p className="mt-2.5 max-w-[18ch] text-[0.8rem] leading-6 text-[color:var(--muted-ink)] md:text-[0.85rem] md:leading-6">
          {description}
        </p>
        <button className="secondary-button mt-auto justify-center px-5 py-2.5">
          Consultar
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
