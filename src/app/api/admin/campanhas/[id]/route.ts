import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Context) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { id } = await params;
  const campaign = await db.campaignPage.findUnique({ where: { id } });
  if (!campaign) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  return NextResponse.json(campaign);
}

export async function DELETE(_req: NextRequest, { params }: Context) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { id } = await params;
  await db.campaignPage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
