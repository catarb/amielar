import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowDown,
  Construction,
  GraduationCap,
  Handshake,
  Hexagon,
  House,
  MessageCircleMore,
  Rocket,
  Truck,
  UsersRound,
  Wind,
  Wrench,
} from "lucide-react";

import { Footer } from "@/components/Footer";
import { ModelPageHeader } from "@/components/ModelPageHeader";
import { WhatsAppLink } from "@/components/WhatsAppLink";

export const metadata: Metadata = {
  title: "Tu centro AMIELAR | AMIELAR",
  description:
    "Conocé el modelo AMIELAR para instalar y poner en marcha un nuevo centro Aire de Colmena con capacitación y acompañamiento.",
};

const whatsappMessage =
  "Hola, quisiera recibir información sobre el modelo para instalar un centro Aire de Colmena AMIELAR.";

const pillars = [
  {
    number: "01",
    title: "Instalamos",
    description:
      "Preparamos el centro y los elementos necesarios para dejar el espacio listo para comenzar a operar.",
    icon: Construction,
  },
  {
    number: "02",
    title: "Capacitamos",
    description:
      "Brindamos formación inicial para conocer el funcionamiento del centro, la experiencia del visitante y las tareas necesarias para su operación.",
    icon: GraduationCap,
  },
  {
    number: "03",
    title: "Lanzamos",
    description:
      "Acompañamos los primeros pasos y la puesta en marcha del nuevo centro AMIELAR.",
    icon: Rocket,
  },
  {
    number: "04",
    title: "Acompañamos",
    description:
      "El vínculo continúa después de la apertura, con acompañamiento, actualización y una red que permite compartir aprendizajes y experiencias.",
    icon: Handshake,
  },
] as const;

const inclusions = [
  {
    number: "01",
    title: "Infraestructura completa",
    description:
      "Una cabaña diseñada para alojar la experiencia Aire de Colmena, preparada para su instalación y funcionamiento.",
    items: [
      "Cabaña llave en mano.",
      "Diseño funcional AMIELAR.",
      "Instalación eléctrica.",
      "Rampas y terminaciones necesarias.",
      "Ambientación interior.",
    ],
    icon: House,
    tone: "honey",
  },
  {
    number: "02",
    title: "Sistema de inhalación",
    description:
      "El equipamiento necesario para conectar la experiencia del visitante con el aire proveniente de las colmenas de forma segura y controlada.",
    items: [
      "Equipos de inhalación.",
      "Aparato de respaldo.",
      "Máscaras.",
      "Mangueras.",
      "Conectores.",
      "Kit de inhalación.",
      "Elementos operativos necesarios.",
    ],
    icon: Wind,
    tone: "olive",
  },
  {
    number: "03",
    title: "Colmenas seleccionadas",
    description:
      "El centro se complementa con colmenas seleccionadas y el acompañamiento necesario para su incorporación al espacio.",
    items: [
      "Colmenas incorporadas.",
      "Selección de colmenas sanas y adecuadas.",
      "Instalación y puesta en marcha.",
      "Acompañamiento inicial en su manejo.",
    ],
    icon: Hexagon,
    honeycomb: true,
    tone: "honey",
  },
  {
    number: "04",
    title: "Experiencia del visitante",
    description:
      "Recursos pensados para que cada persona comprenda, explore y disfrute la experiencia AMIELAR más allá de la inhalación.",
    items: [
      "Material educativo.",
      "Cartelería.",
      "Audios guiados.",
      "Recursos informativos.",
      "Material para acompañar la visita.",
      "Ambientación temática.",
    ],
    icon: UsersRound,
    tone: "olive",
  },
  {
    number: "05",
    title: "Kit técnico y accesorios",
    description:
      "Herramientas, accesorios y elementos necesarios para facilitar la operación cotidiana y el mantenimiento del centro.",
    items: [
      "Herramientas básicas.",
      "Accesorios operativos.",
      "Elementos de mantenimiento.",
      "Repuestos iniciales.",
      "Insumos necesarios para la puesta en funcionamiento.",
    ],
    icon: Wrench,
    tone: "honey",
  },
  {
    number: "06",
    title: "Instalación y puesta en marcha",
    description:
      "AMIELAR acompaña la llegada, instalación y preparación del centro para que pueda comenzar a operar.",
    items: [
      "Transporte al destino.",
      "Montaje.",
      "Nivelación.",
      "Conexiones necesarias.",
      "Puesta en marcha.",
      "Capacitación inicial.",
    ],
    icon: Truck,
    tone: "olive",
  },
] as const;

export default function TuCentroAmielarPage() {
  return (
    <main className="model-page min-h-screen overflow-x-clip bg-[var(--background)] text-[var(--ink)]">
      <div className="grain-overlay" />
      <ModelPageHeader />

      <section
        id="inicio"
        className="relative z-10 mx-auto max-w-[1440px] scroll-mt-4 px-3 pb-[clamp(2.25rem,5vw,3.5rem)] pt-2 sm:px-6 md:px-8 lg:px-10 lg:pb-14 lg:pt-3 xl:px-12"
      >
        <div className="grid overflow-hidden rounded-[clamp(2rem,4vw,3rem)] border border-[rgba(67,59,38,0.1)] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(244,239,226,0.94))] shadow-[0_28px_72px_rgba(67,59,38,0.1)] lg:min-h-[530px] lg:grid-cols-[0.92fr_1.08fr]">
          <div className="order-2 flex flex-col items-center justify-center px-3 py-[clamp(2rem,4.5vw,3.75rem)] text-center sm:px-[clamp(1.25rem,4.5vw,4.75rem)] lg:order-1 lg:px-8 lg:py-8 xl:px-10">
            <span className="label-chip">Modelo AMIELAR</span>
            <h1 className="site-display-title mt-4 max-w-[14ch] text-[var(--earth)]">
              Tu propio centro Aire de Colmena
            </h1>
            <p className="mt-4 max-w-[36rem] text-[clamp(0.96rem,1.35vw,1.08rem)] leading-[1.72] text-[color:var(--muted-ink)]">
              Una propuesta integral para llevar la experiencia AMIELAR a nuevos espacios, con infraestructura, equipamiento, capacitación y acompañamiento para comenzar a operar.
            </p>
            <p className="mt-3 max-w-[38rem] text-[0.69rem] font-semibold uppercase leading-6 tracking-[0.17em] text-[var(--olive)] sm:text-[0.72rem] sm:tracking-[0.18em]">
              Instalamos. Capacitamos. Lanzamos. Acompañamos.
            </p>
            <div className="mt-7 flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
              <WhatsAppLink
                message={whatsappMessage}
                className="primary-button !h-11 !min-h-11 !w-auto max-w-full justify-center !gap-1.5 whitespace-nowrap !rounded-[0.95rem] !border-[rgba(164,131,53,0.14)] !bg-[linear-gradient(135deg,var(--honey-start),var(--honey-end))] !px-3.5 !py-0 text-center !text-[0.74rem] !font-semibold !shadow-[0_6px_14px_rgba(164,131,53,0.13)] transition-[transform,box-shadow,background,border-color] duration-200 hover:!bg-[linear-gradient(135deg,var(--honey-hover-start),var(--honey-hover-end))] hover:!shadow-[0_9px_18px_rgba(164,131,53,0.18)] sm:!gap-2 sm:!text-[0.76rem]"
              >
                Quiero conocer el modelo AMIELAR
                <MessageCircleMore className="h-3.5 w-3.5 shrink-0" strokeWidth={1.7} />
              </WhatsAppLink>
              <a
                href="#que-incluye"
                className="group inline-flex h-11 w-auto items-center justify-center gap-1.5 whitespace-nowrap rounded-[0.95rem] px-3 text-center text-[0.74rem] font-semibold text-[var(--olive)] transition-[color,background-color] duration-200 hover:bg-[rgba(156,160,122,0.07)] hover:text-[var(--earth)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 sm:gap-2 sm:text-[0.76rem]"
              >
                Ver qué incluye
                <ArrowDown className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-y-0.5" strokeWidth={1.7} />
              </a>
            </div>
          </div>

          <div className="site-photo-frame relative order-1 min-h-[clamp(300px,92vw,340px)] overflow-hidden sm:min-h-[420px] lg:order-2 lg:min-h-full">
            <Image
              src="/A_9.png"
              alt="Cabaña de Aire de Colmena AMIELAR entre la vegetación"
              fill
              priority
              className="site-photo-image object-cover object-[50%_46%]"
              sizes="(max-width: 1023px) 100vw, (max-width: 1440px) 54vw, 760px"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(25,22,16,0.01),rgba(25,22,16,0.12))] lg:bg-[linear-gradient(90deg,rgba(244,239,226,0.12),transparent_20%,rgba(25,22,16,0.08))]" />
          </div>
        </div>
      </section>

      <section
        className="relative z-10 bg-[linear-gradient(180deg,rgba(156,160,122,0.08),rgba(255,255,255,0.42))]"
      >
        <div className="mx-auto max-w-[1360px] px-4 py-[clamp(4.5rem,8vw,7rem)] sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div
            id="como-funciona"
            data-mobile-scroll-anchor="true"
            className="mx-auto max-w-[860px] scroll-mt-0 text-center"
          >
            <p className="site-eyebrow text-[var(--olive)]">Una propuesta integral</p>
            <h2 className="site-section-title mx-auto mt-3 max-w-[15ch] text-[var(--earth)]">
              Un modelo pensado para empezar acompañado
            </h2>
            <p className="mx-auto mt-4 max-w-[49rem] text-[clamp(0.96rem,1.25vw,1.06rem)] leading-[1.72] text-[color:var(--muted-ink)]">
              AMIELAR propone un modelo integral para la puesta en marcha de nuevos centros Aire de Colmena, combinando infraestructura, capacitación, acompañamiento y una identidad desarrollada a partir de años de experiencia apícola.
            </p>
          </div>

          <div className="mt-7 grid auto-rows-fr items-stretch gap-4 md:grid-cols-2 xl:grid-cols-4">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;

              return (
                <article
                  key={pillar.title}
                  style={{
                    backgroundImage: "url('/A_22.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundClip: "padding-box",
                  }}
                  className="card-shell group relative isolate grid h-full min-h-[320px] grid-rows-[1rem_3.5rem_2.5rem_1px_auto] justify-items-center gap-y-2.5 overflow-hidden border border-[rgba(95,90,72,0.12)] bg-[rgba(255,253,248,0.94)] p-[clamp(1.4rem,2.3vw,2rem)] text-center shadow-[var(--shadow-sm)] transition-[transform,box-shadow,border-color] duration-300 ease-out before:pointer-events-none before:absolute before:inset-0 before:z-0 before:bg-[rgba(251,248,241,0.96)] before:content-[''] [&>*]:relative [&>*]:z-10 hover:-translate-y-1 hover:border-[rgba(205,179,93,0.25)] hover:shadow-[var(--shadow-hover)] motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <span className="self-center font-serif text-[1rem] leading-none text-[rgba(112,115,84,0.6)]">
                    {pillar.number}
                  </span>
                  <span className="relative flex h-14 w-16 items-center justify-center bg-[rgba(190,153,52,0.34)] [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0_50%)]">
                    <span className="absolute inset-px bg-[#fbf5e6] [clip-path:inherit]" />
                    <Icon className="relative z-10 h-6 w-6 text-[var(--honey-ink)]" strokeWidth={1.55} />
                  </span>
                  <h3 className="site-card-title flex h-full w-full items-center justify-center text-[var(--earth)]">
                    {pillar.title}
                  </h3>
                  <span className="block h-px w-10 self-center bg-[rgba(190,153,52,0.48)]" />
                  <p className="max-w-[29rem] self-start text-[0.87rem] leading-[1.7] text-[color:var(--muted-ink)]">
                    {pillar.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="relative z-10 overflow-hidden bg-[linear-gradient(145deg,#666149_0%,#5f5a48_54%,#625e48_100%)] text-white"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(205,179,93,0.15),transparent_31%),radial-gradient(circle_at_88%_64%,rgba(178,183,140,0.14),transparent_34%)]" />
        <div className="relative mx-auto max-w-[1360px] px-4 pb-[clamp(3.5rem,6vw,5rem)] pt-[clamp(3.25rem,5vw,4.5rem)] sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div
            id="que-incluye"
            data-mobile-scroll-anchor="true"
            className="mx-auto max-w-[900px] scroll-mt-0 text-center"
          >
            <p className="site-eyebrow text-[#d9bd68]">
              Todo lo necesario para comenzar
            </p>
            <h2 className="site-section-title mx-auto mt-3 max-w-[17ch] text-[#fffaf0]">
              ¿Qué incluye tu centro AMIELAR?
            </h2>
            <p className="mx-auto mt-4 max-w-[52rem] text-[clamp(0.96rem,1.25vw,1.06rem)] leading-[1.68] text-[rgba(255,250,240,0.82)]">
              Una propuesta integral que reúne infraestructura, equipamiento, colmenas, recursos para la experiencia del visitante y acompañamiento para la puesta en marcha.
            </p>
          </div>

          <div className="model-inclusion-grid mt-6 grid auto-rows-fr items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
            {inclusions.map((inclusion) => {
              const Icon = inclusion.icon;
              const isHoney = inclusion.tone === "honey";

              return (
                <article
                  key={inclusion.title}
                  style={{
                    backgroundImage: "url('/A_18.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundClip: "padding-box",
                  }}
                  className={`model-inclusion-card group relative isolate flex h-full min-h-[410px] flex-col items-center overflow-hidden rounded-[clamp(1.5rem,2.4vw,2rem)] border p-[clamp(1.2rem,2vw,1.75rem)] text-center shadow-[0_18px_46px_rgba(24,22,16,0.12)] transition-[transform,box-shadow,border-color] duration-300 ease-out before:pointer-events-none before:absolute before:inset-0 before:z-0 before:bg-[rgba(251,248,241,0.88)] before:content-[''] [&>*]:relative [&>*]:z-10 hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(24,22,16,0.2)] motion-reduce:transform-none motion-reduce:transition-none ${
                    isHoney
                      ? "border-[rgba(205,179,93,0.28)] bg-[rgba(255,250,239,0.97)]"
                      : "border-[rgba(156,160,122,0.3)] bg-[rgba(244,245,235,0.97)]"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="font-serif text-[1.08rem] leading-none text-[rgba(67,59,38,0.48)]">
                      {inclusion.number}
                    </span>
                    <span
                      className={`relative flex h-14 w-16 items-center justify-center [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0_50%)] ${
                        isHoney
                          ? "bg-[rgba(190,153,52,0.34)] text-[var(--honey-ink)]"
                          : "bg-[rgba(112,115,84,0.3)] text-[var(--olive)]"
                      }`}
                    >
                      <span
                        className={`absolute inset-px [clip-path:inherit] ${
                          isHoney ? "bg-[#fbf5e6]" : "bg-[#edf0e3]"
                        }`}
                      />
                      {"honeycomb" in inclusion ? (
                        <span className="relative z-10 h-6 w-7 text-current" aria-hidden="true">
                          <Hexagon className="absolute left-0 top-[0.1rem] h-[1.05rem] w-[1.05rem]" strokeWidth={1.55} />
                          <Hexagon className="absolute right-0 top-[0.1rem] h-[1.05rem] w-[1.05rem]" strokeWidth={1.55} />
                          <Hexagon className="absolute bottom-0 left-1/2 h-[1.05rem] w-[1.05rem] -translate-x-1/2" strokeWidth={1.55} />
                        </span>
                      ) : (
                        <Icon className="relative z-10 h-6 w-6" strokeWidth={1.55} aria-hidden="true" />
                      )}
                    </span>
                  </div>

                  <h3 className="site-card-title mt-4 text-[var(--earth)]">
                    {inclusion.title}
                  </h3>
                  <span
                    className={`mt-3 block h-px w-12 ${
                      isHoney
                        ? "bg-[rgba(190,153,52,0.52)]"
                        : "bg-[rgba(112,115,84,0.45)]"
                    }`}
                  />
                  <p className="mt-3 max-w-[30rem] text-[0.88rem] leading-[1.62] text-[color:var(--muted-ink)]">
                    {inclusion.description}
                  </p>

                  <div className="mt-auto flex w-full flex-wrap justify-center gap-1 border-t border-[rgba(67,59,38,0.09)] pt-4">
                    {inclusion.items.map((item) => (
                      <span
                        key={item}
                        className={`rounded-full border px-2.5 py-0.5 text-[0.66rem] font-medium leading-[1.1rem] text-[var(--muted-ink)] ${
                          isHoney
                            ? "border-[rgba(190,153,52,0.2)] bg-[rgba(255,255,255,0.62)]"
                            : "border-[rgba(112,115,84,0.18)] bg-[rgba(255,255,255,0.58)]"
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mx-auto mt-[clamp(3rem,5.5vw,5rem)] max-w-[850px] border-t border-[rgba(255,250,240,0.16)] pt-[clamp(2.25rem,4vw,3.5rem)] text-center">
            <p className="site-eyebrow text-[#d9bd68]">
              Un centro completo, preparado para comenzar.
            </p>
            <p className="mx-auto mt-4 max-w-[40ch] font-serif text-[clamp(1.45rem,3vw,2.45rem)] leading-[1.32] text-[#fffaf0]">
              Nosotros acompañamos la instalación y la puesta en marcha; cada nuevo espacio se integra al modelo y a la experiencia AMIELAR.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
