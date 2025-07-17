import { removeAdditionalProperties } from "@/lib/helper";
import { getFormGenPrompt } from "@/lib/prompt";
import { FormGeneration, formGenerationSchema } from "@/lib/schema";
import { zodToJsonSchema } from "zod-to-json-schema";

export async function generateFormQuestions(
  prompt: string,
  topics?: string
): Promise<FormGeneration> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing API Key");
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  try {
    const formGenerationPrompt = getFormGenPrompt({
      prompt,
      topics,
    });

    const fullJsonSchema = zodToJsonSchema(
      formGenerationSchema,
      "formGenerationSchema"
    );

    let unwrappedSchema = fullJsonSchema.definitions?.formGenerationSchema;
    if (!unwrappedSchema) {
      throw new Error("Failed to generate schema definition");
    }

    unwrappedSchema = removeAdditionalProperties(unwrappedSchema);

    const payload = {
      contents: [{ role: "user", parts: [{ text: formGenerationPrompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: unwrappedSchema,
        temperature: 0.7,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("API Error Response:", JSON.stringify(errorBody, null, 2));
      throw new Error(
        `API request failed with status ${response.status}: ${errorBody.error.message}`
      );
    }

    const apiResponse = await response.json();
    const generatedText = apiResponse.candidates[0].content.parts[0].text;
    const formData = JSON.parse(generatedText);
    console.log("FORM DATA IN API.TS", formData);
    return formData as FormGeneration;
  } catch (error) {
    console.error("Error generating form questions:", error);
    throw error;
  }
}
