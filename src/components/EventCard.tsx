import Link from "next/link";
import { CldImage } from "next-cloudinary";

interface EventCardProps {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number | string;
  coverImage: string | null;
  type: "PRESENCIAL" | "DISTANCIA";
  eventDate?: Date | null;
  maxSlots?: number | null;
  isPurchased?: boolean;
  compact?: boolean; // cards menores no admin
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
  compact = false,
}: EventCardProps) {
  const width = compact ? 160 : 220;
  const height = Math.round((width * 16) / 9);

  return (
    <Link
      href={isPurchased ? `/dashboard/conteudos?evento=${slug}` : `/eventos/${slug}`}
      className="group relative flex-shrink-0 overflow-hidden rounded-xl border border-white/5 bg-gray-950 transition-all duration-300 hover:border-amber-400/20 hover:shadow-xl hover:shadow-amber-900/10"
      style={{ width, height }}
    >
      {/* ── Imagem de fundo ── */}
      {coverImage ? (
        isExternalUrl(coverImage) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <CldImage
            src={coverImage}
            alt={title}
            fill
            sizes={`${width}px`}
            crop="fill"
            gravity="auto"
            quality="auto"
            format="auto"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )
      ) : (
        /* Placeholder gradiente */
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-950 to-gray-950">
          <svg viewBox="0 0 100 100" className="h-12 w-12 text-purple-800" fill="currentColor">
            <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
          </svg>
        </div>
      )}

      {/* ── Gradiente inferior sempre visível ── */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/70 to-transparent" />

      {/* ── Badge tipo — topo ── */}
      <div className="absolute left-2 top-2">
        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm ${
          type === "PRESENCIAL"
            ? "bg-emerald-900/80 text-emerald-300"
            : "bg-blue-900/80 text-blue-300"
        }`}>
          {type === "PRESENCIAL" ? "Presencial" : "Distância"}
        </span>
      </div>

      {/* Badge "Adquirido" */}
      {isPurchased && (
        <div className="absolute right-2 top-2">
          <span className="flex items-center gap-1 rounded-full bg-amber-500/90 px-2 py-0.5 text-[9px] font-bold text-black backdrop-blur-sm">
            ✓ Adquirido
          </span>
        </div>
      )}

      {/* ── Conteúdo inferior ── */}
      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="line-clamp-2 text-xs font-semibold leading-tight text-white">
          {title}
        </p>

        {/* Info secundária no hover */}
        <div className="mt-1 overflow-hidden transition-all duration-300 max-h-0 group-hover:max-h-20">
          <p className="line-clamp-2 text-[10px] leading-relaxed text-gray-400">
            {description}
          </p>
          {eventDate && (
            <p className="mt-1 text-[10px] text-amber-400/70">
              {new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(eventDate))}
            </p>
          )}
          {maxSlots && (
            <p className="text-[10px] text-gray-500">{maxSlots} vagas</p>
          )}
        </div>

        {/* Preço + CTA */}
        <div className="mt-2 flex items-center justify-between">
          {!isPurchased ? (
            <>
              <p className="font-serif text-sm font-bold text-amber-400">{formatBRL(price)}</p>
              <span className="rounded-lg bg-amber-400/90 px-2.5 py-1 text-[10px] font-bold text-black opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                Adquirir
              </span>
            </>
          ) : (
            <span className="text-[10px] font-medium text-amber-400/70">Acessar conteúdos →</span>
          )}
        </div>
      </div>
    </Link>
  );
}
