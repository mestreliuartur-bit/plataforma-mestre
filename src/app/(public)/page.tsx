"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { mockBanners, mockEvents } from "@/lib/mock-data";
import type { Banner, Event } from "@/types";

// ─────────────────────────────────────────
// HERO SECTION — Banner Carrossel Premium
// ─────────────────────────────────────────

function HeroSection({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent(index);
        setIsTransitioning(false);
      }, 400);
    },
    [isTransitioning]
  );

  const goNext = useCallback(() => {
    goTo((current + 1) % banners.length);
  }, [current, banners.length, goTo]);

  useEffect(() => {
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [goNext]);

  const banner = banners[current];

  return (
    <section className="relative h-screen min-h-[680px] max-h-[900px] overflow-hidden bg-[#0a0a0f]">
      {/* Fundo com gradiente místico */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#120d1f] to-[#0a0a0f]" />

      {/* Partículas decorativas */}
      <StarField />

      {/* Imagem de fundo do banner */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Overlay gradiente sobre a imagem */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/70 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />

        {/* Placeholder de imagem (substituir por next/image em produção) */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${banner.imageUrl})` }}
          aria-hidden="true"
        />
      </div>

      {/* Orbe místico decorativo */}
      <div className="absolute right-1/4 top-1/3 z-10 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-purple-900/20 blur-[120px]" />
      <div className="absolute left-1/3 top-2/3 z-10 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-amber-900/10 blur-[80px]" />

      {/* Conteúdo do Hero */}
      <div className="relative z-20 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
          <div className="max-w-2xl">
            {/* Etiqueta premium */}
            <div
              className={`mb-6 inline-flex items-center gap-2 transition-all duration-500 ${
                isTransitioning
                  ? "translate-y-4 opacity-0"
                  : "translate-y-0 opacity-100"
              }`}
            >
              <span className="h-px w-8 bg-amber-400/60" />
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-amber-400/80">
                Mestre Liu Artur
              </span>
              <span className="h-px w-8 bg-amber-400/60" />
            </div>

            {/* Título principal */}
            <h1
              className={`font-serif text-5xl font-bold leading-tight text-white transition-all duration-500 delay-100 sm:text-6xl lg:text-7xl ${
                isTransitioning
                  ? "translate-y-4 opacity-0"
                  : "translate-y-0 opacity-100"
              }`}
            >
              <span className="block">{banner.title}</span>
              <span className="mt-2 block bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                está te esperando
              </span>
            </h1>

            {/* Subtítulo */}
            {banner.subtitle && (
              <p
                className={`mt-6 text-lg leading-relaxed text-gray-300/80 transition-all duration-500 delay-200 sm:text-xl ${
                  isTransitioning
                    ? "translate-y-4 opacity-0"
                    : "translate-y-0 opacity-100"
                }`}
              >
                {banner.subtitle}
              </p>
            )}

            {/* CTAs */}
            <div
              className={`mt-10 flex flex-wrap items-center gap-4 transition-all duration-500 delay-300 ${
                isTransitioning
                  ? "translate-y-4 opacity-0"
                  : "translate-y-0 opacity-100"
              }`}
            >
              <Link
                href={banner.ctaUrl}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-8 py-4 font-semibold text-black shadow-lg shadow-amber-900/30 transition-all hover:shadow-amber-700/40 hover:shadow-xl active:scale-95"
              >
                <span className="relative z-10">{banner.ctaLabel}</span>
                <svg
                  className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
                {/* Brilho no hover */}
                <div className="absolute inset-0 -translate-x-full skew-x-12 bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />
              </Link>

              <Link
                href="#eventos"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 font-medium text-white/80 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                Ver todos os Rituais
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navegação do carrossel */}
      <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Ir para banner ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "h-2 w-8 bg-amber-400"
                : "h-2 w-2 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Setas de navegação */}
      <button
        onClick={() => goTo((current - 1 + banners.length) % banners.length)}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/30 p-3 text-white/60 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-black/50 hover:text-white lg:left-8"
        aria-label="Banner anterior"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/30 p-3 text-white/60 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-black/50 hover:text-white lg:right-8"
        aria-label="Próximo banner"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 right-10 z-20 hidden flex-col items-center gap-2 lg:flex">
        <span className="font-sans text-[10px] uppercase tracking-widest text-white/30">
          scroll
        </span>
        <div className="h-12 w-px animate-pulse bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// STAR FIELD — Partículas decorativas
// ─────────────────────────────────────────

// Pseudo-random determinístico: mesmo output no server e no client
function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function StarField() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    top: `${seededRandom(i * 5 + 0) * 100}%`,
    left: `${seededRandom(i * 5 + 1) * 100}%`,
    size: seededRandom(i * 5 + 2) * 2 + 1,
    delay: `${seededRandom(i * 5 + 3) * 4}s`,
    duration: `${seededRandom(i * 5 + 4) * 3 + 2}s`,
    opacity: seededRandom(i * 5 + 5) * 0.4 + 0.1,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute animate-pulse rounded-full bg-white"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// SEÇÃO: Sobre o Mestre (Credibilidade)
// ─────────────────────────────────────────

function AboutSection() {
  const stats = [
    { value: "15+", label: "Anos de Prática" },
    { value: "3.000+", label: "Rituais Realizados" },
    { value: "98%", label: "Casos de Sucesso" },
    { value: "1.200+", label: "Vidas Transformadas" },
  ];

  return (
    <section className="relative bg-[#0a0a0f] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Lado esquerdo: texto */}
          <div>
            <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-amber-400/70">
              Quem é o Mestre
            </p>
            <h2 className="mb-6 font-serif text-4xl font-bold leading-tight text-white lg:text-5xl">
              A força ancestral a{" "}
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                seu serviço
              </span>
            </h2>
            <p className="mb-6 leading-relaxed text-gray-400">
              Mestre Liu Artur é um praticante de umbanda e magia há mais de 15
              anos. Guiado pelos Orixás e pelas forças ancestrais, já
              transformou milhares de vidas através de rituais precisos e
              trabalhados com respeito e responsabilidade espiritual.
            </p>
            <p className="mb-10 leading-relaxed text-gray-400">
              Seus trabalhos são reconhecidos pela potência e seriedade, sempre
              alinhados com a ética espiritual e o bem maior de quem busca a
              transformação.
            </p>

            <Link
              href="/sobre"
              className="inline-flex items-center gap-2 text-amber-400 transition-colors hover:text-amber-300"
            >
              <span className="font-medium">Conhecer a história completa</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Lado direito: stats */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/5 bg-white/[0.03] p-8 text-center backdrop-blur-sm"
              >
                <div className="mb-2 font-serif text-4xl font-bold text-amber-400">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// SEÇÃO: Eventos/Rituais (Cards)
// ─────────────────────────────────────────

function EventsSection({ events }: { events: Event[] }) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

  return (
    <section id="eventos" className="relative bg-[#080810] py-24">
      {/* Linha decorativa topo */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-900/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Cabeçalho da seção */}
        <div className="mb-16 text-center">
          <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-amber-400/70">
            Rituais & Eventos
          </p>
          <h2 className="font-serif text-4xl font-bold text-white lg:text-5xl">
            Escolha sua{" "}
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              transformação
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            Cada ritual é preparado com intenção, energia e conhecimento ancestral
            para produzir resultados reais na sua vida.
          </p>
        </div>

        {/* Grid de eventos */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} formatPrice={formatPrice} />
          ))}
        </div>

        {/* CTA ver todos */}
        <div className="mt-14 text-center">
          <Link
            href="/eventos"
            className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 px-8 py-4 font-medium text-amber-400 transition-all hover:border-amber-400/60 hover:bg-amber-400/5"
          >
            Ver todos os Rituais
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function EventCard({
  event,
  formatPrice,
}: {
  event: Event;
  formatPrice: (v: number) => string;
}) {
  return (
    <Link
      href={`/eventos/${event.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/20 hover:shadow-xl hover:shadow-amber-900/10"
    >
      {/* Imagem da capa */}
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-purple-950 to-gray-900">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          {/* Símbolo místico placeholder */}
          <svg viewBox="0 0 100 100" className="h-24 w-24 text-amber-400" fill="currentColor">
            <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
          </svg>
        </div>
        {/* Badge tipo */}
        <div className="absolute right-3 top-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              event.type === "PRESENCIAL"
                ? "bg-emerald-900/70 text-emerald-300"
                : "bg-blue-900/70 text-blue-300"
            }`}
          >
            {event.type === "PRESENCIAL" ? "Presencial" : "À Distância"}
          </span>
        </div>
      </div>

      {/* Conteúdo do card */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 font-serif text-xl font-semibold text-white transition-colors group-hover:text-amber-200">
          {event.title}
        </h3>
        <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-400 line-clamp-2">
          {event.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">A partir de</p>
            <p className="font-serif text-2xl font-bold text-amber-400">
              {formatPrice(event.price)}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-400/30 text-amber-400 transition-all group-hover:border-amber-400 group-hover:bg-amber-400 group-hover:text-black">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────
// SEÇÃO: Depoimentos (Prova Social)
// ─────────────────────────────────────────

const testimonials = [
  {
    name: "Camila R.",
    text: "Após o ritual de prosperidade do Mestre Liu Artur, recebi uma promoção que esperava há dois anos. Não tenho dúvidas do poder deste trabalho.",
    rating: 5,
  },
  {
    name: "Roberto M.",
    text: "Fiz o trabalho à distância e os resultados foram impressionantes. Em menos de 30 dias meu negócio voltou a faturar bem.",
    rating: 5,
  },
  {
    name: "Fernanda S.",
    text: "O Mestre Liu Artur tem um dom único. Seu ritual de amor reconectou meu casamento de uma forma que eu não acreditava ser possível.",
    rating: 5,
  },
];

function TestimonialsSection() {
  return (
    <section className="relative bg-[#0a0a0f] py-24">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-900/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-16 text-center">
          <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-amber-400/70">
            Depoimentos
          </p>
          <h2 className="font-serif text-4xl font-bold text-white">
            Vidas{" "}
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              transformadas
            </span>
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/5 bg-white/[0.02] p-8"
            >
              {/* Estrelas */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <svg key={s} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="mb-6 leading-relaxed text-gray-300">"{t.text}"</p>
              <p className="font-semibold text-amber-400/80">— {t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// SEÇÃO: CTA Final (Conversão)
// ─────────────────────────────────────────

function FinalCTASection() {
  return (
    <section className="relative overflow-hidden bg-[#080810] py-32">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-900/40 to-transparent" />

      {/* Orbe de fundo */}
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-900/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        {/* Ícone decorativo */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/5">
          <svg viewBox="0 0 100 100" className="h-10 w-10 text-amber-400" fill="currentColor">
            <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
          </svg>
        </div>

        <h2 className="mb-6 font-serif text-4xl font-bold text-white lg:text-5xl">
          Está pronto para a{" "}
          <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
            transformação?
          </span>
        </h2>
        <p className="mb-10 text-lg leading-relaxed text-gray-400">
          Não espere mais. Os caminhos que você deseja abrir estão a um ritual
          de distância. O Mestre Liu Artur está pronto para guiá-lo.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="#eventos"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-10 py-5 text-lg font-semibold text-black shadow-lg shadow-amber-900/30 transition-all hover:shadow-amber-700/40 hover:shadow-xl"
          >
            <span>Escolher meu Ritual</span>
            <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <div className="absolute inset-0 -translate-x-full skew-x-12 bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />
          </Link>

          <Link
            href="/cadastro"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-10 py-5 text-lg font-medium text-white/80 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            Criar minha conta
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// PAGE — Composição da Homepage
// ─────────────────────────────────────────

export default function HomePage() {
  const activeBanners = mockBanners.filter((b) => b.isActive);
  const publishedEvents = mockEvents.filter((e) => e.isPublished);

  return (
    <main>
      <HeroSection banners={activeBanners} />
      <AboutSection />
      <EventsSection events={publishedEvents} />
      <TestimonialsSection />
      <FinalCTASection />
    </main>
  );
}
