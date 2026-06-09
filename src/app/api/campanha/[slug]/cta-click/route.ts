import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  await db.campaignPage.updateMany({
    where: { slug, isActive: true },
    data: { ctaClicks: { increment: 1 } },
  });

  return NextResponse.json({ ok: true });
}
