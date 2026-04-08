import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { compare, hash } from "bcryptjs";
import { profileSchema, changePasswordSchema } from "@/lib/validations/profile";

// PATCH /api/user/profile — atualiza nome e/ou data de nascimento
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = await req.json();
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const user = await db.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      birthDate: parsed.data.birthDate ? new Date(parsed.data.birthDate) : undefined,
    },
    select: { id: true, name: true, email: true, birthDate: true },
  });

  return NextResponse.json({ message: "Perfil atualizado!", user });
}

// PUT /api/user/profile — troca de senha
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = await req.json();
  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { currentPassword, newPassword } = parsed.data;

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  });

  if (!user?.password) {
    return NextResponse.json(
      { error: "Conta sem senha definida (OAuth)." },
      { status: 400 }
    );
  }

  const currentMatch = await compare(currentPassword, user.password);
  if (!currentMatch) {
    return NextResponse.json({ error: "Senha atual incorreta." }, { status: 400 });
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { password: await hash(newPassword, 12) },
  });

  return NextResponse.json({ message: "Senha alterada com sucesso!" });
}
