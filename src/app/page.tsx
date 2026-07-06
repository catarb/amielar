import Image from "next/image";
import { Mail, MapPin, MessageCircleMore, MoveRight } from "lucide-react";

import { BookingForm } from "@/components/BookingForm";
import { Card } from "@/components/Card";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { GalleryGrid } from "@/components/GalleryGrid";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { SectionTitle } from "@/components/SectionTitle";
import { apiBenefits, faqs, featureCards, galleryItems, products } from "@/data/site";

export default function Home() {
  return (
    <main id="top" className="min-h-screen bg-[var(--background)] text-[var(--ink)]">
      <div className="grain-overlay" />
      <Header />
      <Hero />

      <section
        id="historia"
        className="anchor-offset section-shell viewport-shell !max-w-[1440px] !px-6 md:!px-8 lg:!px-10 xl:!px-12"
      >
        <div className="w-full">
          <div className="mx-auto max-w-[54rem] text-center">
            <h2 className="font-serif text-[2.15rem] italic leading-tight text-[var(--earth)] md:text-[2.3rem]">¿Qué es AMIELAR?</h2>
            <p className="mx-auto mt-2 max-w-2xl text-[0.94rem] leading-6 text-[color:var(--muted-ink)] md:text-[1rem]">
              Un proyecto familiar que nace del amor por las abejas y la búsqueda de un bienestar integral en sintonía con el paisaje pampeano.
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 md:items-stretch xl:grid-cols-[0.98fr_1.02fr]">
            <div className="grid gap-3">
              <Card
                title={featureCards[0].title}
                description={featureCards[0].description}
                icon={featureCards[0].icon}
                accent="gold"
                className="min-h-[176px] p-4 md:p-5 [&_h3]:text-[1.45rem] [&_h3]:leading-tight [&_p]:mt-2 [&_p]:text-[0.9rem] [&_p]:leading-6 [&_div.inline-flex]:mb-3 [&_div.inline-flex]:h-10 [&_div.inline-flex]:w-10 [&_div.inline-flex>svg]:h-4 [&_div.inline-flex>svg]:w-4"
              />
              <div className="grid gap-3 md:grid-cols-[0.9fr_1.1fr]">
                <Card
                  title={featureCards[2].title}
                  description={featureCards[2].description}
                  icon={featureCards[2].icon}
                  accent="gold"
                  className="min-h-[194px] p-4 md:p-5 [&_h3]:text-[1.38rem] [&_h3]:leading-tight [&_p]:mt-2 [&_p]:text-[0.88rem] [&_p]:leading-6 [&_div.inline-flex]:mb-3 [&_div.inline-flex]:h-10 [&_div.inline-flex]:w-10 [&_div.inline-flex>svg]:h-4 [&_div.inline-flex>svg]:w-4"
                />
                <article className="relative min-h-[194px] overflow-hidden rounded-[26px] bg-[var(--earth)] p-4 text-white shadow-[0_20px_48px_rgba(67,59,38,0.18)] md:p-5">
                  <div className="absolute right-0 top-0 h-14 w-14 bg-[radial-gradient(circle,rgba(212,162,59,0.2),transparent_68%)]" />
                  <span className="text-[0.7rem] uppercase tracking-[0.22em] text-white/68">Historia familiar</span>
                  <h3 className="mt-2 font-serif text-[1.38rem] leading-tight">{featureCards[3].title}</h3>
                  <p className="mt-2 max-w-sm text-[0.88rem] leading-6 text-white/76">{featureCards[3].description}</p>
                  <a href="#api-inhalacion" className="mt-3 inline-flex items-center gap-2 text-[0.84rem] font-medium text-[var(--gold)]">
                    Leer más
                    <MoveRight className="h-4 w-4" />
                  </a>
                </article>
              </div>
            </div>

            <article className="relative min-h-[392px] overflow-hidden rounded-[30px] border border-[rgba(67,59,38,0.1)] shadow-[0_24px_60px_rgba(67,59,38,0.1)] md:min-h-[408px]">
              <Image
                src="/ai/pampa-tree-golden.png"
                alt="Paisaje pampeano al atardecer"
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,21,23,0)_45%,rgba(18,21,23,0.34)_100%)]" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white md:p-5">
                <span className="rounded-full border border-white/28 bg-white/10 px-2.5 py-0.5 text-[0.68rem] uppercase tracking-[0.22em] backdrop-blur-sm">
                  Naturaleza
                </span>
                <p className="mt-2 max-w-md font-serif text-[1.56rem] leading-[1.05] md:text-[1.82rem]">
                  Aire puro, horizonte infinito y un paisaje que devuelve perspectiva.
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
        <div className="flex h-full flex-col rounded-[42px] bg-[linear-gradient(180deg,#f7f3eb_0%,#f2eee6_100%)] px-5 py-3 md:px-8 md:py-4 xl:px-10">
          <div className="grid flex-1 gap-5 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
            <article className="relative min-h-[225px] overflow-hidden rounded-[32px] border border-[rgba(67,59,38,0.1)] shadow-[0_26px_64px_rgba(67,59,38,0.12)] md:min-h-[260px] lg:h-full">
              <Image
                src="/ai/api-cabin-interior.png"
                alt="Interior calido de una cabana de api-inhalacion"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,21,23,0)_48%,rgba(18,21,23,0.24)_100%)]" />
              <div className="absolute bottom-3 left-3 max-w-[18rem] rounded-[24px] border border-white/34 bg-white/72 px-4 py-2 backdrop-blur-md">
                <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[var(--gold-deep)]">Aire vivo</p>
                <p className="mt-1 text-[0.82rem] leading-5 text-[var(--ink)]">Microclima noble, silencioso y cálido.</p>
              </div>
            </article>

            <div className="min-w-0 lg:flex lg:h-full lg:flex-col">
              <SectionTitle
                title="Entrar en la colmena, respirar aire vivo"
                description="La api-inhalación permite absorber el aire saturado de propóleos, cera y aceites esenciales que las abejas mantienen dentro de su hogar. Es una inmersión en un microclima único de calma y conexión."
                align="center"
                className="max-w-none gap-1.5 [&_h2]:text-[1.58rem] [&_h2]:leading-[1.02] md:[&_h2]:text-[1.9rem] [&_p]:text-[0.78rem] [&_p]:leading-[1.3rem] md:[&_p]:text-[0.86rem]"
              />
              <div className="mt-3 grid flex-1 gap-3 sm:grid-cols-2">
                {apiBenefits.map((benefit, index) => (
                  <Card
                    key={benefit.title}
                    title={benefit.title}
                    description={benefit.description}
                    icon={benefit.icon}
                    accent={index === 1 ? "earth" : "gold"}
                    className="flex min-h-[128px] flex-col justify-center p-4 text-center md:p-5 [&_div.inline-flex]:mx-auto [&_div.inline-flex]:mb-3 [&_div.inline-flex]:h-[2.25rem] [&_div.inline-flex]:w-[2.25rem] [&_div.inline-flex>svg]:h-4 [&_div.inline-flex>svg]:w-4 [&_h3]:text-[1.12rem] [&_h3]:leading-tight [&_p]:mt-2 [&_p]:text-[0.8rem] [&_p]:leading-[1.35rem]"
                  />
                ))}
              </div>
              <a href="#reserva" className="primary-button mt-3 inline-flex h-10.5 self-center px-4.5 py-0 text-[0.82rem]">
                Reservar mi sesión
              </a>
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
                className="w-full gap-3 [&_h2]:text-[2.25rem] [&_h2]:leading-[1.02] md:[&_h2]:text-[2.65rem] [&_p]:mx-auto [&_p]:max-w-[28ch] [&_p]:text-[0.96rem] [&_p]:leading-7 md:[&_p]:text-[1rem]"
              />
              <a
                href="#contacto"
                className="secondary-button justify-center border-[rgba(67,59,38,0.12)] bg-white/76 px-5 py-3 text-[0.88rem] text-[var(--earth)] shadow-[0_10px_22px_rgba(67,59,38,0.05)] hover:bg-white hover:shadow-[0_14px_28px_rgba(67,59,38,0.08)]"
              >
                Ver todos los productos
                <MoveRight className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="-mx-4 overflow-x-auto px-4 pb-3 md:mx-0 md:overflow-visible md:px-0 md:pb-0">
            <div className="flex snap-x snap-mandatory gap-4 md:grid md:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => (
                <div key={product.name} className="min-w-[82vw] snap-start sm:min-w-[54vw] md:min-w-0">
                  <ProductCard {...product} className="h-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="galeria" className="section-shell gallery-shell !items-center !py-4 md:!py-5">
        <div className="grid h-full items-center gap-8 xl:grid-cols-[0.45fr_0.55fr] xl:gap-7">
          <div className="flex h-full items-center justify-center self-center">
            <SectionTitle
              eyebrow="Galería y experiencia"
              title="Una atmósfera visual más cercana a la maqueta: noble, aireada y serena."
              description="Combinamos las referencias que nos compartiste con imágenes nuevas para completar la narrativa del paisaje, la cabaña y los productos."
              align="center"
              className="w-full max-w-[560px] gap-3 [&_h2]:text-[2.2rem] [&_h2]:leading-[1.03] md:[&_h2]:text-[2.6rem] [&_p]:mx-auto [&_p]:max-w-[30ch] [&_p]:text-[0.96rem] [&_p]:leading-7 md:[&_p]:text-[1rem]"
            />
          </div>
          <div className="h-full">
            <GalleryGrid items={galleryItems} />
          </div>
        </div>
      </section>

      <section id="reserva" className="section-shell viewport-shell reservation-shell !items-center !py-2 md:!py-3">
        <div className="reservation-composition mx-auto grid w-full max-w-[1320px] overflow-hidden lg:grid-cols-[0.45fr_0.55fr]">
          <div className="order-2 relative min-h-[280px] lg:order-1 lg:min-h-0">
            <Image
              src="/ai/pampa-tree-golden.png"
              alt="Campo pampeano dorado"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,21,23,0.08)_0%,rgba(18,21,23,0.32)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-6 lg:p-8">
              <p className="font-serif text-[2rem] italic leading-tight md:text-[2.35rem]">Conecta con nosotros</p>
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/82 md:text-[0.92rem]">
                Estamos en el corazón de La Pampa, apostando a una experiencia que mezcla paisaje, colmena y bienestar.
              </p>
              <div className="mt-5 space-y-2.5 text-[0.9rem]">
                <div className="flex items-center gap-3">
                  <MessageCircleMore className="h-4 w-4 text-[var(--gold)]" />
                  WhatsApp · 2302 555555
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-[var(--gold)]" />
                  amielar.visitas@gmail.com
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 flex items-center justify-center px-5 py-6 md:px-7 md:py-8 lg:order-2 lg:px-10 lg:py-10 xl:px-12">
            <BookingForm />
          </div>
        </div>
      </section>

      <section id="faq" className="section-shell faq-shell !items-center !py-4 md:!py-5">
        <div className="grid h-full gap-8 xl:grid-cols-[0.44fr_0.56fr] xl:gap-7 xl:items-center">
          <div className="flex h-full items-center justify-center self-center">
            <SectionTitle
              eyebrow="Preguntas frecuentes"
              title="Dudas frecuentes antes de tu visita."
              description="Resolvemos las consultas más comunes para que llegues con tranquilidad a tu experiencia."
              align="center"
              className="w-full max-w-[520px] gap-4 [&_h2]:text-[2.2rem] [&_h2]:leading-[1.04] md:[&_h2]:text-[2.6rem] [&_p]:mx-auto [&_p]:max-w-[28ch] [&_p]:text-[0.96rem] [&_p]:leading-7 md:[&_p]:text-[1rem]"
            />
          </div>
          <div className="flex h-full items-center">
            <FAQ items={faqs} />
          </div>
        </div>
      </section>

      <section id="visitanos" className="section-shell visit-shell !items-center !py-4 md:!py-5">
        <div className="grid h-full gap-7 lg:grid-cols-[0.85fr_1.15fr] lg:gap-6 lg:items-center">
          <div className="flex h-full items-center justify-center self-center">
            <div className="flex w-full max-w-[520px] flex-col items-center justify-center gap-6 text-center">
              <SectionTitle
                eyebrow="Visítanos en Arata"
                title="Una ubicación pensada para respirar más lento."
                description="Arata, La Pampa, se convierte en el telón perfecto para una experiencia de bienestar rural, cuidado artesanal y horizonte abierto."
                align="center"
                className="w-full gap-3 [&_h2]:text-[2.2rem] [&_h2]:leading-[1.03] md:[&_h2]:text-[2.55rem] [&_p]:mx-auto [&_p]:max-w-[30ch] [&_p]:text-[0.96rem] [&_p]:leading-7 md:[&_p]:text-[1rem]"
              />
              <div className="grid w-full gap-4 sm:grid-cols-2">
                <Card
                  title="WhatsApp"
                  description="2302 555555"
                  icon={MessageCircleMore}
                  className="flex min-h-[150px] flex-col justify-center px-5 py-5 text-center shadow-[0_12px_28px_rgba(67,59,38,0.06)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(67,59,38,0.09)] [&_div.inline-flex]:mx-auto [&_div.inline-flex]:mb-4 [&_h3]:text-[1.18rem] [&_p]:mt-2 [&_p]:text-[0.82rem] [&_p]:leading-6"
                />
                <Card
                  title="Email"
                  description="amielar.visitas@gmail.com"
                  icon={Mail}
                  accent="olive"
                  className="flex min-h-[150px] flex-col justify-center px-5 py-5 text-center shadow-[0_12px_28px_rgba(67,59,38,0.06)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(67,59,38,0.09)] [&_div.inline-flex]:mx-auto [&_div.inline-flex]:mb-4 [&_h3]:text-[1.18rem] [&_p]:mt-2 [&_p]:text-[0.82rem] [&_p]:leading-6"
                />
              </div>
            </div>
          </div>
          <article className="card-shell overflow-hidden p-3 shadow-[0_16px_36px_rgba(67,59,38,0.08)]">
            <div className="relative min-h-[300px] overflow-hidden rounded-[28px] md:min-h-[360px]">
              <Image
                src="/pantallas_1.png"
                alt="Mapa de Arata, La Pampa"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute left-5 top-5 rounded-full border border-white/40 bg-white/72 px-4 py-2 text-sm backdrop-blur-md">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[var(--gold-deep)]" />
                  Arata, La Pampa
                </span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <Footer />
    </main>
  );
}
