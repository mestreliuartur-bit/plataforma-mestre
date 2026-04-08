import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { mockEvents } from "@/lib/mock-data";

// ─────────────────────────────────────────
// SERVER COMPONENT — busca dados reais
// ─────────────────────────────────────────

export default async function DashboardPage() {
  const session = await auth();

  // Buscar compras do usuário com dados do evento
  const purchases = await db.purchase.findMany({
    where: {
      userId: session!.user.id,
      status: "CONFIRMED",
    },
    include: { event: true },
    orderBy: { createdAt: "desc" },
  });

  const purchasedEventIds = new Set(purchases.map((p) => p.eventId));

  // Eventos disponíveis para upsell (publicados e não comprados)
  const availableEvents = await db.event.findMany({
    where: {
      isPublished: true,
      isActive: true,
      id: { notIn: [...purchasedEventIds] },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  // Fallback mock se o banco ainda não tem eventos cadastrados
  const upsellEvents =
    availableEvents.length > 0
      ? availableEvents
      : mockEvents.filter((e) => !purchasedEventIds.has(e.id)).slice(0, 3);

  const firstName = session!.user.name?.split(" ")[0] ?? "Iniciado";

  const formatPrice = (price: number | string) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(price));

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
            value: Math.floor(
              (Date.now() - new Date(session!.user.id.slice(0, 8) || Date.now()).getTime()) / 86400000
            ) || 1,
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
            <div className="mt-3 font-serif text-4xl font-bold text-white">
              {stat.value}
            </div>
            <div className="mt-1 text-xs text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── SEÇÃO 1: Meus Itens ── */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400/60">
              Minha Jornada
            </p>
            <h2 className="mt-0.5 font-serif text-xl font-bold text-white">
              Rituais & Eventos Adquiridos
            </h2>
          </div>
          {purchases.length > 0 && (
            <Link
              href="/dashboard/meus-eventos"
              className="text-xs text-amber-400/70 hover:text-amber-400"
            >
              Ver todos →
            </Link>
          )}
        </div>

        {purchases.length === 0 ? (
          /* Estado vazio */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/5">
              <svg viewBox="0 0 100 100" className="h-7 w-7 text-amber-400/50" fill="currentColor">
                <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-400">
              Nenhum ritual adquirido ainda
            </p>
            <p className="mt-1 text-xs text-gray-600">
              Explore os rituais abaixo e comece sua transformação
            </p>
            <Link
              href="/eventos"
              className="mt-5 rounded-full border border-amber-400/30 px-6 py-2 text-sm text-amber-400 hover:border-amber-400/60 hover:bg-amber-400/5"
            >
              Ver Rituais Disponíveis
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="group relative overflow-hidden rounded-2xl border border-amber-400/10 bg-gradient-to-br from-amber-900/10 to-transparent p-6 transition-all hover:border-amber-400/20"
              >
                {/* Badge "Ativo" */}
                <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-semibold text-emerald-400">ATIVO</span>
                </div>

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-400/10">
                  <svg viewBox="0 0 100 100" className="h-6 w-6 text-amber-400" fill="currentColor">
                    <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
                  </svg>
                </div>

                <h3 className="font-serif text-lg font-semibold text-white">
                  {purchase.event.title}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {purchase.event.type === "PRESENCIAL" ? "Presencial" : "À Distância"} ·{" "}
                  Pago: {formatPrice(Number(purchase.pricePaid))}
                </p>

                <Link
                  href={`/dashboard/conteudos?evento=${purchase.eventId}`}
                  className="mt-4 flex items-center gap-2 text-xs font-medium text-amber-400 hover:text-amber-300"
                >
                  Acessar conteúdos
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── SEÇÃO 2: Disponíveis para Você (Upsell) ── */}
      <section>
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-400/60">
            Exclusivo para Você
          </p>
          <h2 className="mt-0.5 font-serif text-xl font-bold text-white">
            Rituais Disponíveis
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Continue sua jornada de transformação com estes trabalhos especiais.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upsellEvents.map((event) => {
            const price = Number(event.price);
            return (
              <div
                key={event.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all hover:-translate-y-0.5 hover:border-purple-400/20 hover:shadow-lg hover:shadow-purple-900/10"
              >
                {/* Imagem / placeholder */}
                <div className="relative h-40 overflow-hidden bg-gradient-to-br from-purple-950 to-gray-900">
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <svg viewBox="0 0 100 100" className="h-20 w-20 text-purple-400" fill="currentColor">
                      <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
                    </svg>
                  </div>
                  <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                    event.type === "PRESENCIAL"
                      ? "bg-emerald-900/70 text-emerald-300"
                      : "bg-blue-900/70 text-blue-300"
                  }`}>
                    {event.type === "PRESENCIAL" ? "Presencial" : "À Distância"}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-serif text-base font-semibold text-white group-hover:text-purple-200">
                    {event.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-xs leading-relaxed text-gray-500 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-600">A partir de</p>
                      <p className="font-serif text-xl font-bold text-amber-400">
                        {formatPrice(Number(event.price))}
                      </p>
                    </div>
                    <Link
                      href={`/eventos/${"slug" in event ? event.slug : event.id}`}
                      className="rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-2 text-xs font-semibold text-black transition-all hover:shadow-lg hover:shadow-amber-900/20"
                    >
                      Adquirir
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
