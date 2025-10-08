import { removeAdditionalProperties } from "@/lib/helper";
import { getFormGenPrompt } from "@/lib/prompt";
import { FormGeneration, formGenerationSchema } from "@/lib/schema";
import { zodToJsonSchema } from "zod-to-json-schema";

// Define a common interface for the response to ensure consistency.
interface AIResponse {
  data: FormGeneration;
  provider: "gemini" | "mistral";
}

//  * Calls the Google Gemini API to generate form questions.
async function callGeminiAPI(
  prompt: string,
  topics?: string
): Promise<FormGeneration> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing Gemini API Key in environment variables.");
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

  const formGenerationPrompt = getFormGenPrompt({ prompt, topics });

  const fullJsonSchema = zodToJsonSchema(
    formGenerationSchema,
    "formGenerationSchema"
  );
  const unwrappedSchema = fullJsonSchema.definitions?.formGenerationSchema;

  if (
    !unwrappedSchema ||
    typeof unwrappedSchema !== "object" ||
    !("properties" in unwrappedSchema)
  ) {
    throw new Error(
      "Failed to generate a valid object schema definition from Zod."
    );
  }

  const cleanedSchema = removeAdditionalProperties(unwrappedSchema);

  // FIX: Reverted to the simpler payload structure using responseMimeType and responseSchema.
  const payload = {
    contents: [{ parts: [{ text: formGenerationPrompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: cleanedSchema.properties,
        required: cleanedSchema.required,
      },
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
  const generatedText = apiResponse.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!generatedText) {
    throw new Error("Invalid response structure from Gemini API.");
  }

  const formData = JSON.parse(generatedText);
  return formData as FormGeneration;
}

async function callMistralAPI(
  prompt: string,
  topics?: string
): Promise<FormGeneration> {
  if (!process.env.MISTRAL_API_KEY) {
    throw new Error("Missing Mistral API Key in environment variables.");
  }

  const apiKey = process.env.MISTRAL_API_KEY;
  const apiUrl = "https://api.mistral.ai/v1/chat/completions";

  const formGenerationPrompt = getFormGenPrompt({ prompt, topics });

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
    },
    temperature: 0.7,
    max_tokens: 4096,
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
        errorBody.message || JSON.stringify(errorBody)
      }`
    );
  }

  const apiResponse = await response.json();
  const generatedText = apiResponse.choices?.[0]?.message?.content;
  if (!generatedText) {
    throw new Error("Invalid response structure from Mistral API.");
  }

  const formData = JSON.parse(generatedText);

  if (formData.questions && Array.isArray(formData.questions)) {
    formData.questions = formData.questions.map((q: any) => ({
      content: q.question_text || q.content || q.text,
      required: q.required,
      type: q.field_type || q.type,
    }));
  }

  return formData as FormGeneration;
}

//  Main function. Tries to generate form questions using Gemini first, then falls back to Mistral if the primary provider fails.
export async function generateFormQuestions(
  prompt: string,
  topics?: string
): Promise<AIResponse> {
  try {
    const geminiData = await callGeminiAPI(prompt, topics);
    return {
      data: geminiData,
      provider: "gemini",
    };
  } catch (geminiError) {
    console.error("Gemini failed, falling back to Mistral:", geminiError);
    try {
      const mistralData = await callMistralAPI(prompt, topics);
      return {
        data: mistralData,
        provider: "mistral",
      };
    } catch (mistralError) {
      console.error("Both Gemini and Mistral failed:", {
        geminiError:
          geminiError instanceof Error
            ? geminiError.message
            : String(geminiError),
        mistralError:
          mistralError instanceof Error
            ? mistralError.message
            : String(mistralError),
      });

      // This error will be caught by the route handler and result in a 500 response.
      throw new Error(
        "All AI providers failed to generate the form. Please try again later."
      );
    }
  }
}
