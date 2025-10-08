import FormPreview from "@/components/forms/form-preview";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;
  const form = await prisma.form.findUnique({
    where: {
      id: formId,
    },
    include: {
      questions: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!form) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* py-12 */}
      <FormPreview form={form} />
      {/* <div className="container mx-auto bg-white dark:bg-red-500 rounded-lg shadow">
      </div> */}
    </div>
  );
}
