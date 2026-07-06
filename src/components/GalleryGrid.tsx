import Image from "next/image";

import type { GalleryItem } from "@/data/site";

type GalleryGridProps = {
  items: GalleryItem[];
};

export function GalleryGrid({ items }: GalleryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-6 md:auto-rows-[150px] md:gap-4 xl:auto-rows-[168px]">
      {items.map((item, index) => {
        const spanClass =
          item.size === "wide"
            ? "col-span-2 md:col-span-4"
            : item.size === "tall"
              ? "col-span-1 md:col-span-2 md:row-span-2"
              : "col-span-1 md:col-span-2";

        return (
          <article
            key={`${item.title}-${index}`}
            className={`group relative min-h-[180px] overflow-hidden rounded-[32px] border border-[rgba(67,59,38,0.1)] shadow-[0_14px_32px_rgba(67,59,38,0.07)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(67,59,38,0.1)] ${spanClass}`}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition duration-300 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,21,23,0)_0%,rgba(18,21,23,0.1)_56%,rgba(18,21,23,0.62)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
              <div className="inline-flex rounded-full border border-white/30 bg-white/12 px-3 py-1 text-[0.67rem] uppercase tracking-[0.26em] text-white/84 backdrop-blur-md">
                {item.note ?? "Experiencia"}
              </div>
              <h3 className="mt-3 max-w-[10ch] font-serif text-[1.55rem] leading-[1.02] text-white md:text-[1.8rem]">
                {item.title}
              </h3>
            </div>
          </article>
        );
      })}
    </div>
  );
}
