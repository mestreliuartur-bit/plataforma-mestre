import Link from "next/link";
import { db } from "@/lib/db";
import { DeleteButton } from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function CampanhasPage() {
  const campaigns = await db.campaignPage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400/60">Admin</p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-white">Campanhas de Tráfego</h1>
          <p className="mt-1 text-sm text-gray-500">
            Páginas de captura isoladas para anúncios pagos (YouTube, Meta, etc.)
          </p>
        </div>
        <Link
          href="/admin/campanhas/nova"
          className="flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-black transition hover:bg-amber-300"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova Campanha
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total" value={campaigns.length} />
        <StatCard label="Ativas" value={campaigns.filter((c) => c.isActive).length} highlight />
        <StatCard label="Inativas" value={campaigns.filter((c) => !c.isActive).length} />
        <StatCard
          label="Com Vídeo"
          value={campaigns.filter((c) => c.mediaType === "VIDEO").length}
        />
      </div>

      {/* Table */}
      {campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] py-24 text-center">
          <svg className="h-12 w-12 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500">Nenhuma campanha criada ainda.</p>
          <Link
            href="/admin/campanhas/nova"
            className="text-sm font-semibold text-amber-400 hover:underline"
          >
            Criar primeira campanha →
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Headline</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Slug</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Mídia</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {campaigns.map((c) => (
                <tr key={c.id} className="group transition hover:bg-white/[0.02]">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-white line-clamp-1">{c.headline}</p>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-400">
                    /campanha/{c.slug}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      c.mediaType === "VIDEO"
                        ? "bg-purple-500/10 text-purple-400"
                        : "bg-blue-500/10 text-blue-400"
                    }`}>
                      {c.mediaType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      c.isActive
                        ? "bg-green-500/10 text-green-400"
                        : "bg-gray-500/10 text-gray-500"
                    }`}>
                      {c.isActive ? "Ativa" : "Inativa"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/campanha/${c.slug}`}
                        target="_blank"
                        title="Ver página pública"
                        className="rounded-lg p-1.5 text-gray-500 transition hover:bg-white/5 hover:text-gray-300"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </Link>
                      <Link
                        href={`/admin/campanhas/${c.id}`}
                        title="Editar campanha"
                        className="rounded-lg p-1.5 text-gray-500 transition hover:bg-white/5 hover:text-amber-400"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                        </svg>
                      </Link>
                      <DeleteButton id={c.id} />

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-5 ${highlight ? "border-amber-400/20 bg-amber-400/5" : "border-white/5 bg-white/[0.02]"}`}>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{label}</p>
    </div>
  );
}

