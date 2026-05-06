import { z } from "zod";
import { fieldTypeSchema, questionSchema, formGenerationSchema } from "@/lib/schema";

export type FieldType = z.infer<typeof fieldTypeSchema>;
export type Question = z.infer<typeof questionSchema>;
export type FormGeneration = z.infer<typeof formGenerationSchema> & {
  id?: string | null;
  originalPrompt?: string | null;
};
export type ApiFormResponse = z.infer<typeof formGenerationSchema>;
