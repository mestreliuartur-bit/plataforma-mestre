"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { logAudit } from "@/lib/audit";

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
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") throw new Error("Sem permissão");

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
    await logAudit({
      userId: session.user.id,
      userName: session.user.name ?? session.user.email ?? "Admin",
      action: "CREATE",
      entity: "Course",
      entityId: course.id,
      label: `Curso "${course.title}"`,
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
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") throw new Error("Sem permissão");

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
    await logAudit({
      userId: session.user.id,
      userName: session.user.name ?? session.user.email ?? "Admin",
      action: "UPDATE",
      entity: "Course",
      entityId: course.id,
      label: `Curso "${course.title}"`,
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
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") throw new Error("Sem permissão");

  const course = await db.course.delete({ where: { id } });
  await logAudit({
    userId: session.user.id,
    userName: session.user.name ?? session.user.email ?? "Admin",
    action: "DELETE",
    entity: "Course",
    entityId: id,
    label: `Curso "${course.title}"`,
  });
  revalidatePath("/admin/cursos");
}

// ── MODULE ────────────────────────────────────────────────────

export async function createModule(courseId: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") throw new Error("Sem permissão");

  const count = await db.module.count({ where: { courseId } });

  const module_ = await db.module.create({
    data: {
      title: formData.get("title") as string,
      order: count,
      courseId,
    },
  });
  await logAudit({
    userId: session.user.id,
    userName: session.user.name ?? session.user.email ?? "Admin",
    action: "CREATE",
    entity: "Module",
    entityId: module_.id,
    label: `Módulo "${module_.title}"`,
  });

  revalidatePath(`/admin/cursos/${courseId}/modulos`);
}

export async function updateModule(id: string, courseId: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") throw new Error("Sem permissão");

  const module_ = await db.module.update({
    where: { id },
    data: { title: formData.get("title") as string },
  });
  await logAudit({
    userId: session.user.id,
    userName: session.user.name ?? session.user.email ?? "Admin",
    action: "UPDATE",
    entity: "Module",
    entityId: module_.id,
    label: `Módulo "${module_.title}"`,
  });

  revalidatePath(`/admin/cursos/${courseId}/modulos`);
}

export async function deleteModule(id: string, courseId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") throw new Error("Sem permissão");

  const module_ = await db.module.delete({ where: { id } });
  await logAudit({
    userId: session.user.id,
    userName: session.user.name ?? session.user.email ?? "Admin",
    action: "DELETE",
    entity: "Module",
    entityId: id,
    label: `Módulo "${module_.title}"`,
  });
  revalidatePath(`/admin/cursos/${courseId}/modulos`);
}

// ── LESSON ────────────────────────────────────────────────────

export async function createLesson(moduleId: string, courseId: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") throw new Error("Sem permissão");

  const count = await db.lesson.count({ where: { moduleId } });

  const lesson = await db.lesson.create({
    data: {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      videoUrl: (formData.get("videoUrl") as string) || null,
      duration: formData.get("duration") ? parseInt(formData.get("duration") as string) : null,
      order: count,
      moduleId,
    },
  });
  await logAudit({
    userId: session.user.id,
    userName: session.user.name ?? session.user.email ?? "Admin",
    action: "CREATE",
    entity: "Lesson",
    entityId: lesson.id,
    label: `Aula "${lesson.title}"`,
  });

  revalidatePath(`/admin/cursos/${courseId}/modulos`);
}

export async function updateLesson(id: string, courseId: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") throw new Error("Sem permissão");

  const lesson = await db.lesson.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      videoUrl: (formData.get("videoUrl") as string) || null,
      duration: formData.get("duration") ? parseInt(formData.get("duration") as string) : null,
    },
  });
  await logAudit({
    userId: session.user.id,
    userName: session.user.name ?? session.user.email ?? "Admin",
    action: "UPDATE",
    entity: "Lesson",
    entityId: lesson.id,
    label: `Aula "${lesson.title}"`,
  });

  revalidatePath(`/admin/cursos/${courseId}/modulos`);
}

export async function deleteLesson(id: string, courseId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") throw new Error("Sem permissão");

  const lesson = await db.lesson.delete({ where: { id } });
  await logAudit({
    userId: session.user.id,
    userName: session.user.name ?? session.user.email ?? "Admin",
    action: "DELETE",
    entity: "Lesson",
    entityId: id,
    label: `Aula "${lesson.title}"`,
  });
  revalidatePath(`/admin/cursos/${courseId}/modulos`);
}

// ── ENROLLMENT ────────────────────────────────────────────────

export async function enrollUser(userId: string, courseId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") throw new Error("Sem permissão");

  await db.userEnrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId },
    update: {},
  });
  await logAudit({
    userId: session.user.id,
    userName: session.user.name ?? session.user.email ?? "Admin",
    action: "CREATE",
    entity: "Enrollment",
    entityId: `${userId}_${courseId}`,
    label: `Matriculou usuário ${userId} no curso ${courseId}`,
  });

  revalidatePath("/admin/cursos");
}
