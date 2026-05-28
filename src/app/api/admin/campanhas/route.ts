import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const campaigns = await db.campaignPage.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(campaigns);
}
