import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo"),

  birthDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(new Date(val).getTime()), "Data inválida"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Senha atual é obrigatória"),

    newPassword: z
      .string()
      .min(8, "Nova senha deve ter no mínimo 8 caracteres")
      .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
      .regex(/[0-9]/, "Deve conter pelo menos um número"),

    confirmPassword: z
      .string()
      .min(1, "Confirme a nova senha"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type ProfileInput = z.infer<typeof profileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
