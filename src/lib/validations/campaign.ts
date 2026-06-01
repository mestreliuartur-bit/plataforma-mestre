import { z } from "zod";

export const campaignSchema = z.object({
  slug: z
    .string()
    .min(3, "Slug deve ter pelo menos 3 caracteres")
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido: use apenas letras minúsculas, números e hífens"),

  isActive: z.boolean().default(true),

  headline: z.string().min(5, "Headline obrigatória").max(200),
  subtitle: z.string().max(500).optional(),

  mediaType: z.enum(["VIDEO", "IMAGE"]).default("IMAGE"),
  mediaUrl: z.string().max(500).optional(),

  ctaLabel: z.string().min(2, "Texto do botão obrigatório").max(80),
  ctaUrl: z.string().min(1, "URL de destino obrigatória").max(500),

  aboutImage: z.string().max(500).optional(),
  aboutTitle: z.string().max(200).optional(),
  aboutText: z.string().max(5000).optional(),

  testimonials: z.string().optional(), // JSON string — parse manual

  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),

  pixelHead: z.string().optional(),
  pixelBody: z.string().optional(),
});

export type CampaignInput = z.infer<typeof campaignSchema>;
