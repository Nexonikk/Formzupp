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

export const questionSchema = z.object({
  content: z.string().min(1, "Question content is required"),
  required: z.boolean(),
  type: fieldTypeSchema,
});

export const formGenerationSchema = z.object({
  title: z.string(),
  description: z.string(),
  questions: z.array(questionSchema),
});
