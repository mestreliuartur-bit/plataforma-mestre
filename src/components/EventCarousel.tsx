"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { EventCard } from "./EventCard";

interface CarouselEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number | string;
  coverImage: string | null;
  type: "PRESENCIAL" | "DISTANCIA";
  eventDate?: Date | null;
  maxSlots?: number | null;
}

interface EventCarouselProps {
  title: string;
  subtitle?: string;
  events: CarouselEvent[];
  purchasedIds?: Set<string>;
  viewAllHref?: string;
  accentColor?: "amber" | "purple";
}

const SCROLL_AMOUNT = 480;

export function EventCarousel({
  title,
  subtitle,
  events,
  purchasedIds = new Set(),
  viewAllHref,
  accentColor = "amber",
}: EventCarouselProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

  const accentClasses = {
    amber: { label: "text-amber-400/60", arrow: "border-amber-400/20 text-amber-400 hover:border-amber-400/50 hover:bg-amber-400/10" },
    purple: { label: "text-purple-400/60", arrow: "border-purple-400/20 text-purple-400 hover:border-purple-400/50 hover:bg-purple-400/10" },
  }[accentColor];

  return (
    <section className="space-y-4">
      {/* ── Cabeçalho da row ── */}
      <div className="flex items-end justify-between">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-widest ${accentClasses.label}`}>
            {subtitle}
          </p>
          <h2 className="mt-0.5 font-serif text-xl font-bold text-white">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className={`mr-2 text-xs font-medium transition-colors ${accentClasses.label} hover:text-white`}
            >
              Ver todos →
            </Link>
          )}
          {/* Setas */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Anterior"
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all disabled:opacity-20 ${accentClasses.arrow}`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Próximo"
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all disabled:opacity-20 ${accentClasses.arrow}`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Row de cards ── */}
      <div className="relative">
        {/* Fade esquerda */}
        {canScrollLeft && (
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#0a0a0f] to-transparent" />
        )}
        {/* Fade direita */}
        {canScrollRight && (
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#0a0a0f] to-transparent" />
        )}

        <div
          ref={rowRef}
          onScroll={checkScroll}
          className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {events.map((event) => (
            <div key={event.id} style={{ scrollSnapAlign: "start" }}>
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
