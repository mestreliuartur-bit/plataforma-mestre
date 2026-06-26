import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";

interface Props {
  searchParams: Promise<{ entity?: string; action?: string; userId?: string }>;
}

const ENTITIES = ["Course", "Module", "Lesson", "Event", "Banner", "CampaignPage", "User", "Enrollment"];
const ACTIONS = ["CREATE", "UPDATE", "DELETE"];

export default async function AdminLogsPage({ searchParams }: Props) {
  const session = await auth();
  if (session?.user?.role !== "SUPERADMIN") redirect("/admin");

  const { entity, action, userId } = await searchParams;

  const logs = await db.auditLog.findMany({
    where: {
      ...(entity ? { entity } : {}),
      ...(action ? { action: action as "CREATE" | "UPDATE" | "DELETE" } : {}),
      ...(userId ? { userId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 300,
  });

  const users = await db.user.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const formatDateTime = (d: Date) =>
    new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    }).format(d);

  const buildHref = (params: { entity?: string; action?: string; userId?: string }) => {
    const merged = { entity, action, userId, ...params };
    const sp = new URLSearchParams();
    if (merged.entity) sp.set("entity", merged.entity);
    if (merged.action) sp.set("action", merged.action);
    if (merged.userId) sp.set("userId", merged.userId);
    const qs = sp.toString();
    return qs ? `/admin/logs?${qs}` : "/admin/logs";
  };

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400/60">Admin</p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-white">Histórico de Atividades</h1>
        <p className="mt-1 text-sm text-gray-500">Quem criou, editou ou removeu o quê — últimos {logs.length} registros</p>
      </div>

      {/* ── Filtros ── */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Filtrar:</span>

        {/* Filtros via links (server component, sem JS) */}
        <div className="flex flex-wrap gap-1.5">
          <Link
            href={buildHref({ entity: undefined })}
            className={`rounded-full px-3 py-1 text-xs font-medium ${!entity ? "bg-amber-400/20 text-amber-400" : "bg-white/5 text-gray-400 hover:text-white"}`}
          >
            Todas entidades
          </Link>
          {ENTITIES.map((e) => (
            <Link
              key={e}
              href={buildHref({ entity: e })}
              className={`rounded-full px-3 py-1 text-xs font-medium ${entity === e ? "bg-amber-400/20 text-amber-400" : "bg-white/5 text-gray-400 hover:text-white"}`}
            >
              {e}
            </Link>
          ))}
        </div>

        <div className="h-5 w-px bg-white/10" />

        <div className="flex flex-wrap gap-1.5">
          <Link
            href={buildHref({ action: undefined })}
            className={`rounded-full px-3 py-1 text-xs font-medium ${!action ? "bg-amber-400/20 text-amber-400" : "bg-white/5 text-gray-400 hover:text-white"}`}
          >
            Todas ações
          </Link>
          {ACTIONS.map((a) => (
            <Link
              key={a}
              href={buildHref({ action: a })}
              className={`rounded-full px-3 py-1 text-xs font-medium ${action === a ? "bg-amber-400/20 text-amber-400" : "bg-white/5 text-gray-400 hover:text-white"}`}
            >
              {a}
            </Link>
          ))}
        </div>

        <div className="h-5 w-px bg-white/10" />

        <div className="flex flex-wrap gap-1.5">
          <Link
            href={buildHref({ userId: undefined })}
            className={`rounded-full px-3 py-1 text-xs font-medium ${!userId ? "bg-amber-400/20 text-amber-400" : "bg-white/5 text-gray-400 hover:text-white"}`}
          >
            Todos usuários
          </Link>
          {users.map((u) => (
            <Link
              key={u.id}
              href={buildHref({ userId: u.id })}
              className={`rounded-full px-3 py-1 text-xs font-medium ${userId === u.id ? "bg-amber-400/20 text-amber-400" : "bg-white/5 text-gray-400 hover:text-white"}`}
            >
              {u.name}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Tabela ── */}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm text-gray-500">Nenhum registro encontrado para este filtro.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-500">Quando</th>
                  <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-500">Usuário</th>
                  <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-500">Ação</th>
                  <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-500">Entidade</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-500">Descrição</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {logs.map((log) => (
                  <tr key={log.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-6 py-3 whitespace-nowrap text-xs text-gray-500">{formatDateTime(log.createdAt)}</td>
                    <td className="px-4 py-3 text-sm text-white">{log.userName}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        log.action === "CREATE"
                          ? "bg-emerald-900/40 text-emerald-400"
                          : log.action === "UPDATE"
                          ? "bg-sky-900/40 text-sky-400"
                          : "bg-red-900/40 text-red-400"
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">{log.entity}</td>
                    <td className="px-6 py-3 text-sm text-gray-300">{log.label}</td>
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
