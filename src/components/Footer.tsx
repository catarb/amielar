import Image from "next/image";

import { primaryNavLinks } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-[rgba(67,59,38,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(247,243,235,0.94))]">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1.35fr_0.95fr_1fr] md:px-8 md:py-12 xl:px-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Image src="/propuesta_logo.png" alt="AMIELAR" width={54} height={54} className="h-11 w-11 shrink-0" />
            <div>
              <p className="font-serif text-[2rem] leading-none text-[var(--earth)]">AMIELAR</p>
              <p className="max-w-xs text-sm leading-6 text-[color:var(--muted-ink)]">
                Apiturismo y bienestar consciente en el corazón de La Pampa Argentina.
              </p>
            </div>
          </div>
          <p className="max-w-sm text-sm leading-7 text-[color:var(--muted-ink)]">
            Aire de colmena, naturaleza y una experiencia rural serena para reconectar con el cuerpo, el paisaje y la vitalidad.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--earth)]">Links rapidos</p>
          <div className="space-y-3 text-sm text-[color:var(--muted-ink)]">
            {primaryNavLinks.map((link) => (
              <a key={`${link.label}-${link.href}`} href={link.href} className="block transition hover:text-[var(--gold-deep)]">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--earth)]">Newsletter</p>
          <p className="text-sm leading-7 text-[color:var(--muted-ink)]">
            Recibi novedades sobre reservas, experiencias y productos destacados.
          </p>
          <div className="flex rounded-full border border-[rgba(67,59,38,0.16)] bg-white p-1 shadow-[0_10px_22px_rgba(67,59,38,0.05)]">
            <input
              type="email"
              placeholder="Tu correo"
              className="w-full bg-transparent px-4 py-3 text-sm outline-none placeholder:text-[color:var(--muted-ink)]"
            />
            <button className="primary-button px-5 py-3 text-sm">OK</button>
          </div>
        </div>
      </div>
      <div className="border-t border-[rgba(67,59,38,0.08)] px-5 py-4 text-center text-[0.68rem] uppercase tracking-[0.22em] text-[color:var(--muted-ink)]">
        © 2026 AMIELAR. Arata, La Pampa, Argentina.
      </div>
    </footer>
  );
}
