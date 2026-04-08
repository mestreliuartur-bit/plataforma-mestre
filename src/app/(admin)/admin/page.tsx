import Link from "next/link";
import { db } from "@/lib/db";

export default async function AdminDashboardPage() {
  // ── Métricas ──────────────────────────────────────────────────────
  const [totalUsers, totalEvents, totalPurchases, recentUsers, recentEvents] =
    await Promise.all([
      db.user.count({ where: { role: "USER" } }),
      db.event.count(),
      db.purchase.count({ where: { status: "CONFIRMED" } }),
      db.user.findMany({
        where: { role: "USER" },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, email: true, createdAt: true },
      }),
      db.event.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          type: true,
          isPublished: true,
          price: true,
          createdAt: true,
          _count: { select: { purchases: true } },
        },
      }),
    ]);

  // Receita total (compras confirmadas)
  const revenueResult = await db.purchase.aggregate({
    where: { status: "CONFIRMED" },
    _sum: { pricePaid: true },
  });
  const totalRevenue = Number(revenueResult._sum.pricePaid ?? 0);

  const formatBRL = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  const formatDate = (d: Date) =>
    new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(d);

  const stats = [
    {
      label: "Total de Usuários",
      value: totalUsers,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
      color: "from-blue-500/20 to-blue-900/5",
      border: "border-blue-500/20",
      text: "text-blue-400",
      href: "/admin/usuarios",
    },
    {
      label: "Eventos Criados",
      value: totalEvents,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ),
      color: "from-purple-500/20 to-purple-900/5",
      border: "border-purple-500/20",
      text: "text-purple-400",
      href: "/admin/eventos",
    },
    {
      label: "Vendas Confirmadas",
      value: totalPurchases,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
        </svg>
      ),
      color: "from-emerald-500/20 to-emerald-900/5",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      href: "/admin/usuarios",
    },
    {
      label: "Receita Total",
      value: formatBRL(totalRevenue),
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-amber-500/20 to-amber-900/5",
      border: "border-amber-500/20",
      text: "text-amber-400",
      href: "/admin/usuarios",
      isRevenue: true,
    },
  ];

  return (
    <div className="space-y-10">
      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-amber-400/60">
            Backoffice
          </p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-white">
            Dashboard Administrativo
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Visão geral da plataforma Mestre Liu Artur
          </p>
        </div>
        <Link
          href="/admin/eventos/novo"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-2.5 text-sm font-semibold text-black transition-all hover:shadow-lg hover:shadow-amber-900/30"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Novo Evento
        </Link>
      </div>

      {/* ── Métricas ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`group rounded-2xl border ${stat.border} bg-gradient-to-br ${stat.color} p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg`}
          >
            <div className={`${stat.text} mb-4`}>{stat.icon}</div>
            <div className={`font-serif text-3xl font-bold ${stat.isRevenue ? "text-2xl" : ""} text-white`}>
              {stat.value}
            </div>
            <div className="mt-1 text-xs text-gray-400">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* ── Gateway placeholder ── */}
      <div className="rounded-2xl border border-dashed border-amber-400/20 bg-amber-400/5 px-6 py-5">
        <div className="flex items-center gap-3">
          <svg className="h-5 w-5 text-amber-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-amber-400/80">Gateway de Pagamento</p>
            <p className="text-xs text-gray-500">
              Integração com Stripe / Mercado Pago será adicionada nesta área — métricas de faturamento em tempo real.
            </p>
          </div>
          <span className="ml-auto rounded-full border border-amber-400/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-400/60">
            Em breve
          </span>
        </div>
      </div>

      {/* ── Tabelas resumo lado a lado ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Últimos usuários */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02]">
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
            <h2 className="font-serif text-base font-semibold text-white">Últimos Usuários</h2>
            <Link href="/admin/usuarios" className="text-xs text-amber-400/70 hover:text-amber-400">
              Ver todos →
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentUsers.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-gray-500">Nenhum usuário cadastrado</p>
            ) : (
              recentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-4 px-6 py-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/30 to-blue-900/10 text-sm font-bold text-blue-300">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{user.name}</p>
                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                  </div>
                  <span className="flex-shrink-0 text-xs text-gray-600">{formatDate(user.createdAt)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Últimos eventos */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02]">
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
            <h2 className="font-serif text-base font-semibold text-white">Últimos Eventos</h2>
            <Link href="/admin/eventos" className="text-xs text-amber-400/70 hover:text-amber-400">
              Ver todos →
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentEvents.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-gray-500">Nenhum evento cadastrado</p>
            ) : (
              recentEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-4 px-6 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{event.title}</p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        event.type === "PRESENCIAL"
                          ? "bg-emerald-900/50 text-emerald-400"
                          : "bg-blue-900/50 text-blue-400"
                      }`}>
                        {event.type === "PRESENCIAL" ? "Presencial" : "À Distância"}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        event.isPublished
                          ? "bg-emerald-900/50 text-emerald-400"
                          : "bg-gray-800 text-gray-500"
                      }`}>
                        {event.isPublished ? "Publicado" : "Rascunho"}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="font-serif text-sm font-semibold text-amber-400">
                      {formatBRL(Number(event.price))}
                    </p>
                    <p className="text-[10px] text-gray-600">{event._count.purchases} vendas</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
