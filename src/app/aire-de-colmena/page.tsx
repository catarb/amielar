import type { Metadata } from "next";
import Image from "next/image";
import {
  CalendarDays,
  Check,
  Clock3,
  Eye,
  FlaskConical,
  Gift,
  Leaf,
  MapPin,
  MessageCircleMore,
  MoveRight,
  ShieldCheck,
  Sparkles,
  Search,
  UsersRound,
} from "lucide-react";

import { AirPageHeader } from "@/components/AirPageHeader";
import { AirHeroMedia } from "@/components/AirHeroMedia";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Footer } from "@/components/Footer";
import { ReserveLink } from "@/components/ReserveLink";
import { aireDeColmenaFaqs } from "@/data/aireDeColmenaFaqs";

export const metadata: Metadata = {
  title: "Aire de Colmena | AMIELAR",
  description:
    "Conocé la experiencia de api-inhalación de AMIELAR en Arata, La Pampa: propuestas, información práctica y reservas.",
};

const WHATSAPP_NUMBER = "5492302393510";

const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

type Experience = {
  title: string;
  duration: string;
  items: Array<{ title: string; description: string }>;
  images: Array<{ src: string; alt: string; position?: string }>;
  note?: string;
  actionLabel: string;
  action: "reserve" | "whatsapp";
  whatsappMessage?: string;
};

const experiences: Experience[] = [
  {
    title: "Experiencia Aire de Colmena",
    duration: "Duración aproximada: 1 hora",
    images: [
      {
        src: "/A_8.png",
        alt: "Sesión individual de aire de colmena",
        position: "object-[50%_42%]",
      },
    ],
    items: [
      {
        title: "Bienvenida e introducción al mundo de las abejas",
        description:
          "Una presentación guiada, apoyada en una línea de tiempo, sobre la relación entre las personas y la colmena.",
      },
      {
        title: "Observación de las colmenas",
        description:
          "Un acercamiento a su organización, su actividad y su importancia para el ambiente.",
      },
      {
        title: "Sesión de api-inhalación",
        description:
          "Respiración del aire de la colmena, acompañada por el zumbido de las abejas y un relato guiado.",
      },
      {
        title: "Cierre de la experiencia",
        description:
          "Un momento final para compartir sensaciones y realizar preguntas.",
      },
    ],
    note: "Una experiencia íntima, con cupos reducidos y sin contacto directo con las abejas.",
    actionLabel: "Consultar disponibilidad",
    action: "reserve",
  },
  {
    title: "Experiencia Amanecer",
    duration: "Duración aproximada: 2 horas",
    images: [
      {
        src: "/A_10.png",
        alt: "Amanecer pampeano visto desde la cabaña",
        position: "object-[50%_48%]",
      },
      {
        src: "/A_14.jpeg",
        alt: "Propuesta dulce con miel para el cierre de la experiencia",
        position: "object-center",
      },
    ],
    items: [
      {
        title: "Bienvenida al amanecer",
        description:
          "Recepción en las primeras horas del día, cuando el paisaje pampeano empieza a despertar.",
      },
      {
        title: "Introducción al mundo de las abejas",
        description:
          "Una presentación guiada, apoyada en una línea de tiempo, sobre la relación entre las personas y la colmena.",
      },
      {
        title: "Observación de las colmenas",
        description:
          "Un acercamiento a su organización, su actividad y su importancia para el ambiente.",
      },
      {
        title: "Sesión extendida de api-inhalación",
        description:
          "Respiración del aire de la colmena, acompañada por el zumbido de las abejas y un relato guiado.",
      },
      {
        title: "Pausa contemplativa en la naturaleza",
        description:
          "Un momento al aire libre para observar el paisaje, registrar sensaciones y conectar con el silencio del entorno.",
      },
      {
        title: "Cierre con sabores de la colmena",
        description:
          "Café o té acompañado con una propuesta dulce con miel.",
      },
    ],
    note: "La opción al amanecer se ofrece en fechas seleccionadas.",
    actionLabel: "Consultar disponibilidad",
    action: "whatsapp",
    whatsappMessage:
      "¡Hola! Quisiera consultar las próximas fechas disponibles para la Experiencia Amanecer de AMIELAR.",
  },
  {
    title: "Aire de Colmena para niños",
    duration: "Duración aproximada: 45 minutos",
    images: [
      {
        src: "/A_11.jpeg",
        alt: "Niños observando las abejas dentro de la cabaña",
        position: "object-[42%_56%]",
      },
    ],
    items: [
      {
        title: "Bienvenida al mundo de las abejas",
        description:
          "Una presentación breve y entretenida para descubrir quiénes viven dentro de la colmena y qué tarea cumple cada abeja.",
      },
      {
        title: "Observación de las colmenas",
        description:
          "Un acercamiento a su organización, su actividad y su importancia para el ambiente.",
      },
      {
        title: "Lectura de ‘El perfume mágico de la colmena’",
        description:
          "Un cuento especialmente creado para acercar a los niños al universo de las abejas mediante la imaginación, los aromas y la curiosidad.",
      },
      {
        title: "Experiencia sensorial y api-inhalación",
        description:
          "Un momento para respirar el aire de la colmena, escuchar el zumbido de las abejas y reconocer sus aromas, de una manera simple, guiada y adaptada a la edad de los niños.",
      },
      {
        title: "Cierre creativo",
        description:
          "Un momento final para compartir sensaciones y conversar sobre lo aprendido.",
      },
    ],
    note: "Experiencia recomendada para niños mayores de 5 años, con acompañamiento de una persona adulta.",
    actionLabel: "Consultar disponibilidad",
    action: "whatsapp",
    whatsappMessage:
      "¡Hola! Quisiera consultar la disponibilidad de Aire de Colmena para niños.",
  },
];

const practicalItems = [
  { text: "1 o 2 horas", icon: Clock3, tone: "olive" },
  { text: "Cupos reducidos", icon: UsersRound, tone: "honey" },
  { text: "Reserva previa", icon: CalendarDays, tone: "olive" },
  { text: "Temporada: septiembre a abril", icon: Leaf, tone: "honey" },
  { text: "Arata, La Pampa", icon: MapPin, tone: "olive" },
] as const;

const practicalToneClasses = {
  olive:
    "border-[rgba(127,136,93,0.25)] bg-[linear-gradient(180deg,rgba(253,254,250,0.99),rgba(247,249,239,0.96))]",
  honey:
    "border-[rgba(190,153,52,0.28)] bg-[linear-gradient(180deg,rgba(255,254,249,0.99),rgba(253,248,231,0.96))]",
} as const;

const practicalIconToneClasses = {
  olive:
    "border-[rgba(127,136,93,0.25)] bg-[rgba(156,160,122,0.14)] text-[var(--olive)]",
  honey:
    "border-[rgba(190,153,52,0.28)] bg-[rgba(205,179,93,0.16)] text-[var(--gold-deep)]",
} as const;

const testimonials = [
  {
    quote:
      "Después de recorrer 35 kilómetros en bicicleta, sentí que podía respirar más profundamente. La experiencia me ayudó a bajar el ritmo y recuperar el aire.",
    author: "Ciclista visitante",
  },
  {
    quote:
      "Convivo con episodios de rinitis y sinusitis. Durante la experiencia percibí una respiración más libre y una sensación de alivio.",
    author: "Médico y visitante",
  },
  {
    quote:
      "Realizo una sesión de aire de colmena cada semana. Percibo mejoras en el día a día y encuentro un espacio de calma y conexión.",
    author: "Visitante frecuente",
  },
  {
    quote:
      "Me gustó escuchar a las abejas y mirar cómo hacían el panal.",
    author: "Niño participante, 6 años",
  },
  {
    quote:
      "Salgo con una sensación de respiración más profunda.",
    author: "Deportista y visitante frecuente",
  },
  {
    quote:
      "Durante la experiencia sentí una respiración más amplia y profunda. Al vocalizar después, percibí mayor comodidad, soltura y control del aire al cantar.",
    author: "Cantante y visitante",
  },
];

function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <article className="air-page-card card-shell site-card-informative group flex h-auto flex-col overflow-hidden lg:h-full">
      <div
        className={`air-experience-media grid h-[260px] gap-1 ${experience.images.length > 1 ? "grid-cols-2" : ""}`}
        data-image-count={experience.images.length}
      >
        {experience.images.map((image) => (
          <div key={image.src} className="relative min-w-0 overflow-hidden">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className={`object-cover ${image.position ?? "object-center"}`}
              sizes="(max-width: 1024px) 100vw, 31vw"
            />
          </div>
        ))}
      </div>

      <div className="air-experience-content flex flex-1 flex-col items-center p-[clamp(1.25rem,2.4vw,2rem)] text-center lg:px-6 lg:py-5">
        <p className="air-experience-duration w-full text-center text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--olive)]">
          {experience.duration}
        </p>
        <h3 className="air-experience-title site-card-title mt-2 flex w-full items-center justify-center text-center text-[var(--earth)] lg:min-h-[3.75rem]">
          {experience.title}
        </h3>

        <div className="air-experience-items mt-6 flex w-full flex-1 flex-col items-center gap-5">
          {experience.items.map((item) => (
            <div key={item.title} className="air-experience-item flex w-full max-w-[24rem] flex-col items-center text-center">
              <div className="air-experience-item-heading flex items-start justify-center gap-2.5">
                <span className="air-experience-item-icon mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(205,179,93,0.16)] text-[var(--gold-deep)]">
                  <Check className="h-3 w-3" />
                </span>
                <h4 className="text-[0.92rem] font-semibold leading-6 text-[var(--ink)]">
                  {item.title}
                </h4>
              </div>
              <p className="mt-1 text-center text-[0.84rem] leading-6 text-[color:var(--muted-ink)]">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-6">
          <div className="flex items-end lg:min-h-[6.125rem]">
            {experience.note ? (
              <p className="air-experience-note w-full rounded-[18px] border border-[rgba(156,160,122,0.18)] bg-[rgba(156,160,122,0.09)] px-4 py-3 text-center text-[0.78rem] leading-6 text-[var(--earth)]">
                {experience.note}
              </p>
            ) : null}
          </div>

          <div className={experience.note ? "mt-7" : "lg:mt-7"}>
            {experience.action === "reserve" ? (
              <ReserveLink className="air-card-action primary-button w-full justify-center text-center">
                {experience.actionLabel}
                <MessageCircleMore className="h-4 w-4" />
              </ReserveLink>
            ) : (
              <a
                href={whatsappLink(experience.whatsappMessage ?? "")}
                target="_blank"
                rel="noopener noreferrer"
                className="air-card-action primary-button w-full justify-center text-center"
              >
                {experience.actionLabel}
                <MessageCircleMore className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function AireDeColmenaPage() {
  return (
    <main className="air-page min-h-screen overflow-x-clip bg-[var(--background)] text-[var(--ink)]">
      <div className="grain-overlay" />
      <AirPageHeader />

      <section
        id="introduccion"
        className="relative z-10 mx-auto max-w-[1440px] scroll-mt-4 px-6 pb-[clamp(4rem,8vw,7rem)] pt-[clamp(0.75rem,2vw,1.25rem)] md:px-8 lg:h-[calc(100dvh-var(--header-offset,0px))] lg:px-10 lg:py-[clamp(0.625rem,1.4vh,1rem)] xl:px-12"
      >
        <div className="grid overflow-hidden rounded-[clamp(2rem,4vw,3rem)] border border-[rgba(67,59,38,0.1)] bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(244,239,226,0.94))] shadow-[0_28px_72px_rgba(67,59,38,0.1)] lg:h-full lg:min-h-0 lg:grid-cols-[0.96fr_1.04fr]">
          <div className="relative z-10 flex flex-col items-center justify-center px-[clamp(1.5rem,4.5vw,4.75rem)] py-[clamp(3.5rem,7vw,6rem)] text-center lg:min-h-0 lg:px-[clamp(2rem,3.8vw,4rem)] lg:py-[clamp(1.25rem,3.2vh,2.5rem)]">
            <span className="label-chip lg:px-3.5 lg:py-2 lg:text-[0.66rem]">Aire de Colmena</span>
            <h1 className="site-display-title mt-6 max-w-[11ch] text-[var(--earth)] lg:mt-[clamp(0.75rem,1.8vh,1.25rem)] lg:max-w-[12ch]">
              Entrar en la colmena, respirar aire vivo
            </h1>
            <div className="mx-auto mt-6 max-w-[35rem] space-y-4 text-[clamp(0.94rem,1.35vw,1.06rem)] leading-[1.72] text-[color:var(--muted-ink)] lg:mt-[clamp(0.75rem,1.8vh,1.25rem)] lg:max-w-[31rem] lg:space-y-[clamp(0.4rem,1.1vh,0.75rem)] lg:text-[clamp(0.82rem,1.05vw,0.96rem)] lg:leading-[1.48] xl:max-w-[33rem]">
              <p>
                La api-inhalación invita a respirar el microclima de la colmena: un aire cargado de compuestos volátiles provenientes del propóleo, la cera, la miel, el polen, la jalea real, los aceites esenciales y las feromonas de las abejas.
              </p>
              <p>
                Una inmersión sensorial en un ambiente ancestral, construido y preservado por las abejas durante millones de años, donde la respiración, el sonido y la calma se encuentran.
              </p>
            </div>
            <div className="air-intro-actions mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row lg:mt-[clamp(0.75rem,1.8vh,1.25rem)]">
              <a href="#experiencias" className="primary-button justify-center text-center lg:py-2.5">
                Ver experiencias
                <MoveRight className="h-4 w-4" />
              </a>
              <ReserveLink className="secondary-button justify-center text-center lg:py-2.5">
                Reservar turno
              </ReserveLink>
            </div>
          </div>

          <div className="site-photo-frame relative min-h-[440px] overflow-hidden lg:h-full lg:min-h-0">
            <AirHeroMedia />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(25,22,16,0.02),rgba(25,22,16,0.16))] lg:bg-[linear-gradient(90deg,rgba(244,239,226,0.12),transparent_20%,rgba(25,22,16,0.08))]" />
          </div>
        </div>
      </section>

      <section
        id="investigacion"
        className="air-science-section relative z-10 scroll-mt-4 px-6 md:px-8 lg:px-10 xl:px-12"
      >
        <div className="mx-auto max-w-[1180px] py-[clamp(3rem,5.5vw,4.75rem)]">
          <div data-mobile-scroll-anchor="true" className="mx-auto max-w-[800px] text-center">
            <p className="site-eyebrow text-[var(--olive)]">Curiosidad y observación</p>
            <h2 className="site-section-title mt-4 text-[var(--earth)]">
              La Ciencia detrás de AMIELAR
            </h2>
            <p className="air-science-intro mx-auto mt-4 max-w-[45rem] text-[clamp(0.96rem,1.3vw,1.08rem)] leading-[1.72] text-[color:var(--muted-ink)]">
              En AMIELAR también nos mueve una pregunta: ¿qué sucede cuando respiramos el aire de una colmena?
              <br className="hidden sm:block" />
              <br className="hidden sm:block" />
              Sabemos que en su interior existe un microambiente complejo, con numerosos compuestos volátiles provenientes de la actividad de las abejas y de productos como la miel, el propóleo, la cera y el polen. Pero todavía queda mucho por conocer.
            </p>
          </div>

          <div className="air-science-grid mt-[clamp(1.5rem,2.75vw,2.25rem)] grid gap-4 md:grid-cols-3">
            <article className="air-science-card card-shell site-card-informative flex flex-col items-center p-[clamp(1.1rem,1.8vw,1.5rem)] text-center">
              <span className="air-science-icon flex h-10 w-10 items-center justify-center rounded-[16px] border border-[rgba(127,136,93,0.25)] !bg-[rgba(248,245,235,0.96)] text-[var(--olive)]">
                <Search className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="site-card-title mt-4 text-[var(--earth)]">Lo que sabemos</h3>
              <p className="mt-2 text-[0.9rem] leading-6 text-[color:var(--muted-ink)]">
                El aire de la colmena contiene una gran diversidad de compuestos volátiles. Diferentes investigaciones han comenzado a estudiar su composición y su posible relación con experiencias de bienestar.
              </p>
            </article>

            <article className="air-science-card card-shell site-card-informative flex flex-col items-center p-[clamp(1.1rem,1.8vw,1.5rem)] text-center">
              <span className="air-science-icon flex h-10 w-10 items-center justify-center rounded-[16px] border border-[rgba(190,153,52,0.28)] !bg-[rgba(252,247,231,0.98)] text-[var(--gold-deep)]">
                <Eye className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="site-card-title mt-4 text-[var(--earth)]">Lo que queremos conocer</h3>
              <p className="mt-2 text-[0.9rem] leading-6 text-[color:var(--muted-ink)]">
                Nos interesa observar qué sensaciones experimentan las personas durante una sesión y qué nuevas preguntas pueden surgir sobre este particular ambiente de la colmena.
              </p>
            </article>

            <article className="air-science-card card-shell site-card-informative flex flex-col items-center p-[clamp(1.1rem,1.8vw,1.5rem)] text-center">
              <span className="air-science-icon flex h-10 w-10 items-center justify-center rounded-[16px] border border-[rgba(127,136,93,0.25)] !bg-[rgba(248,245,235,0.96)] text-[var(--olive)]">
                <FlaskConical className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="site-card-title mt-4 text-[var(--earth)]">Explorar antes que prometer</h3>
              <p className="mt-2 text-[0.9rem] leading-6 text-[color:var(--muted-ink)]">
                La evidencia disponible todavía es limitada. Por eso AMIELAR no presenta el Aire de Colmena como un tratamiento médico: nuestra propuesta es observar, registrar y contribuir a generar conocimiento.
              </p>
            </article>
          </div>

          <p className="air-science-closing mx-auto mt-[clamp(2rem,4vw,3.25rem)] max-w-[45rem] text-center font-serif text-[clamp(1.15rem,2vw,1.45rem)] leading-[1.45] text-[var(--earth)]">
            Una observación puede convertirse en una pregunta. Una pregunta, en una nueva investigación.
          </p>
        </div>
      </section>

      <section
        id="experiencias"
        className="relative z-10 scroll-mt-4 bg-[linear-gradient(180deg,rgba(156,160,122,0.08),rgba(255,255,255,0.4))]"
      >
        <div className="mx-auto max-w-[1440px] px-6 py-[clamp(4.5rem,9vw,8rem)] md:px-8 lg:px-10 xl:px-12">
          <div data-mobile-scroll-anchor="true" className="mx-auto max-w-[820px] text-center">
            <p className="site-eyebrow text-[var(--olive)]">
              Elegí tu experiencia
            </p>
            <h2 className="site-section-title mt-4 text-[var(--earth)]">
              Distintas formas de acercarte a la colmena
            </h2>
          </div>

          <div className="mt-[clamp(1.75rem,3vw,2.75rem)] grid items-stretch gap-5 lg:grid-cols-3">
            {experiences.map((experience) => (
              <ExperienceCard key={experience.title} experience={experience} />
            ))}
          </div>
        </div>
      </section>

      <section
        id="tarjeta-regalo"
        className="air-gift-section relative z-10 scroll-mt-4 px-6 py-[clamp(3.5rem,7vw,5.5rem)] md:px-8 lg:px-10 xl:px-12"
      >
        <div className="air-gift-shell mx-auto grid max-w-[1180px] overflow-hidden lg:grid-cols-[0.82fr_1.18fr]">
          <div className="air-gift-visual relative min-h-[320px] overflow-hidden">
            <Image
              src="/A_22.png"
              alt="Abejas de la colmena de AMIELAR"
              fill
              className="air-gift-image object-cover"
              sizes="(max-width: 1023px) 100vw, (max-width: 1440px) 41vw, 484px"
            />
            <span className="air-gift-emblem z-10 flex items-center justify-center" aria-hidden="true">
              <Gift className="h-11 w-11" strokeWidth={1.45} />
            </span>
          </div>

          <div className="air-gift-content flex flex-col items-center justify-center p-[clamp(2rem,4.5vw,4.25rem)] text-center">
            <span className="air-gift-label inline-flex items-center gap-2 rounded-full border border-[rgba(205,179,93,0.3)] bg-[rgba(252,247,237,0.92)] px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.19em] text-[var(--honey-ink)]">
              <Gift className="h-3.5 w-3.5" aria-hidden="true" />
              Tarjeta de regalo AMIELAR
            </span>
            <h2 className="air-gift-title site-section-title mx-auto mt-5 max-w-[13ch] text-center text-[var(--earth)]">
              Regalá una experiencia diferente
            </h2>
            <p className="air-gift-intro mx-auto mt-5 max-w-[43rem] text-center text-[clamp(0.96rem,1.3vw,1.08rem)] leading-[1.72] text-[color:var(--muted-ink)]">
              Una pausa, un momento de conexión y una experiencia para disfrutar con todos los sentidos. También podés regalar una sesión de Aire de Colmena en AMIELAR.
            </p>
            <p className="air-gift-copy mx-auto mt-4 max-w-[40rem] border-t border-[rgba(190,153,52,0.34)] pt-4 text-center text-[0.88rem] leading-6 text-[var(--earth)]">
              Elegí regalar bienestar, naturaleza y una experiencia fuera de lo cotidiano. Consultanos para preparar tu tarjeta de regalo.
            </p>
            <a
              href={whatsappLink(
                "Hola, quisiera consultar por una tarjeta de regalo para una experiencia de Aire de Colmena en AMIELAR.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="air-gift-action primary-button mx-auto mt-7 justify-center text-center"
            >
              Quiero regalar una experiencia
              <MessageCircleMore className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section
        id="informacion-practica"
        className="air-practical-section relative z-10 mx-auto max-w-[1280px] scroll-mt-4 px-6 py-[clamp(4.5rem,9vw,8rem)] md:px-8 lg:px-10"
      >
        <div data-mobile-scroll-anchor="true" className="air-practical-heading mx-auto max-w-[760px] text-center">
          <p className="site-eyebrow text-[var(--olive)]">
            Antes de venir
          </p>
          <h2 className="air-practical-title site-section-title mt-4 text-[var(--earth)]">
            Información práctica
          </h2>
        </div>

        <div className="air-practical-grid mt-[clamp(2.5rem,5vw,4rem)] grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {practicalItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.text}
                className={`air-practical-card site-card-informative group relative flex min-h-[160px] w-full flex-col items-center justify-center overflow-hidden border px-5 py-6 text-center backdrop-blur-[14px] hover:bg-[linear-gradient(180deg,rgba(255,254,250,0.99),rgba(252,247,229,0.9))] ${practicalToneClasses[item.tone]}`}
              >
                <span
                  className={`air-practical-icon flex h-12 w-12 items-center justify-center rounded-[18px] border shadow-[0_8px_18px_rgba(67,59,38,0.06)] ${practicalIconToneClasses[item.tone]}`}
                >
                  <Icon className="h-[1.35rem] w-[1.35rem]" />
                </span>
                <p
                  className={`air-practical-card-text mt-4 text-[0.88rem] font-semibold leading-6 text-[var(--earth)] ${
                    item.text === "Temporada: septiembre a abril"
                      ? "whitespace-nowrap !text-[0.74rem]"
                      : ""
                  }`}
                >
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>

        <div className="air-practical-lower-grid mt-[clamp(1.5rem,2.5vw,2rem)] grid items-stretch gap-4 lg:grid-cols-[0.76fr_1.24fr]">
          <div
            className="air-practical-lower-card site-card-informative group grid h-full overflow-hidden border border-[rgba(127,136,93,0.25)] bg-[linear-gradient(145deg,rgba(249,251,242,0.97),rgba(253,253,248,0.94))] text-center md:grid-cols-[42%_1fr]"
          >
            <div className="air-practical-lower-image site-photo-frame relative min-h-[180px] overflow-hidden md:min-h-0">
              <Image
                src="/A_22.png"
                alt="Persona realizando una sesión segura de aire de colmena"
                fill
                className="site-photo-image object-cover object-[53%_42%]"
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 42vw, 15vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_65%,rgba(25,22,16,0.08))] md:bg-[linear-gradient(90deg,transparent_72%,rgba(249,251,242,0.22))]" />
            </div>
            <div className="air-practical-lower-content flex flex-col items-center justify-center p-[clamp(1.5rem,2.4vw,2.25rem)]">
              <span className="air-practical-lower-icon flex h-12 w-12 items-center justify-center rounded-[18px] border border-[rgba(127,136,93,0.28)] bg-[rgba(156,160,122,0.2)] text-[var(--olive)] shadow-[0_8px_18px_rgba(67,59,38,0.06)]">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <p className="air-practical-lower-label mt-5 text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[var(--olive)]">
                Experiencia segura
              </p>
              <p className="air-practical-safety-copy mt-2 max-w-[30rem] font-serif text-[clamp(1.35rem,2.2vw,1.75rem)] font-semibold leading-[1.25] text-[var(--earth)]">
                No existe contacto directo con las abejas durante la inhalación.
              </p>
            </div>
          </div>
          <div
            className="air-practical-lower-card site-card-informative group grid h-full overflow-hidden border border-[rgba(205,179,93,0.24)] bg-[linear-gradient(145deg,rgba(255,253,246,0.98),rgba(254,250,238,0.94))] text-center md:grid-cols-[38%_1fr]"
          >
            <div className="air-practical-lower-image site-photo-frame relative min-h-[180px] overflow-hidden md:min-h-0">
              <Image
                src="/A_10.png"
                alt="Paisaje pampeano al amanecer visto desde la cabaña"
                fill
                className="site-photo-image object-cover object-[50%_48%]"
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 38vw, 26vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_65%,rgba(25,22,16,0.08))] md:bg-[linear-gradient(90deg,transparent_72%,rgba(255,253,246,0.2))]" />
            </div>
            <div className="air-practical-lower-content flex flex-col items-center justify-center p-[clamp(1.5rem,2.4vw,2.25rem)]">
              <span className="air-practical-lower-icon flex h-12 w-12 items-center justify-center rounded-[18px] border border-[rgba(205,179,93,0.3)] bg-[rgba(205,179,93,0.19)] text-[var(--gold-deep)] shadow-[0_8px_18px_rgba(164,131,53,0.07)]">
                <Sparkles className="h-6 w-6" />
              </span>
              <p className="air-practical-lower-label mt-5 text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[var(--honey-ink)]">
                Importante
              </p>
              <p className="air-practical-important-copy mt-2 max-w-[48rem] text-[0.9rem] leading-7 text-[color:var(--muted-ink)]">
                La experiencia es de carácter turístico, sensorial y de bienestar. No sustituye tratamientos ni indicaciones médicas. Ante alergias, enfermedades respiratorias o condiciones particulares, se recomienda consultar previamente con un profesional de la salud.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="testimonios"
        className="air-testimonials-section relative z-10 scroll-mt-4 bg-[var(--earth)] text-white"
      >
        <div className="air-testimonials-inner mx-auto max-w-[1360px] px-6 py-[clamp(5rem,10vw,9rem)] md:px-8 lg:px-10">
          <div data-mobile-scroll-anchor="true" className="mx-auto max-w-[820px] text-center">
            <p className="air-testimonials-label site-eyebrow text-[var(--gold-on-dark)]">
              Testimonios
            </p>
            <h2 className="air-testimonials-title site-section-title mt-4">
              Lo que cuentan quienes vivieron la experiencia
            </h2>
            <p className="air-testimonials-note mx-auto mt-5 max-w-[44rem] text-[0.84rem] leading-6 text-white/76">
              Relatos personales de visitantes; cada experiencia es única y no constituye evidencia médica.
            </p>
          </div>

          <div className="air-testimonials-grid mt-[clamp(2.75rem,5vw,4.75rem)] grid gap-4 md:grid-cols-2 lg:auto-rows-fr lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <figure
                key={testimonial.author}
                className="air-testimonial-card site-card-informative relative flex min-h-[260px] flex-col justify-start border border-white/10 bg-white/[0.07] p-[clamp(1.4rem,2.7vw,2.25rem)] backdrop-blur-sm"
              >
                <div className="air-testimonial-body relative z-10 flex h-full w-full flex-1 flex-col">
                  <span
                    aria-hidden="true"
                      className="air-testimonial-quote-mark pointer-events-none block self-start font-serif text-[var(--gold-on-dark)]"
                  >
                    “
                  </span>
                  <blockquote className="air-testimonial-quote max-w-[38rem] font-serif text-[clamp(1.28rem,2vw,1.6rem)] leading-[1.35] text-white/90">
                    “{testimonial.quote}”
                  </blockquote>
                  <div className="air-testimonial-signature flex flex-col">
                    <span
                      aria-hidden="true"
                      className="air-testimonial-divider block h-px w-10 bg-[var(--gold)]"
                    />
                    <figcaption className="air-testimonial-author text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--gold-on-dark)]">
                      {testimonial.author}
                    </figcaption>
                  </div>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section
        id="preguntas"
        className="air-faq-section relative z-10 scroll-mt-4 px-6 md:px-8 lg:px-10"
      >
        <div data-mobile-scroll-anchor="true" className="air-faq-heading mx-auto max-w-[1180px] text-center">
          <p className="air-faq-label site-eyebrow text-[var(--olive)]">
            Preguntas frecuentes
          </p>
          <h2 className="air-faq-title site-section-title text-[var(--earth)]">
            Todo lo que necesitás saber antes de reservar
          </h2>
        </div>

        <div className="air-faq-list">
          <FaqAccordion items={aireDeColmenaFaqs} columns={2} variant="air" />
        </div>
      </section>

      <section
        id="reservar"
        className="relative z-10 mx-auto max-w-[1440px] scroll-mt-4 px-6 pb-[clamp(4rem,8vw,7rem)] md:px-8 lg:px-10 xl:px-12"
      >
        <div className="site-photo-frame relative min-h-[540px] overflow-hidden">
          <Image
            src="/A_19.png"
            alt="Cabaña de AMIELAR en el entorno natural de Arata"
            fill
            className="site-photo-image object-cover object-[50%_32%]"
            sizes="(max-width: 1440px) 100vw, 1344px"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(36,33,25,0.78),rgba(36,33,25,0.44)_58%,rgba(36,33,25,0.1))]" />
          <div className="relative mx-auto flex min-h-[540px] w-full max-w-[740px] flex-col items-center justify-center px-[clamp(1.5rem,6vw,6rem)] py-16 text-center text-white">
            <p className="site-eyebrow text-[var(--gold-on-dark)]">
              Aire, naturaleza y pausa
            </p>
            <h2 className="site-section-title mt-5">
              Regalate una hora para respirar distinto
            </h2>
            <p className="mt-5 text-[clamp(1rem,1.6vw,1.14rem)] leading-7 text-white/80">
              Viví Aire de Colmena en Arata, La Pampa.
            </p>
            <div className="air-final-actions mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ReserveLink className="primary-button justify-center">
                Reservar experiencia
                <MoveRight className="h-4 w-4" />
              </ReserveLink>
              <a
                href={whatsappLink(
                  "¡Hola! Quisiera recibir más información sobre Aire de Colmena y consultar disponibilidad.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="secondary-button justify-center !border-white/28 !bg-white/12 !text-white backdrop-blur-sm hover:!bg-white/18 [&_svg]:!text-white"
              >
                Consultar por WhatsApp
                <MessageCircleMore className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
