import { FormGeneration } from "@/types/schema";

export interface AIResponse {
  data: FormGeneration;
  provider: "gemini" | "mistral";
}
