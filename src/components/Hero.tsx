import Image from "next/image";
import { MapPin, MessageCircleMore } from "lucide-react";

export function Hero() {
  return (
    <section className="hero-first-view relative overflow-hidden pb-2 pt-3 md:pt-4">
      <div className="hero-hex pointer-events-none absolute inset-x-0 top-0 h-[520px]" />
      <div className="mx-auto grid max-w-[1440px] items-stretch gap-0 px-6 md:px-8 lg:min-h-[calc(100svh-98px)] lg:grid-cols-[0.46fr_0.54fr] lg:px-10 xl:px-12">
        <div className="relative z-10 flex items-center py-5 md:py-6 lg:py-8">
          <div className="max-w-[42rem]">
            <span className="hero-badge inline-flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" />
              Arata · La Pampa · Argentina
            </span>
            <h1 className="mt-7 max-w-[10.8ch] font-serif text-[2.7rem] leading-[0.9] tracking-[-0.04em] text-[var(--earth)] md:text-[3.55rem] xl:text-[3.9rem]">
              AMIELAR: aire de colmena, naturaleza y bienestar en Arata
            </h1>
            <p className="mt-5 max-w-[35rem] text-[0.98rem] leading-[1.62] text-[color:var(--muted-ink)] md:text-[1rem]">
              Vivi una experiencia rural unica: productos de la colmena, historia familiar y turnos de api-inhalacion en un entorno natural de La Pampa.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a className="primary-button hero-action justify-center" href="#reserva">
                Reservar turno
              </a>
              <a
                className="secondary-button hero-action justify-center"
                href="https://wa.me/5492302555555"
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircleMore className="h-4 w-4 text-[var(--olive)]" />
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="relative min-h-[470px] overflow-hidden lg:min-h-[calc(100svh-126px)]">
          <div className="hero-photo-frame absolute inset-0 rounded-[24px]" />
          <Image
            src="/ai/hero-main-v2.png"
            alt="Cabana de api-inhalacion en el campo pampeano"
            fill
            priority
            className="rounded-[24px] object-cover object-center object-[center_42%] saturate-[0.96] contrast-[1.04] brightness-[1.03] sepia-[0.03]"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          <div className="absolute inset-0 rounded-[24px] bg-[linear-gradient(90deg,rgba(250,249,246,0.98)_0%,rgba(250,249,246,0.94)_8%,rgba(250,249,246,0.72)_16%,rgba(250,249,246,0.38)_24%,rgba(250,249,246,0.12)_33%,rgba(18,21,23,0.04)_100%)]" />
          <div className="absolute inset-x-0 top-0 h-28 rounded-t-[24px] bg-[linear-gradient(180deg,rgba(246,241,232,0.28),transparent)]" />
        </div>
      </div>
    </section>
  );
}
