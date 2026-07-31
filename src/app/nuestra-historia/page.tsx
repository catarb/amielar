import type { Metadata } from "next";
import Image from "next/image";
import { ArrowLeft, MoveRight } from "lucide-react";

import { Footer } from "@/components/Footer";
import { HistoryChapterMotion } from "@/components/HistoryChapterMotion";
import { HistoryPageHeader } from "@/components/HistoryPageHeader";
import { ReserveLink } from "@/components/ReserveLink";
import { SectionLink } from "@/components/SectionLink";

export const metadata: Metadata = {
  title: "Nuestra historia | AMIELAR",
  description:
    "Más de 30 años de conocimiento apícola, innovación y trabajo familiar detrás de AMIELAR.",
};

const storyBodyClass =
  "site-section-copy text-[color:var(--muted-ink)]";

export default function NuestraHistoriaPage() {
  return (
    <main
      data-history-page
      className="history-page min-h-screen overflow-x-clip bg-[var(--background)] text-[var(--ink)]"
    >
      <div className="grain-overlay" />
      <HistoryPageHeader />
      <HistoryChapterMotion />

      <section className="history-story-hero relative z-10 mx-auto max-w-[1440px] px-6 pb-[clamp(4rem,8vw,7rem)] pt-[clamp(1.5rem,4vw,3.5rem)] md:px-8 lg:px-10 xl:px-12">
        <div
          data-history-reveal
          className="history-story-hero-grid grid overflow-hidden rounded-[clamp(2rem,4vw,3rem)] border border-[rgba(67,59,38,0.1)] bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(244,239,226,0.94))] shadow-[0_28px_72px_rgba(67,59,38,0.1)] lg:min-h-[min(680px,calc(100svh-var(--header-offset,0px)-4rem))] lg:grid-cols-[0.88fr_1.12fr]"
        >
          <div className="history-story-hero-copy relative z-10 order-2 flex flex-col items-center justify-center px-[clamp(1.5rem,5vw,5.25rem)] py-[clamp(3.5rem,7vw,6.5rem)] text-center lg:order-1">
            <span className="label-chip">Nuestra historia</span>
            <h1 className="history-story-hero-title site-display-title mx-auto mt-6 max-w-[11ch] text-[var(--earth)]">
              Más de 30 años aprendiendo de las abejas
            </h1>
            <p className="history-story-hero-description site-section-copy mx-auto mt-6 max-w-[36rem] text-[color:var(--muted-ink)]">
              Una historia familiar construida con trabajo, observación, innovación y un profundo respeto por la colmena.
            </p>
            <SectionLink href="#historia" className="history-story-hero-action secondary-button mt-8">
              <ArrowLeft className="h-4 w-4" />
              Volver a Nosotros
            </SectionLink>
          </div>

          <div className="history-editorial-photo history-story-hero-image relative order-1 min-h-[420px] overflow-hidden lg:order-2 lg:min-h-0">
            <Image
              src="/A_3.png"
              alt="Apicultores de AMIELAR trabajando con las abejas"
              fill
              priority
              className="history-editorial-photo-image object-cover object-[44%_48%]"
              sizes="(max-width: 1024px) 100vw, 56vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(30,27,19,0.02),rgba(30,27,19,0.16))] lg:bg-[linear-gradient(90deg,rgba(244,239,226,0.18),transparent_22%,rgba(30,27,19,0.1))]" />
          </div>
        </div>
      </section>

      <div className="history-manifesto-shell relative z-10 px-6 md:px-8">
        <div data-history-reveal className="history-manifesto">
          <span className="history-manifesto-divider" aria-hidden="true" />
          <p className="history-manifesto-copy">
            Más que un legado productivo: una herencia de visión.
          </p>
          <span className="history-manifesto-divider" aria-hidden="true" />
        </div>
      </div>

      <section
        id="los-comienzos"
        className="history-chapter history-viewport-chapter history-origin-chapter relative z-10 mx-auto max-w-[1360px] px-6 py-[clamp(5.5rem,10vw,9rem)] md:px-8 lg:px-10"
      >
        <div
          data-history-reveal
          className="history-chapter-grid history-viewport-grid grid items-center gap-[clamp(2.75rem,6vw,6.5rem)] md:grid-cols-2"
        >
          <div data-mobile-scroll-anchor="true" className="history-chapter-copy history-viewport-copy order-2 text-center md:order-1">
            <p className="history-chapter-marker">Los comienzos</p>
            <span className="label-chip">El origen</span>
            <h2 className="site-section-title mx-auto mt-6 max-w-[13ch] text-[var(--earth)]">
              Todo comenzó con 25 colmenas
            </h2>
            <p className={`mx-auto mt-6 max-w-[39rem] ${storyBodyClass}`}>
              Todo comenzó en la década de los 90, cuando Hugo Pablo Tosso decidió iniciarse en la apicultura con apenas 25 colmenas y dio vida a Colmenares Don Pablo. Con observación, trabajo y un profundo respeto por las abejas, el emprendimiento fue creciendo hasta convertirse en un proyecto reconocido dentro del sector.
            </p>
          </div>

          <div className="history-chapter-image history-editorial-photo history-viewport-image relative order-1 min-h-[360px] overflow-hidden rounded-[clamp(1.75rem,3vw,2.5rem)] border border-[rgba(67,59,38,0.1)] shadow-[0_24px_60px_rgba(67,59,38,0.1)] sm:min-h-[460px] md:order-2 lg:min-h-[580px]">
            <Image
              src="/A_2.png"
              alt="Cabaña de AMIELAR integrada al entorno rural"
              fill
              className="history-editorial-photo-image object-cover object-[54%_42%]"
              sizes="(max-width: 1024px) 100vw, 54vw"
            />
          </div>
        </div>
      </section>

      <div className="history-chapter-separator" aria-hidden="true" />

      <section
        id="el-legado"
        className="history-chapter history-viewport-chapter relative z-10 bg-[linear-gradient(180deg,rgba(156,160,122,0.08),rgba(255,255,255,0.34))]"
      >
        <div
          data-history-reveal
          className="history-chapter-grid history-viewport-grid mx-auto grid max-w-[1360px] items-center gap-[clamp(2.75rem,6vw,6.5rem)] px-6 py-[clamp(5.5rem,10vw,9rem)] md:grid-cols-2 md:px-8 lg:px-10"
        >
          <div className="history-chapter-image history-editorial-photo history-viewport-image relative min-h-[360px] overflow-hidden rounded-[clamp(1.75rem,3vw,2.5rem)] border border-[rgba(67,59,38,0.1)] shadow-[0_24px_60px_rgba(67,59,38,0.1)] sm:min-h-[460px] lg:min-h-[580px]">
            <Image
              src="/A_12.png"
              alt="Abejas sobre un panal de la colmena"
              fill
              className="history-editorial-photo-image object-cover object-[52%_48%]"
              sizes="(max-width: 1024px) 100vw, 54vw"
            />
          </div>

          <div data-mobile-scroll-anchor="true" className="history-chapter-copy history-viewport-copy text-center">
            <p className="history-chapter-marker">El legado</p>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--olive)]">
              Conocimiento apícola
            </p>
            <h2 className="site-section-title mx-auto mt-4 max-w-[13ch] text-[var(--earth)]">
              Más que producción de miel
            </h2>
            <p className={`mx-auto mt-6 max-w-[39rem] ${storyBodyClass}`}>
              La labor de Hugo no se limitó a la producción de miel. Se destacó especialmente por la cría de abejas reinas y celdas reales de reconocida genética, contribuyendo al fortalecimiento y mejora de numerosas colmenas. Esta actividad reflejaba su conocimiento técnico, su capacidad para seleccionar características valiosas y su permanente búsqueda de calidad.
            </p>
          </div>
        </div>
      </section>

      <div className="history-chapter-separator" aria-hidden="true" />

      <section className="history-chapter history-featured-chapter relative z-10 mx-auto max-w-[1360px] px-6 py-[clamp(5.5rem,10vw,9rem)] md:px-8 lg:px-10">
        <div
          data-history-reveal
          className="overflow-hidden rounded-[clamp(2rem,4vw,3rem)] bg-[var(--earth)] text-white shadow-[0_30px_76px_rgba(67,59,38,0.18)]"
        >
          <div className="history-featured-grid grid md:grid-cols-2">
            <div className="history-featured-copy order-2 flex flex-col items-center justify-center px-[clamp(1.5rem,5vw,5rem)] py-[clamp(3.5rem,7vw,6.5rem)] text-center md:order-1">
              <p className="history-chapter-marker">La innovación</p>
              <p className="history-innovation-eyebrow site-eyebrow text-[var(--gold-on-dark)]">
                Una visión adelantada a su tiempo
              </p>
              <h2 className="history-innovation-title site-section-title mx-auto mt-4 max-w-[13ch]">
                El extractor de 120 marcos
              </h2>
              <div className="history-innovation-body mx-auto mt-7 max-w-[42rem] space-y-5 text-[clamp(0.95rem,1.4vw,1.05rem)] leading-[1.8] text-white/76">
                <p>
                  En 2007, cuando la mayoría de las salas de extracción argentinas utilizaban equipos de menor porte, Hugo decidió incorporar un extractor centrífugo de 120 marcos, una tecnología prácticamente inexistente en el país en ese momento.
                </p>
                <p>
                  La decisión no significaba solamente adquirir una máquina de gran tamaño. También requería adaptar la infraestructura, la logística, el personal y toda la dinámica de cosecha. Era una apuesta por una escala productiva que todavía no estaba consolidada en la Argentina.
                </p>
              </div>

              <div className="history-innovation-milestone mx-auto mt-8 w-full max-w-[34rem]">
                <div className="history-innovation-milestone-data">
                  <div className="history-innovation-capacity">
                    <span className="history-innovation-number">120</span>
                    <span className="history-innovation-unit">Marcos</span>
                  </div>
                  <div className="history-innovation-year">
                    <span>Año</span>
                    <strong>2007</strong>
                  </div>
                </div>

                <div className="history-innovation-milestone-copy">
                  <p>
                    Una tecnología prácticamente inexistente en la Argentina de ese momento.
                  </p>
                  <p className="history-innovation-estimate">
                    Se estimaba que había menos de 10 salas con esta capacidad en el país.
                  </p>
                </div>
              </div>
            </div>

            <div className="history-editorial-photo history-featured-image relative order-1 min-h-[420px] md:order-2 md:min-h-[720px] lg:min-h-[780px]">
              <Image
                src="/A_5.jpeg"
                alt="Panal de miel como resultado del proceso apícola"
                fill
                className="history-editorial-photo-image object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 49vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,25,18,0.02),rgba(28,25,18,0.18))] lg:bg-[linear-gradient(90deg,rgba(67,59,38,0.28),transparent_22%)]" />
            </div>
          </div>
        </div>
      </section>

      <div className="history-chapter-separator" aria-hidden="true" />

      <section
        id="nace-amielar"
        className="history-chapter history-viewport-chapter relative z-10 mx-auto max-w-[1360px] px-6 py-[clamp(5.5rem,10vw,9rem)] md:px-8 lg:px-10"
      >
        <div
          data-history-reveal
          className="history-chapter-grid history-viewport-grid grid items-center gap-[clamp(2.75rem,6vw,6.5rem)] md:grid-cols-2"
        >
          <div className="history-chapter-image history-editorial-photo history-viewport-image relative min-h-[360px] overflow-hidden rounded-[clamp(1.75rem,3vw,2.5rem)] border border-[rgba(67,59,38,0.1)] shadow-[0_24px_60px_rgba(67,59,38,0.1)] sm:min-h-[460px] lg:min-h-[580px]">
            <Image
              src="/A_13.png"
              alt="Personas viviendo la experiencia actual de AMIELAR"
              fill
              className="history-editorial-photo-image object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 54vw"
            />
          </div>

          <div data-mobile-scroll-anchor="true" className="history-chapter-copy history-viewport-copy text-center">
            <p className="history-chapter-marker">Nace AMIELAR</p>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--olive)]">
              Segunda generación
            </p>
            <h2 className="site-section-title mx-auto mt-4 max-w-[14ch] text-[var(--earth)]">
              Una nueva generación continúa el legado
            </h2>
            <p className={`mx-auto mt-6 max-w-[39rem] ${storyBodyClass}`}>
              Hoy, esa visión continúa en una nueva generación. Así como Hugo se animó a incorporar una tecnología que todavía era excepcional en el país, AMIELAR se anima a abrir un nuevo camino con la api-inhalación, transformando el conocimiento apícola en una nueva manera de acercar la colmena a las personas.
            </p>
          </div>
        </div>
      </section>

      <div className="history-chapter-separator" aria-hidden="true" />

      <section
        id="hoy"
        className="history-today-section relative z-10 mx-auto max-w-[1440px] px-6 py-[clamp(5.5rem,10vw,9rem)] md:px-8 lg:px-10 xl:px-12"
      >
        <div data-history-reveal className="history-today-grid grid gap-4">
          <div data-mobile-scroll-anchor="true" className="history-today-quote flex flex-col justify-center rounded-[clamp(2rem,4vw,3rem)] border border-[rgba(205,179,93,0.18)] bg-[linear-gradient(135deg,rgba(255,253,248,0.96),rgba(241,235,221,0.94))] px-[clamp(1.5rem,7vw,7rem)] py-[clamp(4rem,8vw,7.5rem)] text-center shadow-[0_24px_64px_rgba(67,59,38,0.08)]">
            <p className="history-chapter-marker">Hoy</p>
            <span className="mx-auto block h-px w-16 bg-[var(--gold)]" />
            <blockquote className="history-today-quote-copy mx-auto mt-8 max-w-[22ch] font-serif text-[clamp(2rem,4.5vw,3.9rem)] italic leading-[1.12] tracking-[-0.025em] text-[var(--earth)]">
              “Cambian las herramientas, pero permanece la misma mirada: animarse a imaginar nuevas posibilidades para la apicultura con coraje, respeto y futuro.”
            </blockquote>
          </div>

          <div className="history-editorial-photo history-today-cta relative min-h-[540px] overflow-hidden rounded-[clamp(2rem,4vw,3rem)] shadow-[0_28px_72px_rgba(67,59,38,0.16)]">
            <Image
              src="/A_9.png"
              alt="Cabaña de AMIELAR entre el paisaje pampeano al atardecer"
              fill
              className="history-editorial-photo-image object-cover object-[50%_48%]"
              sizes="(max-width: 1024px) 100vw, 56vw"
            />
            <div className="history-today-overlay absolute inset-0" />
            <div className="history-today-cta-content relative mx-auto flex min-h-[540px] w-full max-w-[760px] flex-col items-center justify-center px-[clamp(1.5rem,6vw,6rem)] py-16 text-center text-white">
              <p className="site-eyebrow text-[var(--gold-on-dark)]">
                El legado continúa
              </p>
              <h2 className="site-section-title mt-5">
                Conocé cómo este legado se transforma en experiencia
              </h2>
              <p className="mt-5 text-[clamp(1rem,1.6vw,1.14rem)] leading-7 text-white/80">
                Viví Aire de Colmena en Arata, La Pampa.
              </p>
              <div className="history-final-actions mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a href="/aire-de-colmena" className="primary-button justify-center">
                  Descubrir Aire de Colmena
                  <MoveRight className="h-4 w-4" />
                </a>
                <ReserveLink className="secondary-button justify-center !border-white/28 !bg-white/12 !text-white backdrop-blur-sm hover:!bg-white/18 [&_svg]:!text-white">
                  Reservar turno
                  <MoveRight className="h-4 w-4" />
                </ReserveLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
