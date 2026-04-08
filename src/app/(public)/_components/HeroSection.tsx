"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  ctaLabel: string;
  ctaUrl: string;
}

// Pseudo-random determinístico — mesmo valor no server e no client
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

export function HeroSection({ banners }: { banners: Banner[] }) {
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
    if (banners.length <= 1) return;
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [goNext, banners.length]);

  const banner = banners[current];
  if (!banner) return null;

  return (
    <section className="relative h-screen min-h-[680px] max-h-[900px] overflow-hidden bg-[#0a0a0f]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#120d1f] to-[#0a0a0f]" />

      <StarField />

      {/* Imagem de fundo */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/70 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
        {banner.imageUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${banner.imageUrl})` }}
            aria-hidden="true"
          />
        )}
      </div>

      <div className="absolute right-1/4 top-1/3 z-10 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-purple-900/20 blur-[120px]" />
      <div className="absolute left-1/3 top-2/3 z-10 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-amber-900/10 blur-[80px]" />

      {/* Conteúdo do Hero */}
      <div className="relative z-20 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
          <div className="max-w-2xl">
            <div className={`mb-6 inline-flex items-center gap-2 transition-all duration-500 ${isTransitioning ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"}`}>
              <span className="h-px w-8 bg-amber-400/60" />
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-amber-400/80">
                Mestre Liu Artur
              </span>
              <span className="h-px w-8 bg-amber-400/60" />
            </div>

            <h1 className={`font-serif text-5xl font-bold leading-tight text-white transition-all duration-500 delay-100 sm:text-6xl lg:text-7xl ${isTransitioning ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"}`}>
              <span className="block">{banner.title}</span>
              <span className="mt-2 block bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                está te esperando
              </span>
            </h1>

            {banner.subtitle && (
              <p className={`mt-6 text-lg leading-relaxed text-gray-300/80 transition-all duration-500 delay-200 sm:text-xl ${isTransitioning ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"}`}>
                {banner.subtitle}
              </p>
            )}

            <div className={`mt-10 flex flex-wrap items-center gap-4 transition-all duration-500 delay-300 ${isTransitioning ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"}`}>
              <Link
                href={banner.ctaUrl}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-8 py-4 font-semibold text-black shadow-lg shadow-amber-900/30 transition-all hover:shadow-amber-700/40 hover:shadow-xl active:scale-95"
              >
                <span className="relative z-10">{banner.ctaLabel}</span>
                <svg className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
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
      {banners.length > 1 && (
        <>
          <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Ir para banner ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${i === current ? "h-2 w-8 bg-amber-400" : "h-2 w-2 bg-white/30 hover:bg-white/50"}`}
              />
            ))}
          </div>

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
        </>
      )}

      <div className="absolute bottom-10 right-10 z-20 hidden flex-col items-center gap-2 lg:flex">
        <span className="font-sans text-[10px] uppercase tracking-widest text-white/30">scroll</span>
        <div className="h-12 w-px animate-pulse bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  );
}
