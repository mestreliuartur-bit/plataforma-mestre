import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validação server-side (nunca confiar só no cliente)
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos.", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { firstName, lastName, phone, email, password, birthDate } = parsed.data;

    // Verificar se e-mail já está cadastrado
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado." },
        { status: 409 }
      );
    }

    // Hash da senha
    const hashedPassword = await hash(password, 12);

    // Criar usuário
    const user = await db.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        password: hashedPassword,
        phone,
        birthDate: new Date(birthDate),
      },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    return NextResponse.json(
      { message: "Conta criada com sucesso!", user },
      { status: 201 }
    );
  } catch (err) {
    console.error("[REGISTER_ERROR]", err);
    return NextResponse.json(
      { error: "Erro interno. Tente novamente." },
      { status: 500 }
    );
  }
}
