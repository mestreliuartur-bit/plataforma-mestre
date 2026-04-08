"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";

// ─────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

// ─────────────────────────────────────────
// INPUT BASE — Reutilizável e temático
// ─────────────────────────────────────────

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, hint, icon, className = "", type, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {/* Label */}
        <label
          htmlFor={inputId}
          className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gray-400"
        >
          {label}
        </label>

        {/* Input wrapper */}
        <div className="relative">
          {/* Ícone esquerda */}
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-500">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            autoComplete={isPassword ? "current-password" : undefined}
            className={[
              // Base
              "w-full rounded-xl border bg-white/[0.03] px-4 py-3.5",
              "text-sm text-white placeholder-gray-600",
              "outline-none transition-all duration-200",
              // Borda normal
              error
                ? "border-red-500/50 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
                : "border-white/8 focus:border-amber-500/60 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.12)]",
              // Padding com ícone
              icon ? "pl-11" : "pl-4",
              isPassword ? "pr-11" : "pr-4",
              className,
            ].join(" ")}
            {...props}
          />

          {/* Toggle senha */}
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-4 flex items-center text-gray-500 transition-colors hover:text-gray-300"
              aria-label={showPassword ? "Ocultar senha" : "Exibir senha"}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          )}
        </div>

        {/* Erro */}
        {error && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
            <AlertIcon />
            {error}
          </p>
        )}

        {/* Dica */}
        {!error && hint && (
          <p className="mt-1.5 text-xs text-gray-600">{hint}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

// ─────────────────────────────────────────
// INDICADOR DE FORÇA DA SENHA
// ─────────────────────────────────────────

interface PasswordStrengthProps {
  score: number; // 0–4
  label: string;
  color: string;
}

export function PasswordStrength({ score, label, color }: PasswordStrengthProps) {
  if (!label) return null;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < score ? color : "bg-white/10"
            }`}
          />
        ))}
      </div>
      <p className="text-right text-[10px] text-gray-500">{label}</p>
    </div>
  );
}

// ─────────────────────────────────────────
// ÍCONES INLINE (sem dependência extra)
// ─────────────────────────────────────────

function EyeIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}

// ─────────────────────────────────────────
// ÍCONES DE FORMULÁRIO (temáticos)
// ─────────────────────────────────────────

export function IconEmail() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

export function IconLock() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

export function IconUser() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

export function IconPhone() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

export function IconCalendar() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}
