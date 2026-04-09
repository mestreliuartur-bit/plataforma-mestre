"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { EventCard } from "./EventCard";

export interface CarouselEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number | string;
  coverImage: string | null;
  type: "PRESENCIAL" | "DISTANCIA";
  eventDate?: Date | string | null;
  maxSlots?: number | null;
}

interface EventCarouselProps {
  title: string;
  subtitle?: string;
  events: CarouselEvent[];
  purchasedIds?: Set<string>;
  viewAllHref?: string;
  accentColor?: "amber" | "purple" | "blue" | "emerald";
  bgColor?: string; // ex: "from-[#0a0a0f]"
}

const SCROLL_AMOUNT = 560;

const accentMap = {
  amber: {
    label: "text-amber-400/70",
    arrow: "border-amber-400/30 text-amber-400 hover:border-amber-400/60 hover:bg-amber-400/10 disabled:opacity-20",
    fade: "from-zinc-950",
  },
  purple: {
    label: "text-purple-400/70",
    arrow: "border-purple-400/30 text-purple-400 hover:border-purple-400/60 hover:bg-purple-400/10 disabled:opacity-20",
    fade: "from-zinc-950",
  },
  blue: {
    label: "text-blue-400/70",
    arrow: "border-blue-400/30 text-blue-400 hover:border-blue-400/60 hover:bg-blue-400/10 disabled:opacity-20",
    fade: "from-zinc-950",
  },
  emerald: {
    label: "text-emerald-400/70",
    arrow: "border-emerald-400/30 text-emerald-400 hover:border-emerald-400/60 hover:bg-emerald-400/10 disabled:opacity-20",
    fade: "from-zinc-950",
  },
};

export function EventCarousel({
  title,
  subtitle,
  events,
  purchasedIds = new Set(),
  viewAllHref,
  accentColor = "amber",
  bgColor = "from-zinc-950",
}: EventCarouselProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const accent = accentMap[accentColor];

  const checkScroll = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  function scroll(direction: "left" | "right") {
    rowRef.current?.scrollBy({
      left: direction === "right" ? SCROLL_AMOUNT : -SCROLL_AMOUNT,
      behavior: "smooth",
    });
    setTimeout(checkScroll, 350);
  }

  if (events.length === 0) return null;

  return (
    <section className="space-y-3">
      {/* Cabeçalho */}
      <div className="flex items-end justify-between px-1">
        <div>
          {subtitle && (
            <p className={`text-[10px] font-bold uppercase tracking-widest ${accent.label}`}>
              {subtitle}
            </p>
          )}
          <h2 className="mt-0.5 font-serif text-xl font-bold text-white">{title}</h2>
        </div>

        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className={`mr-1 text-xs font-medium transition-colors ${accent.label} hover:text-white`}
            >
              Ver todos →
            </Link>
          )}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Anterior"
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${accent.arrow}`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Próximo"
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${accent.arrow}`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Row de cards — overflow-visible para o efeito Netflix sair dos limites */}
      <div className="relative">
        {/* Fade esquerda */}
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 z-20 w-10 bg-gradient-to-r ${bgColor} to-transparent transition-opacity duration-300 ${
            canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* Fade direita */}
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l ${bgColor} to-transparent`}
        />

        <div
          ref={rowRef}
          onScroll={checkScroll}
          /* overflow-y-visible deixa o overlay Netflix "sair" para baixo */
          className="flex gap-3 overflow-x-auto overflow-y-visible pb-36 pt-4 scrollbar-hide"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {events.map((event) => (
            <div key={event.id} className="flex-shrink-0" style={{ scrollSnapAlign: "start" }}>
              <EventCard
                id={event.id}
                slug={event.slug}
                title={event.title}
                description={event.description}
                price={event.price}
                coverImage={event.coverImage}
                type={event.type}
                eventDate={event.eventDate}
                maxSlots={event.maxSlots}
                isPurchased={purchasedIds.has(event.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
