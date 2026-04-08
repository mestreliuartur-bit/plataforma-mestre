import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { eventSchema, slugify } from "@/lib/validations/event";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const type = searchParams.get("type") as "PRESENCIAL" | "DISTANCIA" | null;
  const published = searchParams.get("published");

  const events = await db.event.findMany({
    where: {
      ...(type ? { type } : {}),
      ...(published !== null ? { isPublished: published === "true" } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { purchases: true } } },
  });

  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const body = await req.json();
  if (!body.slug && body.title) body.slug = slugify(body.title);

  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const data = parsed.data;

  try {
    const event = await db.event.create({
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
    return NextResponse.json(event, { status: 201 });
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "Slug já existe" }, { status: 409 });
    }
    return NextResponse.json({ error: "Erro ao criar evento" }, { status: 500 });
  }
}
