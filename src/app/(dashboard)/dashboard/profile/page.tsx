"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, changePasswordSchema, type ProfileInput, type ChangePasswordInput } from "@/lib/validations/profile";
import { FormInput, IconUser, IconLock, IconCalendar } from "@/components/ui/FormInput";

// ─────────────────────────────────────────
// FEEDBACK INLINE
// ─────────────────────────────────────────

function Alert({
  type,
  message,
}: {
  type: "success" | "error";
  message: string;
}) {
  const styles = {
    success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    error: "border-red-500/20 bg-red-500/10 text-red-400",
  };
  const Icon = type === "success" ? CheckIcon : AlertIcon;
  return (
    <div className={`flex items-start gap-3 rounded-xl border p-4 ${styles[type]}`}>
      <Icon />
      <p className="text-sm">{message}</p>
    </div>
  );
}

// ─────────────────────────────────────────
// SEÇÃO: Dados Pessoais
// ─────────────────────────────────────────

function PersonalInfoForm({ currentName }: { currentName: string }) {
  const { update } = useSession();
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: currentName },
  });

  async function onSubmit(data: ProfileInput) {
    setStatus(null);
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();

    if (!res.ok) {
      setStatus({ type: "error", msg: json.error ?? "Erro ao salvar." });
      return;
    }

    // Atualiza a session no cliente
    await update({ name: data.name });
    setStatus({ type: "success", msg: "Perfil atualizado com sucesso!" });
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8">
      <div className="mb-6">
        <h2 className="font-serif text-lg font-semibold text-white">Dados Pessoais</h2>
        <p className="mt-1 text-sm text-gray-500">Atualize seu nome e data de nascimento.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormInput
          label="Nome completo"
          type="text"
          placeholder="João Silva"
          autoComplete="name"
          icon={<IconUser />}
          error={errors.name?.message}
          {...register("name")}
        />

        <FormInput
          label="Data de Nascimento"
          type="date"
          icon={<IconCalendar />}
          error={errors.birthDate?.message}
          max={new Date(new Date().setFullYear(new Date().getFullYear() - 18))
            .toISOString()
            .split("T")[0]}
          {...register("birthDate")}
        />

        {status && <Alert type={status.type} message={status.msg} />}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-amber-900/20 transition-all hover:shadow-amber-700/30 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
          >
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─────────────────────────────────────────
// SEÇÃO: Alterar Senha
// ─────────────────────────────────────────

function ChangePasswordForm() {
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onSubmit(data: ChangePasswordInput) {
    setStatus(null);
    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();

    if (!res.ok) {
      setStatus({ type: "error", msg: json.error ?? "Erro ao alterar senha." });
      return;
    }

    setStatus({ type: "success", msg: json.message });
    reset();
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8">
      <div className="mb-6">
        <h2 className="font-serif text-lg font-semibold text-white">Alterar Senha</h2>
        <p className="mt-1 text-sm text-gray-500">
          Use uma senha forte com letras maiúsculas e números.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormInput
          label="Senha Atual"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          icon={<IconLock />}
          error={errors.currentPassword?.message}
          {...register("currentPassword")}
        />

        <div className="border-t border-white/5 pt-5">
          <FormInput
            label="Nova Senha"
            type="password"
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            icon={<IconLock />}
            error={errors.newPassword?.message}
            hint="Mínimo 8 caracteres, 1 maiúscula e 1 número"
            {...register("newPassword")}
          />
        </div>

        <FormInput
          label="Confirmar Nova Senha"
          type="password"
          placeholder="Repita a nova senha"
          autoComplete="new-password"
          icon={<IconLock />}
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        {status && <Alert type={status.type} message={status.msg} />}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-white/5 border border-white/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
          >
            {isSubmitting ? "Alterando..." : "Alterar Senha"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Cabeçalho */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400/60">
          Configurações
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-white">Meu Perfil</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gerencie suas informações pessoais e segurança da conta.
        </p>
      </div>

      {/* Avatar + info resumida */}
      <div className="flex items-center gap-5 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-2xl font-bold text-black">
          {session.user.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-serif text-xl font-semibold text-white">
            {session.user.name}
          </p>
          <p className="text-sm text-gray-500">{session.user.email}</p>
          <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-400">
              Membro Ativo
            </span>
          </span>
        </div>
      </div>

      {/* Formulário de dados pessoais */}
      <PersonalInfoForm currentName={session.user.name ?? ""} />

      {/* Formulário de troca de senha */}
      <ChangePasswordForm />

      {/* Zona de perigo */}
      <div className="rounded-2xl border border-red-500/10 bg-red-500/5 p-6">
        <h3 className="font-serif text-base font-semibold text-red-400">Zona de Perigo</h3>
        <p className="mt-1 text-sm text-gray-500">
          Ações irreversíveis para sua conta.
        </p>
        <button
          type="button"
          className="mt-4 rounded-xl border border-red-500/30 px-5 py-2.5 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10"
        >
          Excluir minha conta
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// ÍCONES
// ─────────────────────────────────────────

function CheckIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374l7.027-12.248c.866-1.5 3.032-1.5 3.898 0l3.68 6.407M12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}
