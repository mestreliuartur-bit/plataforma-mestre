"use client";

import Link from "next/link";
import { useState } from "react";
import { CldImage } from "next-cloudinary";

interface EventCardProps {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number | string;
  coverImage: string | null;
  type: "PRESENCIAL" | "DISTANCIA";
  eventDate?: Date | string | null;
  maxSlots?: number | null;
  isPurchased?: boolean;
}

const formatBRL = (v: number | string) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v));

const isExternalUrl = (src: string | null | undefined) =>
  Boolean(src && src.startsWith("http"));

export function EventCard({
  slug,
  title,
  description,
  price,
  coverImage,
  type,
  eventDate,
  maxSlots,
  isPurchased = false,
}: EventCardProps) {
  const [hovered, setHovered] = useState(false);

  const href = isPurchased ? `/dashboard/conteudos?evento=${slug}` : `/eventos/${slug}`;

  const formattedDate = eventDate
    ? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(
        new Date(eventDate)
      )
    : null;

  return (
    /*
     * O wrapper tem overflow-visible e z-index elevado no hover
     * para o card "sair" da fileira sobre os vizinhos — efeito Netflix.
     */
    <div
      className={`relative flex-shrink-0 transition-all duration-300 ${
        hovered ? "z-30 scale-110" : "z-10 scale-100"
      }`}
      style={{ width: 180, height: 320 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Card principal ── */}
      <Link
        href={href}
        className="absolute inset-0 overflow-hidden rounded-xl border border-white/5 bg-zinc-950 shadow-xl"
        style={{
          boxShadow: hovered
            ? "0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(251,191,36,0.2)"
            : undefined,
        }}
        tabIndex={-1}
      >
        {/* Imagem */}
        {coverImage ? (
          isExternalUrl(coverImage) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImage}
              alt={title}
              className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 ${
                hovered ? "scale-105" : "scale-100"
              }`}
            />
          ) : (
            <CldImage
              src={coverImage}
              alt={title}
              fill
              sizes="180px"
              crop="fill"
              gravity="auto"
              quality="auto"
              format="auto"
              className={`object-cover transition-transform duration-500 ${
                hovered ? "scale-105" : "scale-100"
              }`}
            />
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-950 via-zinc-900 to-zinc-950">
            <svg viewBox="0 0 100 100" className="h-16 w-16 text-purple-800/60" fill="currentColor">
              <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
            </svg>
          </div>
        )}

        {/* Gradiente permanente */}
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black via-black/80 to-transparent" />

        {/* Badge tipo */}
        <div className="absolute left-2 top-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm ${
              type === "PRESENCIAL"
                ? "bg-emerald-900/80 text-emerald-300"
                : "bg-blue-900/80 text-blue-300"
            }`}
          >
            {type === "PRESENCIAL" ? "Presencial" : "Distância"}
          </span>
        </div>

        {/* Badge adquirido */}
        {isPurchased && (
          <div className="absolute right-2 top-2">
            <span className="flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-bold text-black">
              ✓ Adquirido
            </span>
          </div>
        )}

        {/* Info base (sempre visível) */}
        <div className="absolute inset-x-0 bottom-0 p-3">
          <p className="line-clamp-2 text-[11px] font-semibold leading-tight text-white">{title}</p>
          {!hovered && (
            <p className="mt-1 font-serif text-sm font-bold text-amber-400">{formatBRL(price)}</p>
          )}
        </div>
      </Link>

      {/* ── Overlay Netflix: aparece abaixo do card no hover ── */}
      <div
        className={`absolute inset-x-0 top-full z-40 overflow-hidden rounded-b-xl border border-t-0 border-amber-400/20 bg-zinc-900 transition-all duration-300 ${
          hovered ? "max-h-52 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{
          boxShadow: hovered ? "0 20px 40px rgba(0,0,0,0.8)" : undefined,
        }}
      >
        <div className="p-3 space-y-2">
          <p className="text-xs font-semibold text-white leading-snug">{title}</p>
          <p className="text-[10px] leading-relaxed text-gray-400 line-clamp-3">{description}</p>

          <div className="flex items-center gap-1.5 flex-wrap">
            {formattedDate && (
              <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] text-gray-400">
                📅 {formattedDate}
              </span>
            )}
            {maxSlots && (
              <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] text-gray-400">
                {maxSlots} vagas
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="font-serif text-base font-bold text-amber-400">{formatBRL(price)}</p>
            <Link
              href={href}
              className="flex items-center gap-1.5 rounded-lg bg-amber-400 px-3 py-1.5 text-[10px] font-bold text-black transition-all hover:bg-amber-300"
            >
              {isPurchased ? (
                <>
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Acessar
                </>
              ) : (
                <>
                  Saber mais
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
