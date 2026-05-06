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
  originalPrompt?: string | null;
}
