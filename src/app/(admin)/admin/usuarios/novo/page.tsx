import Link from "next/link";
import { createUser } from "../actions";

export default function NovoUsuarioPage() {
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
          <h1 className="mt-0.5 font-serif text-2xl font-bold text-white">Novo Usuário</h1>
        </div>
      </div>

      {/* ── Formulário ── */}
      <form action={createUser} className="space-y-5 rounded-2xl border border-white/5 bg-white/[0.02] p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Nome */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Nome completo
            </label>
            <input
              name="name"
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
            defaultValue="USER"
            className="w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-4 py-3 text-sm text-white outline-none transition-all focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20"
          >
            <option value="USER">Usuário</option>
            <option value="MODERATOR">Moderador</option>
            <option value="COURSE_CREATOR">Criador de Cursos</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        {/* Senha */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Senha
          </label>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="Mínimo 6 caracteres"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20"
          />
        </div>

        {/* Ações */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-3 text-sm font-semibold text-black transition-all hover:shadow-lg hover:shadow-amber-900/30"
          >
            Criar usuário
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
