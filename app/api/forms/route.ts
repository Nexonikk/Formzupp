import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id, title, description, questions } = await req.json();

  if (!title) {
    return new NextResponse("Title is required", { status: 400 });
  }

  if (!questions || questions.length === 0) {
    return new NextResponse("At least one question is required", {
      status: 400,
    });
  }

  console.log(
    "ROute.ts api/forms at line:24 DATA FROM REQ BODY..✅✅✅✅✅✅✅✅✅",
    id
  );

  const form = await prisma.form.create({
    data: {
      userId,
      id,
      title,
      description,
      questions: {
        create: questions.map((q: { text: string }, index: number) => ({
          text: q.text,
          order: index,
        })),
      },
    },
    include: {
      questions: true,
    },
  });

  return NextResponse.json(form);
}
