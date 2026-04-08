"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput, getPasswordStrength } from "@/lib/validations/auth";
import {
  FormInput,
  PasswordStrength,
  IconEmail,
  IconLock,
  IconUser,
  IconPhone,
  IconCalendar,
} from "@/components/ui/FormInput";

// ─────────────────────────────────────────
// Máscara de telefone brasileiro
// ─────────────────────────────────────────

function applyPhoneMask(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

// ─────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const password = watch("password") ?? "";
  const strength = getPasswordStrength(password);

  async function onSubmit(data: RegisterInput) {
    setServerError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error ?? "Erro ao criar conta. Tente novamente.");
        return;
      }

      setSuccess(true);
      // Redireciona para login após 1.5s com mensagem de sucesso
      setTimeout(() => router.push("/login?registered=1"), 1500);
    } catch {
      setServerError("Falha de conexão. Verifique sua internet e tente novamente.");
    }
  }

  return (
    <div className="w-full max-w-lg">
      {/* ── Cabeçalho ── */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/5">
          <svg viewBox="0 0 100 100" className="h-8 w-8 text-amber-400" fill="currentColor">
            <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
          </svg>
        </div>
        <h1 className="font-serif text-3xl font-bold text-white">
          Inicie sua jornada
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Crie sua conta e acesse o universo do Mestre Liu Artur
        </p>
      </div>

      {/* ── Card ── */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-8 shadow-2xl shadow-black/40 backdrop-blur-sm">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

          {/* Nome + Sobrenome — lado a lado */}
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Nome"
              type="text"
              placeholder="João"
              autoComplete="given-name"
              icon={<IconUser />}
              error={errors.firstName?.message}
              {...register("firstName")}
            />
            <FormInput
              label="Sobrenome"
              type="text"
              placeholder="Silva"
              autoComplete="family-name"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>

          {/* Telefone com máscara */}
          <FormInput
            label="Telefone"
            type="tel"
            placeholder="(11) 99999-9999"
            autoComplete="tel"
            icon={<IconPhone />}
            error={errors.phone?.message}
            hint="WhatsApp preferencialmente"
            {...register("phone", {
              onChange: (e) => {
                const masked = applyPhoneMask(e.target.value);
                setValue("phone", masked, { shouldValidate: false });
                e.target.value = masked;
              },
            })}
          />

          {/* E-mail */}
          <FormInput
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            icon={<IconEmail />}
            error={errors.email?.message}
            {...register("email")}
          />

          {/* Data de aniversário */}
          <FormInput
            label="Data de Aniversário"
            type="date"
            autoComplete="bday"
            icon={<IconCalendar />}
            error={errors.birthDate?.message}
            hint="Você deve ter pelo menos 18 anos"
            max={new Date(new Date().setFullYear(new Date().getFullYear() - 18))
              .toISOString()
              .split("T")[0]}
            {...register("birthDate")}
          />

          {/* Senha */}
          <div>
            <FormInput
              label="Senha"
              type="password"
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              icon={<IconLock />}
              error={errors.password?.message}
              hint="Use letras maiúsculas, números e símbolos"
              {...register("password")}
            />
            {/* Indicador de força */}
            <PasswordStrength
              score={strength.score}
              label={strength.label}
              color={strength.color}
            />
          </div>

          {/* Termos */}
          <label className="flex cursor-pointer items-start gap-3">
            <div className="relative mt-0.5 flex-shrink-0">
              <input
                type="checkbox"
                required
                className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-white/15 bg-white/5 checked:border-amber-500 checked:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
              {/* checkmark */}
              <svg
                className="pointer-events-none absolute inset-0 m-auto hidden h-2.5 w-2.5 text-black peer-checked:block"
                viewBox="0 0 10 8" fill="currentColor"
              >
                <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xs leading-relaxed text-gray-500">
              Concordo com os{" "}
              <Link href="/termos-de-uso" className="text-amber-400/80 hover:text-amber-400">
                Termos de Uso
              </Link>{" "}
              e a{" "}
              <Link href="/politica-de-privacidade" className="text-amber-400/80 hover:text-amber-400">
                Política de Privacidade
              </Link>
            </span>
          </label>

          {/* Feedback de erro do servidor */}
          {serverError && (
            <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="text-sm text-red-400">{serverError}</p>
            </div>
          )}

          {/* Feedback de sucesso */}
          {success && (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <svg className="h-5 w-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-emerald-400">
                Conta criada com sucesso! Redirecionando para o login...
              </p>
            </div>
          )}

          {/* Botão submit */}
          <button
            type="submit"
            disabled={isSubmitting || success}
            className="group relative mt-2 w-full overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-4 font-semibold text-black shadow-lg shadow-amber-900/20 transition-all hover:shadow-amber-700/30 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner />
                Criando sua conta...
              </span>
            ) : (
              <span className="relative flex items-center justify-center gap-2">
                Criar minha conta
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            )}
            <div className="absolute inset-0 -translate-x-full skew-x-12 bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />
          </button>
        </form>

        {/* ── Link para login ── */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/8" />
          <span className="text-xs text-gray-600">ou</span>
          <div className="h-px flex-1 bg-white/8" />
        </div>

        <p className="text-center text-sm text-gray-500">
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="font-medium text-amber-400 transition-colors hover:text-amber-300"
          >
            Fazer login
          </Link>
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-gray-700">
        Seus dados estão protegidos e criptografados.
      </p>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
