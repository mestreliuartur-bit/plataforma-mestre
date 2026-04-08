import { z } from "zod";

// ─────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("Informe um e-mail válido"),
  password: z
    .string()
    .min(1, "Senha é obrigatória"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ─────────────────────────────────────────
// CADASTRO
// ─────────────────────────────────────────

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome muito longo")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome inválido"),

  lastName: z
    .string()
    .min(2, "Sobrenome deve ter pelo menos 2 caracteres")
    .max(80, "Sobrenome muito longo")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Sobrenome inválido"),

  phone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .regex(
      /^\(\d{2}\) \d{4,5}-\d{4}$/,
      "Formato inválido. Use: (XX) XXXXX-XXXX"
    ),

  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("Informe um e-mail válido")
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .max(100, "Senha muito longa")
    .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "Deve conter pelo menos um número"),

  birthDate: z
    .string()
    .min(1, "Data de aniversário é obrigatória")
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, "Data inválida")
    .refine((val) => {
      const birth = new Date(val);
      const today = new Date();
      const age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      const dayDiff = today.getDate() - birth.getDate();
      const exactAge =
        monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
      return exactAge >= 18;
    }, "Você deve ter pelo menos 18 anos")
    .refine((val) => {
      return new Date(val) < new Date();
    }, "Data de aniversário não pode ser no futuro"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// ─────────────────────────────────────────
// UTILIDADE: força de senha
// ─────────────────────────────────────────

export function getPasswordStrength(password: string): {
  score: number; // 0–4
  label: string;
  color: string;
} {
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: "Muito fraca", color: "bg-red-500" },
    { label: "Fraca", color: "bg-orange-500" },
    { label: "Razoável", color: "bg-yellow-500" },
    { label: "Forte", color: "bg-emerald-500" },
    { label: "Muito forte", color: "bg-emerald-400" },
  ];

  return { score, ...levels[Math.min(score, 4)] };
}
