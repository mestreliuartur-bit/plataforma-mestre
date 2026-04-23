"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ── COURSE ────────────────────────────────────────────────────

export async function createCourse(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Sem permissão");

  const title = formData.get("title") as string;
  const slug = (formData.get("slug") as string) || slugify(title);

  try {
    const lpRaw = formData.get("landingPageConfig") as string | null;
    const course = await db.course.create({
      data: {
        title,
        slug,
        description: formData.get("description") as string,
        coverImage: (formData.get("coverImage") as string) || null,
        bannerImage: (formData.get("bannerImage") as string) || null,
        category: (formData.get("category") as string) as never || "OUTROS",
        isPublished: formData.get("isPublished") === "true",
        price: formData.get("price") ? parseFloat(formData.get("price") as string) : null,
        isWhatsappLead: formData.get("isWhatsappLead") === "true",
        whatsappNumber: (formData.get("whatsappNumber") as string) || null,
        landingPageConfig: lpRaw ? JSON.parse(lpRaw) : undefined,
      },
    });
    revalidatePath("/admin/cursos");
    redirect(`/admin/cursos/${course.id}/modulos`);
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2002") {
      return { error: "Já existe um curso com este slug." };
    }
    throw e;
  }
}

export async function updateCourse(id: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Sem permissão");

  try {
    const lpRaw = formData.get("landingPageConfig") as string | null;
    const course = await db.course.update({
      where: { id },
      data: {
        title: formData.get("title") as string,
        slug: formData.get("slug") as string,
        description: formData.get("description") as string,
        coverImage: (formData.get("coverImage") as string) || null,
        bannerImage: (formData.get("bannerImage") as string) || null,
        category: (formData.get("category") as string) as never || "OUTROS",
        isPublished: formData.get("isPublished") === "true",
        price: formData.get("price") ? parseFloat(formData.get("price") as string) : null,
        isWhatsappLead: formData.get("isWhatsappLead") === "true",
        whatsappNumber: (formData.get("whatsappNumber") as string) || null,
        landingPageConfig: lpRaw ? JSON.parse(lpRaw) : undefined,
      },
    });
    revalidatePath("/admin/cursos");
    revalidatePath(`/cursos/${course.slug}`);
    return { success: true };
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2002") {
      return { error: "Já existe um curso com este slug." };
    }
    throw e;
  }
}

export async function deleteCourse(id: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Sem permissão");

  await db.course.delete({ where: { id } });
  revalidatePath("/admin/cursos");
}

// ── MODULE ────────────────────────────────────────────────────

export async function createModule(courseId: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Sem permissão");

  const count = await db.module.count({ where: { courseId } });

  await db.module.create({
    data: {
      title: formData.get("title") as string,
      order: count,
      courseId,
    },
  });

  revalidatePath(`/admin/cursos/${courseId}/modulos`);
}

export async function updateModule(id: string, courseId: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Sem permissão");

  await db.module.update({
    where: { id },
    data: { title: formData.get("title") as string },
  });

  revalidatePath(`/admin/cursos/${courseId}/modulos`);
}

export async function deleteModule(id: string, courseId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Sem permissão");

  await db.module.delete({ where: { id } });
  revalidatePath(`/admin/cursos/${courseId}/modulos`);
}

// ── LESSON ────────────────────────────────────────────────────

export async function createLesson(moduleId: string, courseId: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Sem permissão");

  const count = await db.lesson.count({ where: { moduleId } });

  await db.lesson.create({
    data: {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      videoUrl: (formData.get("videoUrl") as string) || null,
      duration: formData.get("duration") ? parseInt(formData.get("duration") as string) : null,
      order: count,
      moduleId,
    },
  });

  revalidatePath(`/admin/cursos/${courseId}/modulos`);
}

export async function updateLesson(id: string, courseId: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Sem permissão");

  await db.lesson.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      videoUrl: (formData.get("videoUrl") as string) || null,
      duration: formData.get("duration") ? parseInt(formData.get("duration") as string) : null,
    },
  });

  revalidatePath(`/admin/cursos/${courseId}/modulos`);
}

export async function deleteLesson(id: string, courseId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Sem permissão");

  await db.lesson.delete({ where: { id } });
  revalidatePath(`/admin/cursos/${courseId}/modulos`);
}

// ── ENROLLMENT ────────────────────────────────────────────────

export async function enrollUser(userId: string, courseId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Sem permissão");

  await db.userEnrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId },
    update: {},
  });

  revalidatePath("/admin/cursos");
}
