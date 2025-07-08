import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const activities = await prisma.p1Activity.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(activities);
}

export async function PATCH(req: Request) {
  const { order, delete: deleteIds } = await req.json();

  for (const { id, order: idx } of order) {
    await prisma.p1Activity.update({ where: { id }, data: { order: idx } });
  }
  if (deleteIds && deleteIds.length > 0) {
    await prisma.p1Activity.deleteMany({ where: { id: { in: deleteIds } } });
  }
  return NextResponse.json({ ok: true });
}