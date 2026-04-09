import Link from "next/link";
import { db } from "@/lib/db";

export default async function AdminUsuariosPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { purchases: true } },
    },
  });

  const formatDate = (d: Date | null | undefined) =>
    d
      ? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(d)
      : "—";

  const formatDateTime = (d: Date) =>
    new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }).format(d);

  const total = users.length;
  const admins = users.filter((u) => u.role === "ADMIN").length;
  const withPurchases = users.filter((u) => u._count.purchases > 0).length;

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400/60">Admin</p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-white">Usuários</h1>
          <p className="mt-1 text-sm text-gray-500">{total} usuário(s) cadastrado(s)</p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: total, color: "text-white" },
          { label: "Admins", value: admins, color: "text-amber-400" },
          { label: "Com compras", value: withPurchases, color: "text-emerald-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4">
            <p className={`font-serif text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="mt-0.5 text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Tabela ── */}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm text-gray-500">Nenhum usuário cadastrado ainda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-500">Usuário</th>
                  <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-500">Telefone</th>
                  <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-500">Nascimento</th>
                  <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-500">Role</th>
                  <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-500">Compras</th>
                  <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-500">Cadastro</th>
                  <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-widest text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {users.map((user) => (
                  <tr key={user.id} className="group transition-colors hover:bg-white/[0.02]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/30 to-purple-900/10 text-sm font-bold text-purple-300">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white">{user.name}</p>
                          <p className="truncate text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-300">
                        {user.phone ?? <span className="text-gray-600">—</span>}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-300">{formatDate(user.birthDate)}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        user.role === "ADMIN"
                          ? "bg-amber-900/40 text-amber-400"
                          : "bg-gray-800 text-gray-400"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        user._count.purchases > 0
                          ? "bg-emerald-900/40 text-emerald-400"
                          : "bg-gray-800 text-gray-500"
                      }`}>
                        {user._count.purchases} compra{user._count.purchases !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs text-gray-500">{formatDateTime(user.createdAt)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/usuarios/${user.id}/editar`}
                        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-gray-400 transition-all hover:border-amber-400/30 hover:text-amber-400"
                      >
                        Editar
                      </Link>
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
