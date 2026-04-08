import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { bannerSchema } from "@/lib/validations/event";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const banners = await db.banner.findMany({
    orderBy: { order: "asc" },
    include: { event: { select: { title: true, slug: true } } },
  });

  return NextResponse.json(banners);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = bannerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const banner = await db.banner.create({ data: parsed.data });
  revalidatePath("/");

  return NextResponse.json(banner, { status: 201 });
}
