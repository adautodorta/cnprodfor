import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true }
  });
  return NextResponse.json(users);
}

export async function PATCH(request: Request) {
  const { id, role } = await request.json();
  if (!id || !role) {
    return NextResponse.json({ error: "ID e role são obrigatórios" }, { status: 400 });
  }
  const user = await prisma.user.update({
    where: { id },
    data: { role }
  });
  return NextResponse.json(user);
}