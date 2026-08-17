import Image from "next/image";

type ProductCardProps = {
  name: string;
  description: string;
  image: string;
  imagePosition?: string;
  className?: string;
};

export function ProductCard({ name, description, image, imagePosition, className = "" }: ProductCardProps) {
  return (
    <article
      className={`card-shell site-card-informative group flex h-full flex-col overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(251,248,241,0.98))] hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(252,249,242,1))] ${className}`}
    >
      <div className="site-photo-frame relative mx-2.5 mt-2.5 h-36 overflow-hidden md:h-40 xl:h-44">
        <Image
          src={image}
          alt={name}
          fill
          unoptimized
          className={`site-photo-image object-cover ${imagePosition ?? "object-center"}`}
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,rgba(18,21,23,0)_0%,rgba(18,21,23,0.1)_55%,rgba(18,21,23,0.22)_100%)]" />
      </div>
      <div className="flex flex-1 flex-col items-center px-5 py-4 text-center md:px-6 md:py-5">
        <h3 className="site-card-title text-[var(--ink)] transition-all duration-[300ms] group-hover:tracking-[-0.015em]">{name}</h3>
        <p className="mt-2.5 w-full text-[0.8rem] leading-6 text-[color:var(--muted-ink)] md:max-w-[18ch] md:text-[0.85rem] md:leading-6">
          {description}
        </p>
      </div>
    </article>
  );
}
