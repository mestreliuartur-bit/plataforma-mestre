import { db } from "@/lib/db";

export default async function AdminUsuariosPage() {
  const users = await db.user.findMany({
    where: { role: "USER" },
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
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400/60">Admin</p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-white">Usuários</h1>
        <p className="mt-1 text-sm text-gray-500">{users.length} usuário(s) cadastrado(s)</p>
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
                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                    Usuário
                  </th>
                  <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                    Telefone
                  </th>
                  <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                    Nascimento
                  </th>
                  <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                    Compras
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                    Cadastro
                  </th>
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
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        user._count.purchases > 0
                          ? "bg-amber-900/40 text-amber-400"
                          : "bg-gray-800 text-gray-500"
                      }`}>
                        {user._count.purchases} compra{user._count.purchases !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500">{formatDateTime(user.createdAt)}</span>
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
