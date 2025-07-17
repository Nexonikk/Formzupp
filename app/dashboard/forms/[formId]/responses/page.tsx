import FormResponse from "@/components/forms/form-response";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function FormResponsesPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { userId, redirectToSignIn } = await auth();
  const { formId } = await params;

  if (!userId) return redirectToSignIn();

  const form = await prisma.form.findUnique({
    where: {
      id: formId,
      userId,
    },
    include: {
      responses: {
        include: {
          answers: {
            include: {
              question: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!form) {
    redirect("/dashboard/forms");
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Form Responses</h1>
          <p className="text-gray-500 mt-1">
            {form.title} - {form.responses.length} resoponses
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/dashboard/forms/${formId}`}>Back to Form</Link>
        </Button>
      </div>

      {form.responses.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-gray-500">No responses yet.</p>
          <p className="text-gray-500 mt-1">
            Share your form to collect responses.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {form.responses.map((response) => (
            <FormResponse key={response.id} response={response} />
          ))}
        </div>
      )}
    </div>
  );
}
