import Image from "next/image";

import type { GalleryItem } from "@/data/site";

type GalleryGridProps = {
  items: GalleryItem[];
};

export function GalleryGrid({ items }: GalleryGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[150px] md:gap-4 xl:auto-rows-[168px]">
      {items.map((item, index) => {
        const spanClass =
          item.size === "wide"
            ? "md:col-span-4"
            : item.size === "tall"
              ? "md:col-span-2 md:row-span-3"
              : "md:col-span-2";

        const mobileHeightClass =
          item.size === "wide" ? "min-h-[290px]" : item.size === "tall" ? "min-h-[280px]" : "min-h-[250px]";

        return (
          <article
            key={`${item.title}-${index}`}
            className={`site-card-informative site-photo-frame group relative h-full overflow-hidden border border-[rgba(67,59,38,0.1)] md:min-h-0 ${mobileHeightClass} ${spanClass}`}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              className={`site-photo-image object-cover ${item.imagePosition ?? ""}`}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,21,23,0)_0%,rgba(18,21,23,0.1)_56%,rgba(18,21,23,0.62)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-center md:p-5 md:text-left">
              <div className="inline-flex rounded-full border border-white/30 bg-white/12 px-3 py-1 text-[0.67rem] uppercase tracking-[0.26em] text-white/84 backdrop-blur-md">
                {item.note ?? "Experiencia"}
              </div>
              <h3 className="site-card-title mx-auto mt-3 w-full max-w-[11ch] text-white transition-all duration-[300ms] group-hover:tracking-[-0.015em] md:mx-0 md:max-w-[10ch]">
                {item.title}
              </h3>
            </div>
          </article>
        );
      })}
    </div>
  );
}
