"use client";

import { Question } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import FormChatInterface, { FormCompletionData } from "./FormChatInterface";

type FormPreviewProps = {
  form: {
    id: string;
    title: string;
    description: string | null;
    questions: Question[];
  };
};

export default function FormPreview({ form }: FormPreviewProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChatComplete = async (data: FormCompletionData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formId: form.id,
          answers: data.answers,
          respondentName: data.respondentName,
          respondentEmail: data.respondentEmail,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      toast.success("Response submitted!", {
        description: "Thank you for completing this form.",
      });

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error", {
        description: "Something went wrong while submitting your response.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen p-2">
      <FormChatInterface
        formTitle={form.title}
        formDescription={form.description}
        questions={form.questions.sort((a, b) => a.order - b.order)}
        onComplete={handleChatComplete}
      />
    </div>
  );
}
