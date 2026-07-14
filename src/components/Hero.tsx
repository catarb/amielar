import Image from "next/image";
import { MapPin, MessageCircleMore } from "lucide-react";

import { ReserveLink } from "@/components/ReserveLink";

export function Hero() {
  return (
    <section className="hero-first-view relative overflow-hidden pb-2 pt-3 md:pt-4">
      <div className="hero-hex pointer-events-none absolute inset-x-0 top-0 h-[520px]" />
      <div className="mx-auto grid max-w-[1440px] items-stretch gap-0 px-6 md:px-8 lg:min-h-[calc(100svh-98px)] lg:grid-cols-[0.46fr_0.54fr] lg:px-10 xl:px-12">
        <div className="relative z-10 flex items-center justify-center py-5 text-center md:py-6 lg:justify-start lg:py-8 lg:text-left">
          <div className="flex max-w-[42rem] flex-col items-center lg:items-start">
            <span className="hero-badge inline-flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" />
              Arata · La Pampa · Argentina
            </span>
            <h1 className="mt-6 w-full max-w-none font-serif text-[2.7rem] leading-[0.9] tracking-[-0.04em] text-[var(--earth)] md:mt-7 md:max-w-[10.8ch] md:text-[3.55rem] xl:text-[3.9rem]">
              AMIELAR: aire de colmena, naturaleza y bienestar en Arata
            </h1>
            <p className="mt-4 w-full max-w-none text-[0.98rem] leading-[1.62] text-[color:var(--muted-ink)] md:mt-5 md:max-w-[35rem] md:text-[1rem]">
              Vivi una experiencia rural unica: productos de la colmena, historia familiar y turnos de api-inhalacion en un entorno natural de La Pampa.
            </p>
            <div className="mt-6 flex w-full max-w-[20rem] flex-col items-center gap-3 sm:max-w-none sm:flex-row lg:justify-start">
              <ReserveLink className="primary-button hero-action justify-center">
                Reservar turno
              </ReserveLink>
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
            src="/A_1_v2.png"
            alt="Cabina de api-inhalacion de AMIELAR al atardecer"
            fill
            priority
            className="rounded-[24px] object-cover object-[52%_56%] sm:object-[52%_55%] md:object-[54%_54%] lg:object-[56%_54%]"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          <div className="absolute inset-0 rounded-[24px] bg-[linear-gradient(90deg,rgba(251,248,241,0.99)_0%,rgba(251,248,241,0.96)_7%,rgba(251,248,241,0.82)_15%,rgba(251,248,241,0.56)_24%,rgba(251,248,241,0.28)_33%,rgba(251,248,241,0.1)_42%,rgba(18,21,23,0.03)_100%)]" />
          <div className="absolute inset-y-0 left-0 hidden w-12 bg-[linear-gradient(90deg,#fbf8f1_0%,rgba(251,248,241,0.94)_44%,rgba(251,248,241,0.58)_76%,rgba(251,248,241,0)_100%)] md:block" />
          <div className="absolute inset-x-0 top-0 h-28 rounded-t-[24px] bg-[linear-gradient(180deg,rgba(246,241,231,0.28),transparent)]" />
        </div>
      </div>
    </section>
  );
}
