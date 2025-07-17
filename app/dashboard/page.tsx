import CreateFormButton from "@/components/prompt-modal/create-form-button";
import { Button } from "@/components/ui/button";
import { syncUserWithDatabase } from "@/lib/clerk-sync";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Dashboard() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();
  await syncUserWithDatabase();

  const formsCount = await prisma.form.count({
    where: {
      userId,
    },
  });
  const responseCount = await prisma.formResponse.count({
    where: {
      form: {
        userId,
      },
    },
  });

  const recentForms = await prisma.form.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      _count: {
        select: { responses: true },
      },
    },
  });

  return (
    <>
      <div className="space-y-6 p-5">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400 mt-1">Manage your Forms and Responses</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 border">
            <h2 className="text-xl font-medium">Your Forms</h2>
            <p className="text-3xl font-bold mt-2">{formsCount}</p>
            <Button className="mt-4 main-btn-outline" variant={"ghost"} asChild>
              <Link href="/dashboard/forms">View All Forms</Link>
            </Button>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 border">
            <h2 className="text-xl font-medium">Total Responses</h2>
            <p className="text-gray-500 mt-2">
              {responseCount === 0 ? "No Response Yet" : ""}
            </p>

            <p className="text-3xl font-bold mt-2">{responseCount}</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 border">
            <h2 className="text-xl font-medium">Create New</h2>
            <p className="text-gray-500 mt-2">Start building a new form</p>
            <div className="mt-6">
              <CreateFormButton />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 border">
          <h2 className="text-xl font-medium mb-4">Recent Forms</h2>
          {recentForms.length === 0 ? (
            <p>{`You haven't created any forms yet.`}</p>
          ) : (
            <div className="space-y-4">
              {recentForms.map((form) => (
                <div
                  className="flex items-center justify-between border-b pb-4"
                  key={form.id}
                >
                  <div>
                    <h3 className="font-medium">{form.title}</h3>
                    <p className="text-sm text-gray-500">
                      {form._count.responses} responses · Created on{" "}
                      {new Date(form.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button className="main-btn-outline" variant={"ghost"}>
                      <Link href={`/dashboard/forms/${form.id}`}>View</Link>
                    </Button>
                    <Button className="main-btn" variant={"ghost"}>
                      <Link href={`/dashboard/forms/${form.id}/responses`}>
                        Responses
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="space-y-4"></div>
        </div>
      </div>
    </>
  );
}
