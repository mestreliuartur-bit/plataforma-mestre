"use client";

import Link from "next/link";
import { useState } from "react";
import { CldImage } from "next-cloudinary";

interface EventCardProps {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number | string | null;
  coverImage: string | null;
  type: "PRESENCIAL" | "DISTANCIA";
  eventDate?: Date | string | null;
  maxSlots?: number | null;
  isPurchased?: boolean;
  isWhatsappLead?: boolean;
  whatsappNumber?: string | null;
  whatsappMessage?: string | null;
}

const formatBRL = (v: number | string) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v));

const isExternalUrl = (src: string | null | undefined) =>
  Boolean(src && src.startsWith("http"));

function buildWhatsappUrl(number: string | null | undefined, message: string | null | undefined) {
  const num = (number ?? "").replace(/\D/g, "");
  const text = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${num}${text ? `?text=${text}` : ""}`;
}

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
  isWhatsappLead = false,
  whatsappNumber,
  whatsappMessage,
}: EventCardProps) {
  const [hovered, setHovered] = useState(false);

  const href = isPurchased
    ? `/dashboard/conteudos?evento=${slug}`
    : isWhatsappLead
    ? buildWhatsappUrl(whatsappNumber, whatsappMessage)
    : `/eventos/${slug}`;

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
          {!hovered && !isWhatsappLead && price !== null && (
            <p className="mt-1 font-serif text-sm font-bold text-amber-400">{formatBRL(price)}</p>
          )}
          {!hovered && isWhatsappLead && (
            <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-green-400">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Consultar valor
            </p>
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
            {isWhatsappLead ? (
              <p className="flex items-center gap-1 text-xs font-semibold text-green-400">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </p>
            ) : (
              <p className="font-serif text-base font-bold text-amber-400">
                {price !== null ? formatBRL(price) : ""}
              </p>
            )}
            <Link
              href={href}
              target={isWhatsappLead ? "_blank" : undefined}
              rel={isWhatsappLead ? "noopener noreferrer" : undefined}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all ${
                isWhatsappLead
                  ? "bg-green-500 text-white hover:bg-green-400"
                  : "bg-amber-400 text-black hover:bg-amber-300"
              }`}
            >
              {isPurchased ? (
                <>
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Acessar
                </>
              ) : isWhatsappLead ? (
                <>
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Mais informações
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
