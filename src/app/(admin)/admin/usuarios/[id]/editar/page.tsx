import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { updateUser } from "./actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarUsuarioPage({ params }: Props) {
  const { id } = await params;

  const user = await db.user.findUnique({
    where: { id },
    include: { _count: { select: { purchases: true } } },
  });

  if (!user) notFound();

  const birthDateValue = user.birthDate
    ? user.birthDate.toISOString().split("T")[0]
    : "";

  const action = updateUser.bind(null, id);

  return (
    <div className="space-y-8 max-w-2xl">
      {/* ── Header ── */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/usuarios"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-gray-400 transition-all hover:border-white/20 hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400/60">Admin › Usuários</p>
          <h1 className="mt-0.5 font-serif text-2xl font-bold text-white">Editar Usuário</h1>
        </div>
      </div>

      {/* ── Info resumo ── */}
      <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/30 to-purple-900/20 text-lg font-bold text-purple-300">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-white">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="font-serif text-lg font-bold text-amber-400">{user._count.purchases}</p>
          <p className="text-xs text-gray-500">compra{user._count.purchases !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* ── Formulário ── */}
      <form action={action} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Nome */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Nome completo
            </label>
            <input
              name="name"
              defaultValue={user.name}
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              E-mail
            </label>
            <input
              name="email"
              type="email"
              defaultValue={user.email}
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20"
            />
          </div>

          {/* Telefone */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Telefone
            </label>
            <input
              name="phone"
              type="tel"
              defaultValue={user.phone ?? ""}
              placeholder="(11) 99999-9999"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20"
            />
          </div>

          {/* Data de nascimento */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Data de nascimento
            </label>
            <input
              name="birthDate"
              type="date"
              defaultValue={birthDateValue}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Role */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Permissão
          </label>
          <select
            name="role"
            defaultValue={user.role}
            className="w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-4 py-3 text-sm text-white outline-none transition-all focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20"
          >
            <option value="USER">Usuário</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        {/* Nova senha */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Nova senha <span className="normal-case text-gray-600">(deixe em branco para não alterar)</span>
          </label>
          <input
            name="newPassword"
            type="password"
            placeholder="Mínimo 6 caracteres"
            minLength={6}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20"
          />
        </div>

        {/* Ações */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-3 text-sm font-semibold text-black transition-all hover:shadow-lg hover:shadow-amber-900/30"
          >
            Salvar alterações
          </button>
          <Link
            href="/admin/usuarios"
            className="rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-gray-400 transition-all hover:border-white/20 hover:text-white"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
