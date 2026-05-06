import { create } from "zustand";

import { Question, FormGeneration } from "@/types/form-store";

export const useFormStore = create<{
  id: string | null;
  title: string;
  description: string;
  questions: Question[];
  originalPrompt: string | null;
  setGeneratedForm: (formData: FormGeneration) => void;
  resetForm: () => void;
}>((set) => ({
  id: null,
  title: "",
  description: "",
  questions: [],
  originalPrompt: "",

  setGeneratedForm: (formData) => set({ ...formData }),
  resetForm: () =>
    set({
      id: null,
      title: "",
      description: "",
      questions: [],
      originalPrompt: "",
    }),
}));
