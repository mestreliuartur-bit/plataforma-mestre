import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { cloudinaryUrl } from "@/lib/cloudinary";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await db.event.findUnique({ where: { slug }, select: { title: true, description: true } });
  if (!event) return {};
  return {
    title: event.title,
    description: event.description.slice(0, 160),
  };
}

const formatBRL = (v: number | string) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v));

const formatDate = (d: Date) =>
  new Intl.DateTimeFormat("pt-BR", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(d);

function buildWhatsappUrl(number: string | null, message: string | null) {
  const num = (number ?? "").replace(/\D/g, "");
  const text = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${num}${text ? `?text=${text}` : ""}`;
}

// Resolve a URL da imagem — public_id Cloudinary ou URL externa
function resolveImageUrl(coverImage: string | null, transformation = "c_fill,ar_9:16,w_800,q_auto,f_auto") {
  if (!coverImage) return null;
  if (coverImage.startsWith("http")) return coverImage;
  return cloudinaryUrl(coverImage, transformation);
}

// Renderiza descrição com parágrafos (suporte básico a quebras de linha)
function DescriptionBlock({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  if (paragraphs.length <= 1) {
    const lines = text.split(/\n/).filter(Boolean);
    return (
      <div className="space-y-3">
        {lines.map((line, i) => (
          <p key={i} className="leading-relaxed text-gray-300">{line}</p>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {paragraphs.map((p, i) => (
        <p key={i} className="leading-relaxed text-gray-300">{p}</p>
      ))}
    </div>
  );
}

export default async function EventoPage({ params }: Props) {
  const { slug } = await params;

  const [event, session] = await Promise.all([
    db.event.findUnique({ where: { slug } }),
    auth(),
  ]);

  if (!event || !event.isPublished) notFound();

  // Checar se o usuário já comprou
  let isPurchased = false;
  if (session?.user?.id && !event.isWhatsappLead) {
    const purchase = await db.purchase.findUnique({
      where: { userId_eventId: { userId: session.user.id, eventId: event.id } },
      select: { id: true, status: true },
    });
    isPurchased = purchase?.status === "CONFIRMED";
  }

  const imageUrl = resolveImageUrl(event.coverImage);
  const blurUrl = resolveImageUrl(event.coverImage, "c_fill,ar_16:9,w_400,q_30,e_blur:1500,f_auto");
  const whatsappUrl = event.isWhatsappLead
    ? buildWhatsappUrl(event.whatsappNumber, event.whatsappMessage)
    : null;

  return (
    <main className="min-h-screen bg-[#0a0a0f]">

      {/* ── HERO CINEMATOGRÁFICO ── */}
      <section className="relative min-h-[85vh] overflow-hidden">

        {/* Fundo blur — toda a largura */}
        {blurUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${blurUrl})` }}
            aria-hidden="true"
          />
        )}
        {/* Gradientes de overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/90 to-[#0a0a0f]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-[#0a0a0f]/30" />

        {/* Brilho decorativo */}
        <div className="pointer-events-none absolute right-1/3 top-1/4 h-[500px] w-[500px] rounded-full bg-amber-900/15 blur-[120px]" />
        <div className="pointer-events-none absolute left-1/4 bottom-0 h-[300px] w-[300px] rounded-full bg-purple-900/10 blur-[100px]" />

        <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-7xl items-center px-6 py-24 lg:px-12">
          <div className="grid w-full gap-12 lg:grid-cols-[1fr_320px] lg:items-center xl:grid-cols-[1fr_360px]">

            {/* ── Coluna esquerda — texto ── */}
            <div className="max-w-2xl">
              {/* Breadcrumb */}
              <nav className="mb-8 flex items-center gap-2 text-xs text-gray-600">
                <Link href="/" className="transition-colors hover:text-gray-400">Início</Link>
                <span>/</span>
                <Link href="/eventos" className="transition-colors hover:text-gray-400">Rituais & Eventos</Link>
                <span>/</span>
                <span className="text-gray-400">{event.title}</span>
              </nav>

              {/* Badges */}
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                  event.type === "PRESENCIAL"
                    ? "bg-emerald-900/60 text-emerald-300"
                    : "bg-blue-900/60 text-blue-300"
                }`}>
                  {event.type === "PRESENCIAL" ? "Presencial" : "À Distância"}
                </span>
                {event.isWhatsappLead && (
                  <span className="flex items-center gap-1.5 rounded-full bg-green-900/50 px-3 py-1 text-xs font-bold text-green-400">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Consulta via WhatsApp
                  </span>
                )}
                {isPurchased && (
                  <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-400">
                    ✓ Adquirido
                  </span>
                )}
              </div>

              {/* Título */}
              <h1 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                {event.title}
              </h1>

              {/* Meta info */}
              <div className="mt-6 flex flex-wrap gap-4">
                {event.eventDate && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <svg className="h-4 w-4 text-amber-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    <span className="capitalize">{formatDate(event.eventDate)}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <svg className="h-4 w-4 text-amber-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span>{event.location}</span>
                  </div>
                )}
                {event.type === "DISTANCIA" && !event.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <svg className="h-4 w-4 text-amber-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                    <span>Online — de qualquer lugar do mundo</span>
                  </div>
                )}
                {event.maxSlots && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <svg className="h-4 w-4 text-amber-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                    <span>Vagas limitadas — {event.maxSlots} participantes</span>
                  </div>
                )}
              </div>

              {/* Descrição resumida (2 primeiras linhas) */}
              <p className="mt-6 line-clamp-3 text-lg leading-relaxed text-gray-400">
                {event.description.split("\n")[0]}
              </p>

              {/* ── CTA PRINCIPAL ── */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {isPurchased ? (
                  <Link
                    href={`/dashboard/conteudos?evento=${event.slug}`}
                    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-8 py-4 text-base font-bold text-black shadow-lg shadow-amber-900/30 transition-all hover:shadow-amber-700/50 hover:shadow-xl"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Acessar Conteúdo
                    <div className="absolute inset-0 -translate-x-full skew-x-12 bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />
                  </Link>
                ) : event.isWhatsappLead ? (
                  <a
                    href={whatsappUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-green-600 to-green-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-green-900/30 transition-all hover:shadow-green-700/50 hover:shadow-xl"
                  >
                    <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Mais Informações no WhatsApp
                    <div className="absolute inset-0 -translate-x-full skew-x-12 bg-white/10 transition-transform duration-700 group-hover:translate-x-full" />
                  </a>
                ) : (
                  <button
                    disabled
                    className="group relative inline-flex cursor-not-allowed items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-8 py-4 text-base font-bold text-black shadow-lg shadow-amber-900/30 opacity-90 transition-all hover:shadow-amber-700/50 hover:shadow-xl"
                    title="Checkout em breve"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Reservar Minha Vaga — {event.price !== null ? formatBRL(event.price as number) : ""}
                  </button>
                )}

                <Link
                  href="/eventos"
                  className="text-sm text-gray-500 transition-colors hover:text-gray-300"
                >
                  ← Ver todos os rituais
                </Link>
              </div>

              {/* Garantia */}
              {!event.isWhatsappLead && (
                <div className="mt-6 flex items-center gap-3 text-xs text-gray-600">
                  <svg className="h-4 w-4 flex-shrink-0 text-amber-400/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span>Trabalho realizado com ética, respeito e responsabilidade espiritual</span>
                </div>
              )}
            </div>

            {/* ── Coluna direita — arte 9:16 ── */}
            <div className="hidden lg:flex lg:justify-end">
              <div className="relative">
                {/* Brilho atrás da imagem */}
                <div className="absolute -inset-4 rounded-3xl bg-amber-400/10 blur-2xl" />
                <div
                  className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60"
                  style={{ width: 280, height: 498 }}
                >
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-950 via-zinc-900 to-zinc-950">
                      <svg viewBox="0 0 100 100" className="h-24 w-24 text-purple-800/40" fill="currentColor">
                        <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
                      </svg>
                    </div>
                  )}
                  {/* Overlay gradiente na base */}
                  <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 to-transparent" />
                  {/* Preço na arte */}
                  {!event.isWhatsappLead && event.price !== null && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="font-serif text-2xl font-bold text-amber-400 drop-shadow-lg">
                        {formatBRL(event.price as number)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── DETALHES DO EVENTO ── */}
      <section className="relative bg-[#0a0a0f] py-16">
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-900/30 to-transparent" />
        <div className="mx-auto max-w-4xl px-6 lg:px-12">

          <div className="grid gap-12 lg:grid-cols-[1fr_280px]">

            {/* ── Descrição completa ── */}
            <div>
              <h2 className="mb-6 font-serif text-2xl font-bold text-white">
                Sobre este {event.type === "PRESENCIAL" ? "Evento" : "Ritual"}
              </h2>
              <div className="prose prose-invert max-w-none">
                <DescriptionBlock text={event.description} />
              </div>
            </div>

            {/* ── Sidebar de detalhes ── */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">Detalhes</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-600">Modalidade</p>
                    <p className="mt-0.5 text-sm text-white">
                      {event.type === "PRESENCIAL" ? "Presencial" : "À Distância"}
                    </p>
                  </div>
                  {event.eventDate && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-600">Data</p>
                      <p className="mt-0.5 text-sm capitalize text-white">{formatDate(event.eventDate)}</p>
                    </div>
                  )}
                  {event.location && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-600">Local</p>
                      <p className="mt-0.5 text-sm text-white">{event.location}</p>
                    </div>
                  )}
                  {event.maxSlots && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-600">Vagas</p>
                      <p className="mt-0.5 text-sm text-white">{event.maxSlots} participantes</p>
                    </div>
                  )}
                  {!event.isWhatsappLead && event.price !== null && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-600">Investimento</p>
                      <p className="mt-0.5 font-serif text-xl font-bold text-amber-400">
                        {formatBRL(event.price as number)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Mini CTA na sidebar */}
              <div className="rounded-2xl border border-amber-400/10 bg-amber-400/5 p-5 text-center">
                <svg viewBox="0 0 100 100" className="mx-auto mb-3 h-8 w-8 text-amber-400/60" fill="currentColor">
                  <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
                </svg>
                <p className="mb-1 text-sm font-semibold text-white">Mestre Liu Artur</p>
                <p className="text-xs text-gray-500">15+ anos de prática espiritual</p>
                <a
                  href="https://wa.me/5511910998013"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-xs font-medium text-gray-400 transition-all hover:border-white/20 hover:text-white"
                >
                  <svg className="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Tirar dúvidas
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0a0a0f] to-[#080810] py-20">
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-900/20 to-transparent" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-900/5 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-amber-400/60">
            Pronto para transformar sua vida?
          </p>
          <h2 className="mb-6 font-serif text-3xl font-bold text-white lg:text-4xl">
            {event.isWhatsappLead
              ? "Entre em contato e saiba mais"
              : `Reserve sua vaga agora`}
          </h2>
          <p className="mb-8 text-gray-400">
            {event.isWhatsappLead
              ? "Fale diretamente com o Mestre Liu Artur e descubra como este trabalho pode transformar sua realidade."
              : "Vagas limitadas. Cada ritual é realizado com atenção individual e entrega total de energia ancestral."}
          </p>

          {event.isWhatsappLead ? (
            <a
              href={whatsappUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-green-600 to-green-500 px-10 py-5 text-lg font-bold text-white shadow-xl shadow-green-900/30 transition-all hover:shadow-green-700/50"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Mais Informações no WhatsApp
              <div className="absolute inset-0 -translate-x-full skew-x-12 bg-white/10 transition-transform duration-700 group-hover:translate-x-full" />
            </a>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              <button
                disabled
                className="group relative inline-flex cursor-not-allowed items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-10 py-5 text-lg font-bold text-black shadow-xl shadow-amber-900/30 opacity-90"
                title="Checkout em breve"
              >
                Reservar Minha Vaga
                {event.price !== null && (
                  <span className="rounded-full bg-black/20 px-3 py-1 text-sm">
                    {formatBRL(event.price as number)}
                  </span>
                )}
              </button>
              <a
                href="https://wa.me/5511910998013"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-5 text-base font-medium text-white/80 transition-all hover:border-white/20 hover:bg-white/10"
              >
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Tirar dúvidas pelo WhatsApp
              </a>
            </div>
          )}
        </div>
      </section>

    </main>
  );
}
