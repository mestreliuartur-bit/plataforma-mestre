import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { db } from "@/lib/db";
import { isCloudinaryPublicId } from "@/lib/cloudinary";

interface SearchParams {
  type?: string;
  status?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function AdminEventosPage({ searchParams }: Props) {
  const { type, status } = await searchParams;

  const events = await db.event.findMany({
    where: {
      ...(type === "PRESENCIAL" || type === "DISTANCIA" ? { type } : {}),
      ...(status === "published" ? { isPublished: true } : {}),
      ...(status === "draft" ? { isPublished: false } : {}),
      ...(status === "inactive" ? { isActive: false } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { purchases: true } } },
  });

  const formatBRL = (v: number | string) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v));

  const formatDate = (d: Date | null) =>
    d ? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(d) : "—";

  const filterBase = "/admin/eventos";

  const typeFilters = [
    { label: "Todos", value: undefined },
    { label: "À Distância", value: "DISTANCIA" },
    { label: "Presencial", value: "PRESENCIAL" },
  ];

  const statusFilters = [
    { label: "Todos", value: undefined },
    { label: "Publicados", value: "published" },
    { label: "Rascunho", value: "draft" },
    { label: "Inativos", value: "inactive" },
  ];

  function buildUrl(newType?: string, newStatus?: string) {
    const params = new URLSearchParams();
    if (newType) params.set("type", newType);
    if (newStatus) params.set("status", newStatus);
    const qs = params.toString();
    return qs ? `${filterBase}?${qs}` : filterBase;
  }

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400/60">Admin</p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-white">Eventos & Rituais</h1>
          <p className="mt-1 text-sm text-gray-500">{events.length} evento(s) encontrado(s)</p>
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

      {/* ── Filtros ── */}
      <div className="flex flex-wrap gap-6">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-600">Tipo</span>
          <div className="flex gap-1.5">
            {typeFilters.map((f) => (
              <Link
                key={f.label}
                href={buildUrl(f.value, status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  type === f.value || (!type && !f.value)
                    ? "bg-amber-400/15 text-amber-400"
                    : "border border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {f.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-600">Status</span>
          <div className="flex gap-1.5">
            {statusFilters.map((f) => (
              <Link
                key={f.label}
                href={buildUrl(type, f.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  status === f.value || (!status && !f.value)
                    ? "bg-amber-400/15 text-amber-400"
                    : "border border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {f.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabela ── */}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/5">
              <svg viewBox="0 0 100 100" className="h-7 w-7 text-amber-400/50" fill="currentColor">
                <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-400">Nenhum evento encontrado</p>
            <Link href="/admin/eventos/novo" className="mt-4 rounded-full border border-amber-400/30 px-6 py-2 text-sm text-amber-400 hover:border-amber-400/60">
              Criar primeiro evento
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-500">Capa</th>
                  <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-500">Evento</th>
                  <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-500">Tipo</th>
                  <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-500">Status</th>
                  <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-500">Preço</th>
                  <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-500">Vendas</th>
                  <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-500">Data</th>
                  <th className="px-5 py-4 text-right text-[11px] font-semibold uppercase tracking-widest text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {events.map((event) => (
                  <tr key={event.id} className="group transition-colors hover:bg-white/[0.02]">
                    {/* Thumbnail 9:16 */}
                    <td className="px-5 py-3">
                      <div
                        className="relative overflow-hidden rounded-lg bg-gray-900 border border-white/10"
                        style={{ width: 44, height: 78 }}
                      >
                        {event.coverImage ? (
                          isCloudinaryPublicId(event.coverImage) ? (
                            <CldImage
                              src={event.coverImage}
                              alt={event.title}
                              fill
                              sizes="44px"
                              crop="fill"
                              gravity="auto"
                              quality="auto"
                              format="auto"
                              className="object-cover"
                            />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={event.coverImage}
                              alt={event.title}
                              className="h-full w-full object-cover"
                            />
                          )
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <svg viewBox="0 0 100 100" className="h-5 w-5 text-gray-700" fill="currentColor">
                              <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-white group-hover:text-amber-300 transition-colors">
                          {event.title}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-600">/{event.slug}</p>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        event.type === "PRESENCIAL"
                          ? "bg-emerald-900/50 text-emerald-400"
                          : "bg-blue-900/50 text-blue-400"
                      }`}>
                        {event.type === "PRESENCIAL" ? "Presencial" : "À Distância"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                          event.isPublished ? "bg-emerald-900/50 text-emerald-400" : "bg-gray-800 text-gray-500"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${event.isPublished ? "bg-emerald-400" : "bg-gray-600"}`} />
                          {event.isPublished ? "Publicado" : "Rascunho"}
                        </span>
                        {!event.isActive && (
                          <span className="inline-flex rounded-full bg-red-900/40 px-2.5 py-1 text-[10px] font-semibold text-red-400">
                            Inativo
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-serif text-sm font-semibold text-amber-400">
                        {formatBRL(Number(event.price))}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-300">{event._count.purchases}</span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-500">{formatDate(event.eventDate)}</span>
                    </td>

                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/eventos/${event.id}/editar`}
                          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-gray-400 transition-all hover:border-amber-400/30 hover:text-amber-400"
                        >
                          Editar
                        </Link>
                        <Link
                          href={`/eventos/${event.slug}`}
                          target="_blank"
                          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-gray-400 transition-all hover:border-white/20 hover:text-white"
                        >
                          Ver
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
