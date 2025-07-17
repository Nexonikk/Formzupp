"use client";

import { toast } from "sonner";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DeleteFormButtonProps = {
  formId: string;
};

export default function DeleteFormButton({ formId }: DeleteFormButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this form?")) return;
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      toast.success("Form deleted successfully!");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete form:", error);
      toast.error("Failed to delete the form. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex-1"
      variant="destructive"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </Button>
  );
}
