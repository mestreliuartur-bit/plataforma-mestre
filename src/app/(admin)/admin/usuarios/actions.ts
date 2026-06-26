"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hash } from "bcryptjs";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function createUser(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Sem permissão");

  const name = (formData.get("name") as string).trim();
  const email = (formData.get("email") as string).trim().toLowerCase();
  const phone = (formData.get("phone") as string) || null;
  const birthDate = (formData.get("birthDate") as string) || null;
  const role = formData.get("role") as "USER" | "MODERATOR" | "COURSE_CREATOR" | "ADMIN";
  const password = formData.get("password") as string;

  if (!password || password.length < 6) {
    throw new Error("A senha deve ter no mínimo 6 caracteres");
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) throw new Error("Já existe um usuário com este e-mail");

  await db.user.create({
    data: {
      name,
      email,
      phone: phone?.trim() || null,
      birthDate: birthDate ? new Date(birthDate) : null,
      role,
      password: await hash(password, 12),
    },
  });

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}
