"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hash } from "bcryptjs";

export async function updateUser(userId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = (formData.get("phone") as string) || null;
  const birthDate = (formData.get("birthDate") as string) || null;
  const role = formData.get("role") as "USER" | "ADMIN";
  const newPassword = (formData.get("newPassword") as string) || null;

  const data: Record<string, unknown> = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone?.trim() || null,
    role,
    birthDate: birthDate ? new Date(birthDate) : null,
  };

  if (newPassword && newPassword.length >= 6) {
    data.password = await hash(newPassword, 12);
  }

  await db.user.update({ where: { id: userId }, data });

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}
