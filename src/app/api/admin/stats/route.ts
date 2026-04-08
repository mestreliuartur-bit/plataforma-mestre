import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const [totalUsers, totalEvents, totalPurchases, revenueResult] = await Promise.all([
    db.user.count({ where: { role: "USER" } }),
    db.event.count(),
    db.purchase.count({ where: { status: "CONFIRMED" } }),
    db.purchase.aggregate({ where: { status: "CONFIRMED" }, _sum: { pricePaid: true } }),
  ]);

  return NextResponse.json({
    totalUsers,
    totalEvents,
    totalPurchases,
    totalRevenue: Number(revenueResult._sum.pricePaid ?? 0),
  });
}
