import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { EventCarousel } from "@/components/EventCarousel";

export default async function DashboardPage() {
  const session = await auth();

  const [purchases, currentUser] = await Promise.all([
    db.purchase.findMany({
      where: { userId: session!.user.id, status: "CONFIRMED" },
      include: { event: true },
      orderBy: { createdAt: "desc" },
    }),
    db.user.findUnique({
      where: { id: session!.user.id },
      select: { createdAt: true },
    }),
  ]);

  const purchasedEventIds = new Set(purchases.map((p) => p.eventId));

  const availableEvents = await db.event.findMany({
    where: {
      isPublished: true,
      isActive: true,
      id: { notIn: [...purchasedEventIds] },
    },
    orderBy: { createdAt: "desc" },
  });

  const firstName = session!.user.name?.split(" ")[0] ?? "Iniciado";

  const formatBRL = (v: number | string) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v));

  // Prepara os eventos adquiridos no formato do carrossel
  const purchasedCarouselEvents = purchases.map((p) => ({
    id: p.event.id,
    slug: p.event.slug,
    title: p.event.title,
    description: p.event.description,
    price: Number(p.pricePaid),
    coverImage: p.event.coverImage,
    type: p.event.type,
    eventDate: p.event.eventDate,
    maxSlots: p.event.maxSlots,
  }));

  return (
    <div className="space-y-12">
      {/* ── Saudação ── */}
      <div>
        <p className="font-sans text-xs font-semibold uppercase tracking-widest text-amber-400/60">
          Área Exclusiva
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-white">
          Bem-vindo, {firstName}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {purchases.length > 0
            ? `Você tem ${purchases.length} ritual${purchases.length > 1 ? "is" : ""} ativo${purchases.length > 1 ? "s" : ""}.`
            : "Explore os rituais disponíveis e inicie sua transformação."}
        </p>
      </div>

      {/* ── Cards de resumo ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Rituais Adquiridos",
            value: purchases.length,
            icon: "⭐",
            color: "from-amber-500/20 to-amber-900/5",
            border: "border-amber-500/20",
          },
          {
            label: "Conteúdos Disponíveis",
            value: purchases.length * 3,
            icon: "🎬",
            color: "from-purple-500/20 to-purple-900/5",
            border: "border-purple-500/20",
          },
          {
            label: "Dias como Membro",
            value: Math.max(1, Math.floor((Date.now() - (currentUser?.createdAt ?? new Date()).getTime()) / 86400000)),
            icon: "🌙",
            color: "from-blue-500/20 to-blue-900/5",
            border: "border-blue-500/20",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl border ${stat.border} bg-gradient-to-br ${stat.color} p-6`}
          >
            <div className="text-2xl">{stat.icon}</div>
            <div className="mt-3 font-serif text-4xl font-bold text-white">{stat.value}</div>
            <div className="mt-1 text-xs text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Carrossel: Meus Rituais ── */}
      {purchases.length > 0 ? (
        <EventCarousel
          title="Meus Rituais & Eventos"
          subtitle="Minha Jornada"
          events={purchasedCarouselEvents}
          purchasedIds={purchasedEventIds}
          viewAllHref="/dashboard/meus-eventos"
          accentColor="amber"
        />
      ) : (
        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-amber-400/60">
            Minha Jornada
          </p>
          <h2 className="mb-6 font-serif text-xl font-bold text-white">Meus Rituais & Eventos</h2>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/5">
              <svg viewBox="0 0 100 100" className="h-7 w-7 text-amber-400/50" fill="currentColor">
                <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-400">Nenhum ritual adquirido ainda</p>
            <p className="mt-1 text-xs text-gray-600">Explore os rituais abaixo e comece sua transformação</p>
            <Link
              href="/eventos"
              className="mt-5 rounded-full border border-amber-400/30 px-6 py-2 text-sm text-amber-400 hover:border-amber-400/60 hover:bg-amber-400/5"
            >
              Ver Rituais Disponíveis
            </Link>
          </div>
        </section>
      )}

      {/* ── Carrossel: Disponíveis (Upsell) ── */}
      {availableEvents.length > 0 && (
        <EventCarousel
          title="Rituais Disponíveis"
          subtitle="Exclusivo para Você"
          events={availableEvents.map((e) => ({
            id: e.id,
            slug: e.slug,
            title: e.title,
            description: e.description,
            price: Number(e.price),
            coverImage: e.coverImage,
            type: e.type,
            eventDate: e.eventDate,
            maxSlots: e.maxSlots,
          }))}
          viewAllHref="/eventos"
          accentColor="purple"
        />
      )}

      {/* Estado vazio total */}
      {availableEvents.length === 0 && purchases.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 py-12 text-center">
          <p className="text-sm text-gray-500">
            Nenhum ritual disponível no momento. Volte em breve!
          </p>
        </div>
      )}

      {/* ── Resumo financeiro (para usuários com compras) ── */}
      {purchases.length > 0 && (
        <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <h2 className="mb-4 font-serif text-lg font-semibold text-white">Resumo de Compras</h2>
          <div className="space-y-3">
            {purchases.slice(0, 3).map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                  <p className="truncate text-sm text-gray-300">{p.event.title}</p>
                </div>
                <span className="flex-shrink-0 font-serif text-sm font-semibold text-amber-400">
                  {formatBRL(Number(p.pricePaid))}
                </span>
              </div>
            ))}
            {purchases.length > 3 && (
              <Link href="/dashboard/meus-eventos" className="mt-2 block text-xs text-amber-400/60 hover:text-amber-400">
                + {purchases.length - 3} mais → Ver todos
              </Link>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
