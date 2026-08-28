import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, MessageCircleMore, MoveRight } from "lucide-react";
import { FaInstagram } from "react-icons/fa";

import { BookingForm } from "@/components/BookingForm";
import { Card } from "@/components/Card";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Footer } from "@/components/Footer";
import { GalleryGrid } from "@/components/GalleryGrid";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { ReserveLink } from "@/components/ReserveLink";
import { SectionLink } from "@/components/SectionLink";
import { SectionTitle } from "@/components/SectionTitle";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { featuredAireDeColmenaFaqs } from "@/data/aireDeColmenaFaqs";
import { apiBenefits, featureCards, galleryItems, products } from "@/data/site";

const productsWhatsappMessage = "Hola, quisiera consultar por los productos de la colmena de AMIELAR.";

export default function Home() {
  return (
    <main id="top" className="min-h-screen bg-[var(--background)] text-[var(--ink)]">
      <div className="grain-overlay" />
      <Header />
      <Hero />

      <section
        id="historia"
        className="anchor-offset history-shell section-shell viewport-shell !max-w-[1440px] !px-6 md:!px-8 lg:!px-10 xl:!px-12"
      >
        <div className="w-full lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:pb-[clamp(1rem,2vh,1.5rem)]">
          <div className="mx-auto max-w-[54rem] text-center">
            <h2 className="site-section-title italic text-[var(--earth)]">¿Qué es AMIELAR?</h2>
            <p className="site-section-copy mx-auto mt-2 max-w-2xl text-[color:var(--muted-ink)]">
              Un proyecto familiar nacido del amor por las abejas, que une generaciones de conocimiento apícola con innovación y bienestar.
            </p>
          </div>

          <div className="mt-[clamp(0.625rem,1.5vh,1rem)] grid gap-[clamp(0.75rem,1.4vw,1rem)] lg:min-h-0 lg:flex-1 lg:grid-cols-[0.96fr_1.04fr] lg:items-stretch">
            <div className="grid content-start gap-[clamp(0.375rem,0.8vh,0.625rem)] lg:h-full lg:min-h-0 lg:grid-rows-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:content-stretch">
              <Card
                title={featureCards[0].title}
                description={featureCards[0].description}
                icon={featureCards[0].icon}
                accent="gold"
                href="#api-inhalacion"
                centeredHeader
                className="min-h-0 items-center justify-center p-[clamp(0.75rem,1.8vh,1rem)] text-center lg:h-full lg:py-[clamp(0.5rem,1.2vh,0.75rem)] [&_h3]:text-center [&_h3]:text-[1.45rem] [&_h3]:leading-tight lg:[&_h3]:w-auto [&_p]:mt-2 [&_p]:text-center [&_p]:text-[0.9rem] [&_p]:leading-[1.4rem] lg:[&_p]:mt-0 lg:[&_p]:text-[clamp(0.84rem,1.15vw,0.9rem)] lg:[&_p]:leading-[clamp(1.25rem,1.7vw,1.4rem)] [&_div.inline-flex]:mx-auto [&_div.inline-flex]:mb-3 [&_div.inline-flex]:h-10 [&_div.inline-flex]:w-10 lg:[&_div.inline-flex]:absolute lg:[&_div.inline-flex]:right-[calc(50%+3.75rem)] lg:[&_div.inline-flex]:mx-0 lg:[&_div.inline-flex]:mb-0 [&_div.inline-flex>svg]:h-4 [&_div.inline-flex>svg]:w-4"
              />
              <div className="grid items-start gap-[clamp(0.375rem,0.8vh,0.625rem)] sm:grid-cols-2 lg:h-full lg:min-h-0 lg:items-stretch">
                <Card
                  title={featureCards[2].title}
                  description={featureCards[2].description}
                  icon={featureCards[2].icon}
                  accent="gold"
                  href="/aire-de-colmena"
                  footer={
                    <span className="inline-flex items-center gap-2 text-[0.8rem] font-semibold text-[var(--olive)] transition-all duration-[300ms] group-hover:translate-x-1 group-hover:text-[var(--gold-deep)]">
                      Descubrir la experiencia
                      <MoveRight className="h-3.5 w-3.5 transition-transform duration-[300ms] group-hover:translate-x-1" />
                    </span>
                  }
                  className="min-h-0 items-center justify-center p-[clamp(0.7rem,1.45vh,0.9rem)] text-center sm:h-full [&>div:last-child]:mt-2.5 [&_h3]:text-center [&_h3]:text-[1.3rem] [&_h3]:leading-tight [&_p]:mt-1.5 [&_p]:text-center [&_p]:text-[clamp(0.76rem,1.02vw,0.84rem)] [&_p]:leading-[clamp(1.12rem,1.45vw,1.3rem)] [&_div.inline-flex]:mx-auto [&_div.inline-flex]:mb-2 [&_div.inline-flex]:h-9 [&_div.inline-flex]:w-9 [&_div.inline-flex>svg]:h-4 [&_div.inline-flex>svg]:w-4"
                />
                <a href="/nuestra-historia" className="site-card-interactive group relative flex h-fit min-h-0 flex-col items-center justify-center overflow-hidden bg-[var(--earth)] p-[clamp(0.7rem,1.45vh,0.9rem)] text-center text-white shadow-[0_20px_48px_rgba(67,59,38,0.18)] hover:brightness-[1.03] sm:h-full">
                  <div className="absolute right-0 top-0 h-14 w-14 bg-[radial-gradient(circle,rgba(205,179,93,0.18),transparent_68%)]" />
                  <div className="w-full">
                    <span className="site-eyebrow text-[var(--gold-on-dark)]">Historia familiar</span>
                    <h3 className="mt-0.5 font-serif text-[1.3rem] leading-tight transition-all duration-[300ms] group-hover:tracking-[-0.015em]">{featureCards[3].title}</h3>
                    <p className="mt-1.5 w-full text-[clamp(0.76rem,1.02vw,0.84rem)] leading-[clamp(1.12rem,1.45vw,1.3rem)] text-white/76">
                      <strong className="mb-0.5 block font-semibold text-white/90">El origen</strong>
                      {featureCards[3].description}
                    </p>
                  </div>
                  <span className="mt-2.5 inline-flex items-center gap-2 self-center text-[0.8rem] font-semibold text-[var(--olive)] transition-all duration-[300ms] group-hover:translate-x-1 group-hover:text-[var(--gold)]">
                    Conocer nuestra historia
                    <MoveRight className="h-3.5 w-3.5 transition-transform duration-[300ms] group-hover:translate-x-1" />
                  </span>
                </a>
              </div>
            </div>

            <article className="site-photo-frame relative min-h-[392px] overflow-hidden border border-[rgba(67,59,38,0.1)] md:min-h-[408px] lg:h-full lg:min-h-0">
              <Image
                src="/A_2.png"
                alt="Cabina de AMIELAR entre árboles y naturaleza"
                fill
                className="site-photo-image object-cover object-[54%_42%] brightness-[1.03] contrast-[1.04]"
                sizes="(max-width: 1280px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,21,23,0)_45%,rgba(18,21,23,0.34)_100%)]" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-white md:p-5 md:text-left">
                <span className="rounded-full border border-white/28 bg-white/10 px-2.5 py-0.5 text-[0.68rem] uppercase tracking-[0.22em] backdrop-blur-sm">
                  Naturaleza
                </span>
                <p className="mt-2 w-full font-serif text-[1.56rem] leading-[1.05] md:max-w-md md:text-[1.82rem]">
                  Aire de colmena, horizonte infinito y una respiración que encuentra
                  <br />
                  su propio ritmo.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section
        id="api-inhalacion"
        className="section-shell api-shell !items-start !max-w-[1440px] !overflow-hidden !py-2 md:!py-3"
      >
        <div className="flex h-full flex-col rounded-[42px] bg-[linear-gradient(180deg,#f8f4eb_0%,#f1ebdd_100%)] px-5 py-3 md:px-8 md:py-4 xl:px-10">
          <div className="grid flex-1 gap-5 lg:grid-cols-[0.88fr_1.12fr] lg:items-start xl:min-h-0 xl:items-stretch">
            <article className="site-photo-frame relative min-h-[225px] overflow-hidden border border-[rgba(67,59,38,0.1)] md:min-h-[260px] lg:h-full">
              <Image
                src="/A_3.png"
                alt="Personas interactuando con la colmena junto a la cabina de api-inhalacion"
                fill
                className="site-photo-image object-cover object-[38%_42%]"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,21,23,0)_48%,rgba(18,21,23,0.24)_100%)]" />
              <div className="absolute bottom-3 left-1/2 w-[calc(100%-1.5rem)] max-w-[18rem] -translate-x-1/2 rounded-[24px] border border-white/34 bg-white/72 px-4 py-2 text-center backdrop-blur-md md:left-3 md:w-auto md:translate-x-0 md:text-left">
                <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[var(--olive)]">Aire vivo</p>
                <p className="mt-1 text-[0.82rem] leading-5 text-[var(--ink)]">Microclima noble, silencioso y cálido.</p>
              </div>
            </article>

            <div className="api-content-column flex min-w-0 flex-col items-center lg:h-full lg:items-stretch xl:min-h-0">
              <SectionTitle
                title="Entrar en la colmena, respirar aire vivo"
                description="La api-inhalación invita a respirar el microclima de la colmena: un aire cargado de compuestos volátiles provenientes del propóleo, la cera, la miel, el polen, la jalea real, los aceites esenciales y las feromonas de las abejas. Una inmersión sensorial en un ambiente ancestral, construido y preservado por las abejas durante millones de años, donde la respiración, el sonido y la calma se encuentran."
                align="center"
                className="api-content-heading w-full max-w-none gap-1.5 [&_h2]:mx-auto [&_h2]:w-full [&_h2]:max-w-none [&_p]:mx-auto [&_p]:w-full [&_p]:max-w-none"
              />
              <p className="api-senses-eyebrow site-eyebrow mx-auto mt-2 text-center text-[var(--olive)]">
                Una experiencia para todos los sentidos
              </p>
              <div className="api-benefits-grid mt-2 grid flex-1 auto-rows-fr gap-3 md:grid-cols-2 xl:grid-cols-3">
                {apiBenefits.map((benefit, index) => (
                  <Card
                    key={benefit.title}
                    title={benefit.title}
                    description={benefit.description}
                    icon={benefit.icon}
                    accent={index === 1 ? "earth" : "gold"}
                    uniformContentRows
                    className="api-benefit-card w-full min-h-[180px] items-center p-4 text-center md:min-h-[128px] md:items-center md:p-4 md:text-center [&_div.inline-flex]:mx-auto [&_div.inline-flex]:mb-3 [&_div.inline-flex]:h-[2.25rem] [&_div.inline-flex]:w-[2.25rem] [&_div.inline-flex>svg]:h-4 [&_div.inline-flex>svg]:w-4 [&_h3]:text-center [&_h3]:text-[1.12rem] [&_h3]:leading-tight [&_p]:mt-2 [&_p]:text-center [&_p]:text-[0.78rem] [&_p]:leading-[1.24rem]"
                    />
                ))}
              </div>
              <div className="api-benefit-actions mx-auto mt-3 flex w-full max-w-[20rem] flex-col items-stretch justify-center gap-2.5 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center">
                <SectionLink
                  href="/aire-de-colmena#experiencias"
                  className="api-benefit-action primary-button w-full justify-center px-4 text-center text-[0.82rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#be9934]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4efdf] sm:w-auto"
                >
                  Ver todas las experiencias
                  <MoveRight className="h-4 w-4" />
                </SectionLink>
                <ReserveLink className="api-benefit-action secondary-button w-full justify-center px-4 text-center text-[0.82rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#be9934]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4efdf] sm:w-auto">
                  Reservar mi sesión
                </ReserveLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="productos" className="section-shell products-shell !items-center !py-3 md:!py-4">
        <div className="grid h-full items-center gap-6 xl:grid-cols-[0.8fr_1.2fr] xl:gap-5">
          <div className="flex h-full items-center justify-center self-center">
            <div className="flex w-full max-w-[560px] flex-col items-center justify-center gap-7 text-center">
              <SectionTitle
                eyebrow="Nuestra selección"
                title="Productos de la colmena"
                description="Cosechados con respeto, pensados para extender la experiencia de bienestar con una estética pulida y artesanal."
                align="center"
                className="w-full gap-3 [&_h2]:max-w-none [&_p]:mx-auto [&_p]:max-w-none"
              />
              <WhatsAppLink
                message={productsWhatsappMessage}
                className="primary-button justify-center px-5 text-center text-[0.88rem]"
              >
                Consultar productos
                <MessageCircleMore className="h-4 w-4" aria-hidden="true" />
              </WhatsAppLink>
            </div>
          </div>
          <div className="px-0 pb-3 md:mx-0 md:overflow-visible md:px-0 md:pb-0">
            <div className="grid gap-4 md:grid-cols-3">
              {products.map((product) => (
                <div key={product.name} className="w-full">
                  <ProductCard {...product} className="h-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="galeria" className="section-shell gallery-shell !py-4 md:!py-5">
        <div className="gallery-balance grid h-full gap-8 xl:grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)] xl:gap-10">
          <div className="gallery-copy-column flex h-full items-center">
            <div className="flex w-full flex-col items-center justify-center">
              <SectionTitle
                eyebrow="Galería y experiencia"
                title="Una atmósfera visual más cercana a la maqueta: noble, aireada y serena."
                description="Combinamos las referencias que nos compartiste con imágenes nuevas para completar la narrativa del paisaje, la cabaña y los productos."
                align="left"
                className="gallery-copy mx-auto w-full max-w-[560px] gap-3 !items-center !text-center [&_h2]:mx-auto [&_h2]:max-w-none [&_p]:mx-auto [&_p]:max-w-none xl:!items-start xl:!text-left xl:[&_h2]:mx-0 xl:[&_h2]:max-w-none xl:[&_p]:mx-0"
              />
              <a
                href="https://www.instagram.com/stories/highlights/18472447456098319/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ver AMIELAR por el mundo en Instagram"
                className="group mt-8 inline-flex max-w-full items-center justify-center gap-2 self-center rounded-full border border-[rgba(67,59,38,0.1)] bg-[rgba(255,255,255,0.58)] px-4 py-2.5 text-center text-[0.82rem] font-semibold text-[var(--olive)] shadow-[0_6px_16px_rgba(67,59,38,0.035)] transition-[transform,color,background-color,border-color,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:border-[rgba(205,179,93,0.24)] hover:bg-[rgba(255,255,255,0.78)] hover:text-[var(--earth)] hover:shadow-[0_10px_20px_rgba(67,59,38,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#be9934]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
              >
                <FaInstagram className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="whitespace-nowrap">AMIELAR por el mundo</span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="gallery-collage-column flex h-full items-center justify-center">
            <div className="w-full max-w-[760px]">
              <GalleryGrid items={galleryItems} />
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="section-shell faq-shell !items-center !py-4 md:!py-5">
        <div className="grid h-full gap-8 xl:grid-cols-[0.44fr_0.56fr] xl:items-center xl:gap-7">
          <div className="flex h-full items-center justify-center self-center">
            <SectionTitle
              eyebrow="Preguntas frecuentes"
              title="Dudas frecuentes antes de tu visita."
              description="Resolvemos las consultas más comunes para que llegues con tranquilidad a tu experiencia."
              align="center"
                className="w-full max-w-[560px] gap-4 [&_h2]:max-w-none [&_p]:max-w-none"
            />
          </div>
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex w-full flex-col items-center gap-4">
              <FaqAccordion items={featuredAireDeColmenaFaqs} variant="landing" />
              <SectionLink
                href="/aire-de-colmena#preguntas"
                className="primary-button justify-center px-5 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#be9934]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fbf8f1]"
              >
                Ver todas las preguntas
                <MoveRight className="h-4 w-4" />
              </SectionLink>
            </div>
          </div>
        </div>
      </section>

      <section
        id="modelo-amielar"
        aria-labelledby="home-model-title"
        className="anchor-offset relative z-10 mx-auto max-w-[1440px] px-5 py-[clamp(2.75rem,5vw,4.5rem)] md:px-8 lg:px-10 xl:px-12"
      >
        <div className="grid overflow-hidden rounded-[clamp(1.75rem,3vw,2.5rem)] border border-[rgba(67,59,38,0.1)] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(244,239,226,0.94))] shadow-[0_24px_64px_rgba(67,59,38,0.1)] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="order-2 flex flex-col items-center justify-center px-6 py-10 text-center sm:px-10 md:py-12 lg:order-1 lg:px-14 lg:py-14">
            <span className="site-eyebrow text-[var(--olive)]">MODELO AMIELAR</span>
            <h2 id="home-model-title" className="mt-3 max-w-[17ch] font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[0.98] tracking-[-0.03em] text-[var(--earth)]">
              ¿Imaginás un centro Aire de Colmena en tu espacio?
            </h2>
            <p className="mx-auto mt-5 max-w-[38rem] text-[clamp(0.95rem,1.3vw,1.08rem)] leading-7 text-[color:var(--muted-ink)]">
              AMIELAR acompaña la creación y puesta en marcha de nuevos centros, integrando infraestructura, equipamiento, capacitación y acompañamiento.
            </p>
            <Link
              href="/tu-centro-amielar"
              className="secondary-button mt-7 justify-center px-5 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#be9934]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4efdf]"
            >
              Conocé el modelo AMIELAR
              <MoveRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="site-photo-frame relative order-1 min-h-[240px] overflow-hidden border-b border-[rgba(67,59,38,0.1)] lg:order-2 lg:min-h-[360px] lg:border-b-0 lg:border-l">
            <Image
              src="/A_2.png"
              alt="Cabina Aire de Colmena de AMIELAR entre árboles"
              fill
              className="site-photo-image object-cover object-[54%_42%]"
              sizes="(max-width: 1023px) 100vw, 46vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,21,23,0.02)_30%,rgba(18,21,23,0.22)_100%)]" />
          </div>
        </div>
      </section>

      <section id="visitanos" className="section-shell visit-shell !items-center !py-4 md:!py-5">
        <div className="grid h-full gap-7 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-6">
          <div className="flex h-full items-center justify-center self-center">
            <div className="flex w-full max-w-[560px] flex-col items-center justify-center gap-6 text-center">
              <SectionTitle
                eyebrow="Visítanos en Arata"
                title="Una ubicación pensada para respirar más lento."
                description="Arata, La Pampa, se convierte en el telón perfecto para una experiencia de bienestar rural, cuidado artesanal y horizonte abierto."
                align="center"
                className="w-full gap-3 [&_h2]:max-w-none [&_p]:max-w-none"
              />
              <div className="grid w-full gap-3 md:grid-cols-2 lg:gap-4">
                <Card
                  title="WhatsApp"
                  description="+54 9 2302 39-3510"
                  icon={MessageCircleMore}
                  href="https://wa.me/5492302393510"
                  className="w-full min-h-[178px] justify-center px-5 py-7 text-center md:min-h-[164px] md:px-4 md:py-5 lg:px-5 [&_div.inline-flex]:mx-auto [&_div.inline-flex]:mb-4 [&_h3]:text-center [&_h3]:text-[1.18rem] [&_p]:mt-2 [&_p]:w-full [&_p]:max-w-full [&_p]:text-center [&_p]:text-[clamp(0.9rem,1vw,1rem)] [&_p]:leading-5.5 [&_p]:whitespace-normal"
                />
                <Card
                  title="Email"
                  description="administracion@amielarargentina.com"
                  icon={Mail}
                  accent="olive"
                  href="mailto:administracion@amielarargentina.com"
                  className="w-full min-h-[178px] justify-center px-5 py-7 text-center md:min-h-[164px] md:px-4 md:py-5 lg:px-5 [&_div.inline-flex]:mx-auto [&_div.inline-flex]:mb-4 [&_h3]:text-center [&_h3]:text-[1.18rem] [&_p]:mt-2 [&_p]:w-full [&_p]:max-w-full [&_p]:text-center [&_p]:text-[clamp(0.76rem,0.78vw,0.88rem)] [&_p]:leading-5 [&_p]:whitespace-normal [&_p]:break-words [&_p]:[overflow-wrap:anywhere] [&_p]:[word-break:break-word] md:[&_p]:whitespace-nowrap"
                />
              </div>
            </div>
          </div>
          <article className="card-shell w-full overflow-hidden p-3 shadow-[0_16px_36px_rgba(67,59,38,0.08)]">
            <div className="relative min-h-[320px] overflow-hidden rounded-[28px] md:min-h-[360px]">
              <iframe
                title="Mapa de Arata, La Pampa"
                src="https://www.google.com/maps?q=Arata,+La+Pampa,+Argentina&z=15&output=embed"
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div className="absolute left-1/2 top-5 -translate-x-1/2 rounded-full border border-white/40 bg-white/72 px-4 py-2 text-sm backdrop-blur-md md:left-5 md:translate-x-0">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[var(--olive)]" />
                  Arata, La Pampa
                </span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section id="reserva" className="section-shell viewport-shell reservation-shell !items-center !py-2 md:!py-3">
        <div
          data-reservation-card="true"
          className="reservation-composition mx-auto grid w-full max-w-[1320px] overflow-hidden lg:grid-cols-[0.45fr_0.55fr]"
        >
            <div className="reservation-image-block site-photo-frame order-1 relative min-h-[260px] lg:order-1 lg:h-full lg:min-h-0">
            <Image
              src="/A_13.png"
              alt="Campo pampeano dorado"
              fill
              className="site-photo-image object-cover object-[50%_44%]"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,21,23,0.08)_0%,rgba(18,21,23,0.32)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-center text-white md:p-6 md:text-left lg:p-6">
              <p className="font-serif text-[2rem] italic leading-tight md:text-[2.2rem]">Conecta con nosotros</p>
              <p className="mt-2.5 max-w-sm text-sm leading-5.5 text-white/82 md:text-[0.9rem]">
                Estamos en el corazón de La Pampa, apostando a una experiencia que mezcla paisaje, colmena y bienestar.
              </p>
              <div className="mt-3.5 space-y-1.5 text-[0.84rem]">
                <div className="flex items-center gap-3">
                  <MessageCircleMore className="h-4 w-4 text-[var(--olive)]" />
                  <span>WhatsApp · +54 9 2302 39-3510</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-[var(--olive)]" />
                  administracion@amielarargentina.com
                </div>
              </div>
            </div>
          </div>
          <div className="reservation-form-wrap order-2 flex items-center justify-center px-5 py-6 md:px-7 md:py-6 lg:order-2 lg:px-8 lg:py-3 xl:px-9">
            <BookingForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
