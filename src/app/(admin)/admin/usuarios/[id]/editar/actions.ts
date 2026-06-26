"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { hash } from "bcryptjs";
import { logAudit } from "@/lib/audit";

export async function updateUser(userId: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") throw new Error("Sem permissão");

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = (formData.get("phone") as string) || null;
  const birthDate = (formData.get("birthDate") as string) || null;
  const role = formData.get("role") as "USER" | "MODERATOR" | "COURSE_CREATOR" | "ADMIN" | "SUPERADMIN";
  const newPassword = (formData.get("newPassword") as string) || null;

  if (role === "SUPERADMIN" && session.user.role !== "SUPERADMIN") {
    throw new Error("Somente um SUPERADMIN pode atribuir esse nível de permissão");
  }

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

  const updated = await db.user.update({ where: { id: userId }, data });

  await logAudit({
    userId: session.user.id,
    userName: session.user.name ?? session.user.email ?? "Admin",
    action: "UPDATE",
    entity: "User",
    entityId: updated.id,
    label: `Usuário "${updated.name}" (${updated.role})${newPassword ? " — senha redefinida" : ""}`,
  });

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}
