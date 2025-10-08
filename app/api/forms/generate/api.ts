import { removeAdditionalProperties } from "@/lib/helper";
import { getFormGenPrompt } from "@/lib/prompt";
import { FormGeneration, formGenerationSchema } from "@/lib/schema";
import { zodToJsonSchema } from "zod-to-json-schema";

interface AIResponse {
  data: FormGeneration;
  provider: "gemini" | "mistral";
}

async function callGeminiAPI(
  prompt: string,
  topics?: string
): Promise<FormGeneration> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing Gemini API Key");
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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
    console.error(
      "Gemini API Error Response:",
      JSON.stringify(errorBody, null, 2)
    );
    throw new Error(
      `Gemini API request failed with status ${response.status}: ${
        errorBody.error?.message || "Unknown error"
      }`
    );
  }

  const apiResponse = await response.json();
  const generatedText = apiResponse.candidates[0].content.parts[0].text;
  const formData = JSON.parse(generatedText);
  // Debug log removed for production
  return formData as FormGeneration;
}

async function callMistralAPI(
  prompt: string,
  topics?: string
): Promise<FormGeneration> {
  if (!process.env.MISTRAL_API_KEY) {
    throw new Error("Missing Mistral API Key");
  }

  const apiKey = process.env.MISTRAL_API_KEY;
  const apiUrl = "https://api.mistral.ai/v1/chat/completions";

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
    model: "mistral-large-latest",
    messages: [
      {
        role: "user",
        content: `${formGenerationPrompt}\n\nPlease respond with a valid JSON object that matches the required schema.`,
      },
    ],
    response_format: {
      type: "json_object",
      schema: unwrappedSchema,
    },
    temperature: 0.7,
    max_tokens: 2000,
  };

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    console.error(
      "Mistral API Error Response:",
      JSON.stringify(errorBody, null, 2)
    );
    throw new Error(
      `Mistral API request failed with status ${response.status}: ${
        errorBody.error?.message || "Unknown error"
      }`
    );
  }

  const apiResponse = await response.json();
  const generatedText = apiResponse.choices[0].message.content;
  const formData = JSON.parse(generatedText);
  // Debug log removed for production
  return formData as FormGeneration;
}

// ----------------------------------------------

export async function generateFormQuestions(
  prompt: string,
  topics?: string
): Promise<AIResponse> {
  // Try Gemini first
  try {
    // Debug log removed for production
    const geminiData = await callGeminiAPI(prompt, topics);
    return {
      data: geminiData,
      provider: "gemini",
    };
  } catch (geminiError) {
    console.error("Gemini failed, falling back to Mistral:", geminiError);

    // If Gemini fails, try Mistral
    try {
      // Debug log removed for production
      const mistralData = await callMistralAPI(prompt, topics);
      return {
        data: mistralData,
        provider: "mistral",
      };
    } catch (mistralError) {
      console.error("Both Gemini and Mistral failed:", {
        geminiError:
          geminiError instanceof Error ? geminiError.message : geminiError,
        mistralError:
          mistralError instanceof Error ? mistralError.message : mistralError,
      });

      throw new Error(
        "All AI providers failed to generate the form. Please try again later."
      );
    }
  }
}
