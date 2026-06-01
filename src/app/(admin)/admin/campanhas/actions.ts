"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { campaignSchema } from "@/lib/validations/campaign";
import { slugify } from "@/lib/validations/event";

function parseFormData(formData: FormData) {
  const raw = {
    slug: (formData.get("slug") as string) || slugify(formData.get("headline") as string),
    isActive: formData.get("isActive") === "true",
    headline: formData.get("headline") as string,
    subtitle: (formData.get("subtitle") as string) || undefined,
    mediaType: (formData.get("mediaType") as string) || "IMAGE",
    mediaUrl: (formData.get("mediaUrl") as string) || undefined,
    ctaLabel: (formData.get("ctaLabel") as string) || "Quero Participar Agora",
    ctaUrl: formData.get("ctaUrl") as string,
    aboutImage: (formData.get("aboutImage") as string) || undefined,
    aboutTitle: (formData.get("aboutTitle") as string) || undefined,
    aboutText: (formData.get("aboutText") as string) || undefined,
    testimonials: (formData.get("testimonials") as string) || undefined,
    metaTitle: (formData.get("metaTitle") as string) || undefined,
    metaDescription: (formData.get("metaDescription") as string) || undefined,
    pixelHead: (formData.get("pixelHead") as string) || undefined,
    pixelBody: (formData.get("pixelBody") as string) || undefined,
  };
  return raw;
}

export async function createCampaign(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Sem permissão");

  const raw = parseFormData(formData);
  const parsed = campaignSchema.safeParse(raw);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const formErrors = parsed.error.flatten().formErrors;
    return { error: formErrors[0] ?? Object.values(errors).flat()[0] ?? "Dados inválidos" };
  }

  const data = parsed.data;
  let testimonials = null;
  if (data.testimonials) {
    try {
      testimonials = JSON.parse(data.testimonials);
    } catch {
      return { error: "Depoimentos com formato JSON inválido" };
    }
  }

  try {
    await db.campaignPage.create({
      data: {
        slug: data.slug,
        isActive: data.isActive,
        headline: data.headline,
        subtitle: data.subtitle ?? null,
        mediaType: data.mediaType as "VIDEO" | "IMAGE",
        mediaUrl: data.mediaUrl ?? null,
        ctaLabel: data.ctaLabel,
        ctaUrl: data.ctaUrl,
        aboutImage: data.aboutImage ?? null,
        aboutTitle: data.aboutTitle ?? null,
        aboutText: data.aboutText ?? null,
        testimonials: testimonials ?? undefined,
        metaTitle: data.metaTitle ?? null,
        metaDescription: data.metaDescription ?? null,
        pixelHead: data.pixelHead ?? null,
        pixelBody: data.pixelBody ?? null,
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("Unique constraint") || msg.includes("unique")) {
      return { error: "Já existe uma campanha com esse slug" };
    }
    return { error: "Erro ao criar campanha" };
  }

  revalidatePath("/admin/campanhas");
  redirect("/admin/campanhas");
}

export async function updateCampaign(id: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Sem permissão");

  const raw = parseFormData(formData);
  const parsed = campaignSchema.safeParse(raw);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const formErrors = parsed.error.flatten().formErrors;
    return { error: formErrors[0] ?? Object.values(errors).flat()[0] ?? "Dados inválidos" };
  }

  const data = parsed.data;
  let testimonials = null;
  if (data.testimonials) {
    try {
      testimonials = JSON.parse(data.testimonials);
    } catch {
      return { error: "Depoimentos com formato JSON inválido" };
    }
  }

  try {
    await db.campaignPage.update({
      where: { id },
      data: {
        slug: data.slug,
        isActive: data.isActive,
        headline: data.headline,
        subtitle: data.subtitle ?? null,
        mediaType: data.mediaType as "VIDEO" | "IMAGE",
        mediaUrl: data.mediaUrl ?? null,
        ctaLabel: data.ctaLabel,
        ctaUrl: data.ctaUrl,
        aboutImage: data.aboutImage ?? null,
        aboutTitle: data.aboutTitle ?? null,
        aboutText: data.aboutText ?? null,
        testimonials: testimonials ?? undefined,
        metaTitle: data.metaTitle ?? null,
        metaDescription: data.metaDescription ?? null,
        pixelHead: data.pixelHead ?? null,
        pixelBody: data.pixelBody ?? null,
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("Unique constraint") || msg.includes("unique")) {
      return { error: "Já existe uma campanha com esse slug" };
    }
    return { error: "Erro ao atualizar campanha" };
  }

  revalidatePath("/admin/campanhas");
  redirect("/admin/campanhas");
}

export async function deleteCampaign(id: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Sem permissão");

  await db.campaignPage.delete({ where: { id } });
  revalidatePath("/admin/campanhas");
}
