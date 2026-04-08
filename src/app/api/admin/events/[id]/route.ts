import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { eventSchema } from "@/lib/validations/event";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const data = parsed.data;

  try {
    const event = await db.event.update({
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
    return NextResponse.json(event);
  } catch {
    return NextResponse.json({ error: "Evento não encontrado ou slug duplicado" }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { id } = await params;

  try {
    await db.event.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
  }
}
