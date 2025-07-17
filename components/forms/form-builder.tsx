"use client";

import { FormEvent, useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useFormStore } from "@/store/FormStore";

type Question = {
  id: string;
  text: string;
};

type FormBuilderProps = {
  initialData?: {
    id?: string;
    title: string;
    description: string | null;
    questions: Question[];
  };
  isEditing?: boolean;
};

const emptyFormState = {
  id: "",
  title: "",
  description: "",
  questions: [{ id: "1", text: "" }],
};

export default function FormBuilder({
  initialData,
  isEditing = false,
}: FormBuilderProps) {
  const router = useRouter();
  const {
    title: storeTitle,
    id: storeId,
    description: storeDescription,
    questions: storeQuestions,
    resetForm,
  } = useFormStore((state) => state);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(emptyFormState);

  useEffect(() => {
    if (isEditing && initialData) {
      setForm({
        id: initialData.id || "",
        title: initialData.title || "",
        description: initialData.description || "",
        questions:
          initialData.questions?.length > 0
            ? initialData.questions
            : [{ id: uuidv4(), text: "" }],
      });
    } else if (!isEditing && storeId) {
      setForm({
        id: storeId,
        title: storeTitle || "",
        description: storeDescription || "",
        questions:
          storeQuestions.length > 0
            ? storeQuestions.map((q) => ({
                id: uuidv4(),
                text: q.content || "",
              }))
            : [{ id: uuidv4(), text: "" }],
      });
    }
  }, [
    initialData,
    isEditing,
    storeId,
    storeTitle,
    storeDescription,
    storeQuestions,
  ]);

  const addQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [...prev.questions, { id: uuidv4(), text: "" }],
    }));
  };

  const removeQuestion = (index: number) => {
    if (form.questions.length > 1) {
      setForm((prev) => ({
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index),
      }));
    } else {
      toast.error("Form must have at least one question");
    }
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...form.questions];
    updatedQuestions[index].text = value;
    setForm({ ...form, questions: updatedQuestions });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (form.questions.some((q) => !q.text.trim())) {
      toast.error("All questions must have text");
      return;
    }

    try {
      setIsSubmitting(true);

      const url = isEditing ? `/api/forms/${storeId}` : "/api/forms";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Something went wrong saving the form."
        );
      }

      const data = await response.json();
      toast.success(isEditing ? "Form updated!" : "Form created!", {
        description: "Your form has been saved successfully.",
      });

      console.log(`Form saved successfully! LASTEST ID : ${data.id}`);

      if (!isEditing) {
        resetForm();
      }

      router.push(`/dashboard/forms/${data.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error saving form:", error);
      toast.error("Error saving form", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isEditing) {
      resetForm();
    }
    router.back();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Enter form title"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Enter form description"
            className="mt-1"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Questions</h3>
          <Button variant="outline" type="button" onClick={addQuestion}>
            Add Question
          </Button>
        </div>

        {form.questions.map((question, index) => (
          <div key={question.id} className="space-y-2 p-4 border rounded-md">
            <div className="flex items-center justify-between">
              <Label htmlFor={`Question-${index}`}>Question {index + 1}</Label>
              <Button
                variant="ghost"
                type="button"
                size="sm"
                className="text-red-500 hover:text-red-700"
                onClick={() => removeQuestion(index)}
              >
                remove
              </Button>
            </div>
            <Textarea
              id={`Question-${index}`}
              value={question.text}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              placeholder="Enter your question"
              className="mt-1"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : isEditing
            ? "Update Form"
            : "Create Form"}
        </Button>
      </div>
    </form>
  );
}
