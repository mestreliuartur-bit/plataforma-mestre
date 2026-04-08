"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { eventSchema, slugify } from "@/lib/validations/event";

export async function createEvent(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Sem permissão");

  const raw = {
    title: formData.get("title") as string,
    slug: (formData.get("slug") as string) || slugify(formData.get("title") as string),
    description: formData.get("description") as string,
    price: formData.get("price") as string,
    coverImage: (formData.get("coverImage") as string) || "",
    type: formData.get("type") as string,
    isActive: formData.get("isActive") === "true",
    isPublished: formData.get("isPublished") === "true",
    maxSlots: (formData.get("maxSlots") as string) || undefined,
    eventDate: (formData.get("eventDate") as string) || undefined,
    location: (formData.get("location") as string) || undefined,
  };

  const parsed = eventSchema.safeParse(raw);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return { error: Object.values(errors).flat()[0] ?? "Dados inválidos" };
  }

  const data = parsed.data;

  try {
    await db.event.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        price: parseFloat(data.price),
        coverImage: data.coverImage || "",
        type: data.type as "PRESENCIAL" | "DISTANCIA",
        isActive: data.isActive,
        isPublished: data.isPublished,
        maxSlots: data.maxSlots ? parseInt(data.maxSlots) : null,
        eventDate: data.eventDate ? new Date(data.eventDate) : null,
        location: data.location || null,
      },
    });
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2002") {
      return { error: "Já existe um evento com este slug. Use um slug diferente." };
    }
    return { error: "Erro ao criar evento. Tente novamente." };
  }

  revalidatePath("/admin/eventos");
  redirect("/admin/eventos");
}

export async function updateEvent(id: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Sem permissão");

  const raw = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    price: formData.get("price") as string,
    coverImage: (formData.get("coverImage") as string) || "",
    type: formData.get("type") as string,
    isActive: formData.get("isActive") === "true",
    isPublished: formData.get("isPublished") === "true",
    maxSlots: (formData.get("maxSlots") as string) || undefined,
    eventDate: (formData.get("eventDate") as string) || undefined,
    location: (formData.get("location") as string) || undefined,
  };

  const parsed = eventSchema.safeParse(raw);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return { error: Object.values(errors).flat()[0] ?? "Dados inválidos" };
  }

  const data = parsed.data;

  try {
    await db.event.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        price: parseFloat(data.price),
        coverImage: data.coverImage || "",
        type: data.type as "PRESENCIAL" | "DISTANCIA",
        isActive: data.isActive,
        isPublished: data.isPublished,
        maxSlots: data.maxSlots ? parseInt(data.maxSlots) : null,
        eventDate: data.eventDate ? new Date(data.eventDate) : null,
        location: data.location || null,
      },
    });
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2002") {
      return { error: "Já existe um evento com este slug." };
    }
    return { error: "Erro ao atualizar evento." };
  }

  revalidatePath("/admin/eventos");
  revalidatePath(`/eventos/${data.slug}`);
  redirect("/admin/eventos");
}

export async function deleteEvent(id: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Sem permissão");

  await db.event.delete({ where: { id } });
  revalidatePath("/admin/eventos");
}
