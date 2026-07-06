import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { articleId, content, guestName } = await request.json();

  if (!articleId || !content || !guestName) {
    return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      articleId,
      content,
      guestName,
    },
    include: { author: { select: { name: true } } },
  });

  return NextResponse.json({
    ...comment,
    createdAt: comment.createdAt.toISOString(),
  });
}
