import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const activities = await prisma.stageActivity.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(activities);
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "O nome da atividade é obrigatório." }, { status: 400 });
    }

    const count = await prisma.stageActivity.count();
    const newActivity = await prisma.stageActivity.create({
      data: {
        name,
        order: count,
      },
    });

    return NextResponse.json(newActivity, { status: 201 });
  } catch (error) {
    console.error("Falha ao criar atividade de Stage:", error);
    return NextResponse.json({ error: "Não foi possível criar a atividade." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { order, delete: deleteIds } = await req.json();

    await prisma.$transaction(async (tx) => {
      for (const { id, order: idx } of order) {
        await tx.stageActivity.update({ where: { id }, data: { order: idx } });
      }

      if (deleteIds && deleteIds.length > 0) {
        await tx.stageActivity.deleteMany({ where: { id: { in: deleteIds } } });
      }
    });

    return NextResponse.json({ message: "Checklist de Stage atualizado com sucesso." });
  } catch (error) {
    console.error("Falha ao atualizar atividades de Stage:", error);
    return NextResponse.json({ error: "Não foi possível salvar as alterações." }, { status: 500 });
  }
}