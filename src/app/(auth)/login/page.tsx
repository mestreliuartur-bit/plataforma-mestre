"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { FormInput, IconEmail, IconLock } from "@/components/ui/FormInput";

const AUTH_ERRORS: Record<string, string> = {
  CredentialsSignin: "E-mail ou senha incorretos.",
  Default: "Ocorreu um erro. Tente novamente.",
};

// ─────────────────────────────────────────
// Componente interno que usa useSearchParams
// (precisa estar dentro do <Suspense>)
// ─────────────────────────────────────────

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const registered = searchParams.get("registered");

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError(AUTH_ERRORS[result.error] ?? AUTH_ERRORS.Default);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <>
      {registered && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <svg className="h-5 w-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-emerald-400">Conta criada! Faça login para continuar.</p>
        </div>
      )}

      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-8 shadow-2xl shadow-black/40 backdrop-blur-sm">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <FormInput
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            icon={<IconEmail />}
            error={errors.email?.message}
            {...register("email")}
          />

          <div>
            <FormInput
              label="Senha"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              icon={<IconLock />}
              error={errors.password?.message}
              {...register("password")}
            />
            <div className="mt-2 text-right">
              <Link href="/recuperar-senha" className="text-xs text-amber-500/70 hover:text-amber-400">
                Esqueci minha senha
              </Link>
            </div>
          </div>

          {serverError && (
            <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
              <svg className="h-4 w-4 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374l7.027-12.248c.866-1.5 3.032-1.5 3.898 0l3.68 6.407" />
              </svg>
              <p className="text-sm text-red-400">{serverError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative mt-2 w-full overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-4 font-semibold text-black shadow-lg shadow-amber-900/20 transition-all hover:shadow-amber-700/30 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2"><Spinner /> Entrando...</span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Entrar na plataforma
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            )}
            <div className="absolute inset-0 -translate-x-full skew-x-12 bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/8" />
          <span className="text-xs text-gray-600">ou</span>
          <div className="h-px flex-1 bg-white/8" />
        </div>

        <p className="text-center text-sm text-gray-500">
          Ainda não tem uma conta?{" "}
          <Link href="/register" className="font-medium text-amber-400 hover:text-amber-300">
            Criar conta grátis
          </Link>
        </p>
      </div>
    </>
  );
}

// ─────────────────────────────────────────
// PAGE — envolve LoginForm em Suspense
// ─────────────────────────────────────────

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/5">
          <svg viewBox="0 0 100 100" className="h-8 w-8 text-amber-400" fill="currentColor">
            <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
          </svg>
        </div>
        <h1 className="font-serif text-3xl font-bold text-white">Bem-vindo de volta</h1>
        <p className="mt-2 text-sm text-gray-500">Acesse sua área espiritual exclusiva</p>
      </div>

      {/* Suspense obrigatório para useSearchParams no Next.js 15 */}
      <Suspense fallback={<div className="h-80 animate-pulse rounded-2xl border border-white/5 bg-white/[0.02]" />}>
        <LoginForm />
      </Suspense>

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
