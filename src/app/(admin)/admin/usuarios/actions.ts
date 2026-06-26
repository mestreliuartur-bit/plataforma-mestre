"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hash } from "bcryptjs";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { logAudit } from "@/lib/audit";

export async function createUser(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") throw new Error("Sem permissão");

  const name = (formData.get("name") as string).trim();
  const email = (formData.get("email") as string).trim().toLowerCase();
  const phone = (formData.get("phone") as string) || null;
  const birthDate = (formData.get("birthDate") as string) || null;
  const role = formData.get("role") as "USER" | "MODERATOR" | "COURSE_CREATOR" | "ADMIN" | "SUPERADMIN";
  const password = formData.get("password") as string;

  if (!password || password.length < 6) {
    throw new Error("A senha deve ter no mínimo 6 caracteres");
  }

  if (role === "SUPERADMIN" && session.user.role !== "SUPERADMIN") {
    throw new Error("Somente um SUPERADMIN pode atribuir esse nível de permissão");
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) throw new Error("Já existe um usuário com este e-mail");

  const user = await db.user.create({
    data: {
      name,
      email,
      phone: phone?.trim() || null,
      birthDate: birthDate ? new Date(birthDate) : null,
      role,
      password: await hash(password, 12),
    },
  });

  await logAudit({
    userId: session.user.id,
    userName: session.user.name ?? session.user.email ?? "Admin",
    action: "CREATE",
    entity: "User",
    entityId: user.id,
    label: `Usuário "${user.name}" (${user.role})`,
  });

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}
