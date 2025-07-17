import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  const { userId } = await auth();
  const { formId } = await params;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const form = await prisma.form.findUnique({
    where: {
      id: formId,
    },
  });

  if (!form) {
    return new NextResponse("Form not found", { status: 404 });
  }

  if (form.userId !== userId) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { title, description, questions } = await req.json();
  // validation
  if (!title) {
    return new NextResponse("Title is required", { status: 400 });
  }
  if (!questions || questions.length === 0) {
    return new NextResponse("At least one question is required", {
      status: 400,
    });
  }

  // update forms details
  const updatedForm = await prisma.form.update({
    where: {
      id: formId,
    },
    data: {
      title,
      description,
    },
  });

  // Delete all existings questions
  await prisma.question.deleteMany({
    where: {
      formId,
    },
  });

  // Create new questions
  await prisma.question.createMany({
    data: questions.map((q: { text: string }, index: number) => ({
      text: q.text,
      formId,
      order: index,
    })),
  });

  return NextResponse.json(updatedForm);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  const { userId } = await auth();
  const { formId } = await params;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const form = await prisma.form.findUnique({
    where: {
      id: formId,
    },
  });

  if (!form) {
    return new NextResponse("Form not found", { status: 404 });
  }

  if (form.userId !== userId) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  await prisma.form.delete({
    where: {
      id: formId,
    },
  });

  return NextResponse.json({ success: true });
}
