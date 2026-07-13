import Image from "next/image";

import { primaryNavLinks } from "@/data/site";

export function Footer() {
  return (
    <footer className="relative border-t border-[rgba(67,59,38,0.1)] bg-[linear-gradient(180deg,rgba(255,255,255,0.78)_0%,rgba(250,247,239,0.94)_38%,rgba(246,241,231,0.98)_100%)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(205,179,93,0.32),rgba(156,160,122,0.24),transparent)]" />

      <div className="mx-auto grid max-w-[1320px] gap-10 px-6 pb-10 pt-12 md:px-8 lg:grid-cols-[1.34fr_0.76fr_0.9fr] lg:items-start lg:gap-8 lg:pb-9 lg:pt-14 xl:px-10">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center lg:gap-4">
            <Image
              src="/logo_header_mark.png"
              alt="AMIELAR"
              width={252}
              height={193}
              className="h-auto w-[5.8rem] shrink-0 object-contain md:w-[6.3rem] lg:w-[6.8rem]"
            />
            <div className="flex min-h-[5.8rem] items-center lg:min-h-[6.3rem]">
              <div className="flex translate-y-[0.34rem] items-baseline whitespace-nowrap font-serif text-[2.25rem] leading-none tracking-[-0.05em] text-[var(--olive)] md:translate-y-[0.38rem] md:text-[2.55rem] lg:translate-y-[0.42rem] lg:text-[2.85rem]">
                <span>AMIEL</span>
                <span className="text-[var(--gold)]">AR</span>
              </div>
            </div>
          </div>

          <p className="mt-4 max-w-[20rem] text-sm leading-6 text-[color:var(--muted-ink)]">
            Apiturismo y bienestar consciente en el corazón de La Pampa Argentina.
          </p>

          <p className="mt-4 max-w-[24rem] text-sm leading-7 text-[color:var(--muted-ink)] md:text-[0.95rem]">
            Aire de colmena, naturaleza y una experiencia rural serena para reconectar con el cuerpo, el paisaje y la vitalidad.
          </p>
        </div>

        <div className="flex flex-col items-center text-center lg:items-start lg:pt-1 lg:text-left">
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-[var(--earth)]">Links rapidos</p>

          <div className="mt-4 space-y-4 text-sm text-[color:var(--muted-ink)]">
            {primaryNavLinks.map((link) => (
              <a
                key={`${link.label}-${link.href}`}
                href={link.href}
                className="block transition-colors duration-200 hover:text-[var(--olive)]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center text-center lg:items-start lg:pt-1 lg:text-left">
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-[var(--earth)]">Newsletter</p>
          <p className="mt-4 max-w-[22rem] text-sm leading-7 text-[color:var(--muted-ink)]">
            Recibi novedades sobre reservas, experiencias y productos destacados.
          </p>

          <div className="mt-4 flex w-full max-w-[23rem] items-stretch rounded-full border border-[rgba(67,59,38,0.14)] bg-[rgba(255,255,255,0.84)] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-sm transition-colors duration-200 focus-within:border-[rgba(205,179,93,0.5)]">
            <input
              type="email"
              placeholder="Tu correo"
              className="w-full bg-transparent px-4 py-2.5 text-sm text-[var(--earth)] outline-none placeholder:text-[color:var(--muted-ink)]"
            />
            <button className="primary-button min-h-[2.8rem] self-stretch px-5 py-2 text-sm shadow-[0_8px_20px_rgba(164,131,53,0.18)]">
              OK
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1320px] border-t border-[rgba(67,59,38,0.08)] px-6 py-4 text-center md:px-8 xl:px-10">
        <p className="text-[0.64rem] uppercase tracking-[0.24em] text-[color:var(--muted-ink)]">
          © 2026 AMIELAR. ARATA, LA PAMPA, ARGENTINA.
        </p>
        <p className="mt-3 text-[0.58rem] uppercase tracking-[0.26em] text-[color:var(--muted-ink)] md:text-[0.76rem]">
          DISEÑO Y DESARROLLO WEB POR{" "}
          <a
            href="mailto:catalinarb25@gmail.com"
            className="transition-colors duration-200 hover:text-[var(--olive)]"
          >
            L-R DIGITAL
          </a>
        </p>
      </div>
    </footer>
  );
}
