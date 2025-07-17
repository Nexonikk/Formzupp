import { create } from "zustand";

export type FieldType =
  | "shortText"
  | "longText"
  | "number"
  | "email"
  | "phone"
  | "calendar";

export interface Question {
  content: string;
  required: boolean;
  type: FieldType;
}

export interface FormGeneration {
  id?: string | null;
  title: string;
  description: string;
  questions: Question[];
  originalPrompt?: string;
}

export const useFormStore = create<{
  id: string | null;
  title: string;
  description: string;
  questions: Question[];
  originalPrompt: string;
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
