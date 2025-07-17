"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddPromptModal } from "./add-prompt-modal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useFormStore } from "@/store/FormStore";
import { FormGeneration } from "@/lib/schema";
import { generateRandomId } from "@/lib/utils";

type Props = {
  label?: string;
};

export default function CreateFormButton({ label }: Props) {
  const [showPromptModal, setShowPromptModal] = useState(false);
  const { setGeneratedForm } = useFormStore.getState();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmitPrompt = async ({
    prompt,
    topics,
  }: {
    prompt: string;
    topics?: string;
  }) => {
    try {
      console.log("under handleSubmitPrompt:", prompt, topics);
      setIsLoading(true);
      const response = await fetch("/api/forms/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, topics }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create form");
      }
      const generatedData = await response.json();

      const finalFormData: FormGeneration = {
        ...generatedData,
        originalPrompt: prompt,
        id: `form_${generateRandomId()}`,
      };

      setGeneratedForm(finalFormData);
      router.push(`/dashboard/forms/create`);
      setShowPromptModal(false);
      toast.success("Form generated successfully!");
      return finalFormData;
    } catch (error) {
      console.error("Error creating form:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create form. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        className="main-btn-outline"
        variant={"ghost"}
        onClick={() => setShowPromptModal(true)}
      >
        <Plus />
        {label || "Generate Form"}
      </Button>

      <AddPromptModal
        open={showPromptModal}
        onOpenChange={setShowPromptModal}
        onSubmit={handleSubmitPrompt}
        isLoading={isLoading}
      />
    </>
  );
}
