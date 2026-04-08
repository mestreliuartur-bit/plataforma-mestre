import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const metadata = { title: "Meus Rituais" };

export default async function MeusEventosPage() {
  const session = await auth();

  const purchases = await db.purchase.findMany({
    where: { userId: session!.user.id },
    include: { event: true },
    orderBy: { createdAt: "desc" },
  });

  const formatPrice = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  const statusLabel: Record<string, { label: string; color: string }> = {
    CONFIRMED: { label: "Ativo", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
    PENDING: { label: "Pendente", color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10" },
    CANCELLED: { label: "Cancelado", color: "text-red-400 border-red-500/30 bg-red-500/10" },
  };

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400/60">
          Minha Jornada
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-white">Meus Rituais</h1>
        <p className="mt-1 text-sm text-gray-500">
          Todos os rituais e eventos adquiridos na plataforma.
        </p>
      </div>

      {purchases.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/5">
            <svg viewBox="0 0 100 100" className="h-8 w-8 text-amber-400/40" fill="currentColor">
              <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
            </svg>
          </div>
          <p className="text-base font-medium text-gray-400">Nenhum ritual adquirido</p>
          <p className="mt-1 text-sm text-gray-600">
            Explore os rituais disponíveis e comece sua transformação.
          </p>
          <Link
            href="/eventos"
            className="mt-6 rounded-full border border-amber-400/30 px-6 py-2.5 text-sm font-medium text-amber-400 hover:border-amber-400/60 hover:bg-amber-400/5"
          >
            Ver Rituais Disponíveis
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => {
            const s = statusLabel[purchase.status] ?? statusLabel.PENDING;
            return (
              <div
                key={purchase.id}
                className="flex items-center gap-6 rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:border-amber-400/10"
              >
                {/* Ícone */}
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/5">
                  <svg viewBox="0 0 100 100" className="h-7 w-7 text-amber-400" fill="currentColor">
                    <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
                  </svg>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-lg font-semibold text-white truncate">
                      {purchase.event.title}
                    </h3>
                    <span className={`flex-shrink-0 rounded-full border px-3 py-0.5 text-[10px] font-semibold uppercase ${s.color}`}>
                      {s.label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {purchase.event.type === "PRESENCIAL" ? "Presencial" : "À Distância"} ·{" "}
                    Adquirido em {new Date(purchase.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                {/* Preço + CTA */}
                <div className="flex-shrink-0 text-right">
                  <p className="font-serif text-lg font-bold text-amber-400">
                    {formatPrice(Number(purchase.pricePaid))}
                  </p>
                  {purchase.status === "CONFIRMED" && (
                    <Link
                      href={`/dashboard/conteudos?evento=${purchase.eventId}`}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-amber-400/70 hover:text-amber-400"
                    >
                      Acessar conteúdos
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
