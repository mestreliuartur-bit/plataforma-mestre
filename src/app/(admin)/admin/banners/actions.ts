"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function createBanner(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Sem permissão");

  const title = formData.get("title") as string;
  const subtitle = (formData.get("subtitle") as string) || null;
  const imageUrl = formData.get("imageUrl") as string;
  const ctaLabel = formData.get("ctaLabel") as string;
  const ctaUrl = formData.get("ctaUrl") as string;
  const eventId = (formData.get("eventId") as string) || null;
  const order = parseInt((formData.get("order") as string) || "0");

  if (!title || !imageUrl || !ctaLabel || !ctaUrl) {
    // Lança erro visível no formulário via mensagem de erro nativa do HTML
    throw new Error("Preencha todos os campos obrigatórios.");
  }

  await db.banner.create({
    data: {
      title,
      subtitle,
      imageUrl,
      ctaLabel,
      ctaUrl,
      eventId: eventId || null,
      isActive: true,
      order,
    },
  });

  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function toggleBanner(id: string, isActive: boolean) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Sem permissão");

  await db.banner.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function deleteBanner(id: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Sem permissão");

  await db.banner.delete({ where: { id } });
  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function reorderBanner(id: string, order: number) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Sem permissão");

  await db.banner.update({ where: { id }, data: { order } });
  revalidatePath("/admin/banners");
  revalidatePath("/");
}
