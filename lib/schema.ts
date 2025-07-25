import { z } from "zod";

export const promptSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  topics: z.string().optional(),
});

export const fieldTypeSchema = z.enum([
  "number",
  "shortText",
  "longText",
  "email",
  "phone",
  "calendar",
]);

export type FieldType = z.infer<typeof fieldTypeSchema>;

export const questionSchema = z.object({
  content: z.string().min(1, "Question content is required"),
  required: z.boolean(),
  type: fieldTypeSchema,
});

export type Question = z.infer<typeof questionSchema>;

export const formGenerationSchema = z.object({
  title: z.string(),
  description: z.string(),
  questions: z.array(questionSchema),
});

export type FormGeneration = z.infer<typeof formGenerationSchema> & {
  id?: string;
  originalPrompt?: string;
};

export type ApiFormResponse = z.infer<typeof formGenerationSchema>;
