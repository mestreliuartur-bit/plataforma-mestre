import { z } from "zod";

export const eventSchema = z.object({
  title: z
    .string()
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(120, "Título muito longo"),

  slug: z
    .string()
    .min(3, "Slug deve ter pelo menos 3 caracteres")
    .max(160, "Slug muito longo")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido: use apenas letras minúsculas, números e hífens"),

  description: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),

  price: z
    .string()
    .min(1, "Preço é obrigatório")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, "Preço inválido"),

  coverImage: z
    .string()
    .url("URL da imagem inválida")
    .or(z.literal("")),

  type: z.enum(["PRESENCIAL", "DISTANCIA"]),

  isActive: z.boolean().default(true),
  isPublished: z.boolean().default(false),

  maxSlots: z
    .string()
    .optional()
    .refine((v) => !v || (!isNaN(parseInt(v)) && parseInt(v) > 0), "Vagas inválidas"),

  eventDate: z.string().optional(),
  location: z.string().max(300, "Localização muito longa").optional(),
});

export type EventInput = z.infer<typeof eventSchema>;

export const bannerSchema = z.object({
  title: z.string().min(2, "Título obrigatório").max(100),
  subtitle: z.string().max(200).optional(),
  imageUrl: z.string().url("URL da imagem inválida"),
  ctaLabel: z.string().min(1, "Texto do botão obrigatório").max(50),
  ctaUrl: z.string().min(1, "URL de destino obrigatória").max(500),
  eventId: z.string().optional(),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

export type BannerInput = z.infer<typeof bannerSchema>;

// Utilitário: título → slug
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
